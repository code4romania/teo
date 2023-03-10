import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IUseCaseService } from 'src/common/interfaces/use-case-service.interface';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { AnnouncementStatus } from 'src/modules/announcement/enums/announcement-status.enum';
import { AnnouncementExceptionMessages } from 'src/modules/announcement/exceptions/announcement.exceptions';
import {
  CreateAnnouncementOptions,
  IAnnouncementModel,
} from 'src/modules/announcement/models/announcement.model';
import { AnnouncementFacade } from 'src/modules/announcement/services/announcement.facade';
import { EVENTS } from 'src/modules/notifications/constants/events.constants';
import SendAnnouncementEvent from 'src/modules/notifications/events/others/send-announcement.event';
import { OrganizationStructureType } from 'src/modules/organization/enums/organization-structure-type.enum';
import { OrganizationStructureFacade } from 'src/modules/organization/services/organization-structure.facade';
import { VolunteerStatus } from 'src/modules/volunteer/enums/volunteer-status.enum';
import { VolunteerFacade } from 'src/modules/volunteer/services/volunteer.facade';

@Injectable()
export class CreateAnnouncementUseCase
  implements IUseCaseService<IAnnouncementModel>
{
  constructor(
    private readonly announcementFacade: AnnouncementFacade,
    private readonly eventEmitter: EventEmitter2,
    private readonly exceptionsService: ExceptionsService,
    private readonly volunteerFacade: VolunteerFacade,
    private readonly organizationStructureFacade: OrganizationStructureFacade,
  ) {}

  public async execute(
    announcement: CreateAnnouncementOptions,
  ): Promise<IAnnouncementModel> {
    // 1. Check if only departments were chosen and calculate the total number of volunteers
    let targetedVolunteers = 0;

    if (announcement.targetsIds?.length) {
      const departments = await this.organizationStructureFacade.findAllByIds({
        ids: announcement.targetsIds,
        type: OrganizationStructureType.DEPARTMENT,
        organizationId: announcement.organizationId,
      });

      if (departments.length !== announcement.targetsIds.length) {
        this.exceptionsService.badRequestException(
          AnnouncementExceptionMessages.ANNOUNCEMENT_003,
        );
      }

      departments.forEach(
        (department) => (targetedVolunteers += department.members),
      );
    } else {
      targetedVolunteers = await this.volunteerFacade.count({
        organizationId: announcement.organizationId,
        status: VolunteerStatus.ACTIVE,
      });
    }

    // 2. Create announcement
    const newAnouncement = await this.announcementFacade.create({
      ...announcement,
      targetedVolunteers,
    });

    // 3. Send email to targets if announcement is published
    if (newAnouncement.status === AnnouncementStatus.PUBLISHED) {
      this.eventEmitter.emit(
        EVENTS.OTHER.SEND_ANNOUNCEMENT,
        new SendAnnouncementEvent(
          newAnouncement.organizationId,
          newAnouncement.id,
          announcement.targetsIds,
        ),
      );
    }

    return newAnouncement;
  }
}
