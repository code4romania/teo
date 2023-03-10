import { Injectable } from '@nestjs/common';
import { IUseCaseService } from 'src/common/interfaces/use-case-service.interface';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { ActivityTypeExceptionMessages } from 'src/modules/activity-type/exceptions/activity-type.exceptions';
import {
  IActivityTypeModel,
  UpdateActivityTypeDataOptions,
} from 'src/modules/activity-type/models/activity-type.model';
import { ActivityTypeFacade } from 'src/modules/activity-type/services/activity-type.facade';
import { OrganizationStructureType } from 'src/modules/organization/enums/organization-structure-type.enum';
import { GetOneOrganizationStructureUseCase } from '../organization/organization-structure/get-one-organization-structure.usecase';

@Injectable()
export class UpdateActivityTypeUseCase
  implements IUseCaseService<IActivityTypeModel>
{
  constructor(
    private readonly activityTypeFacade: ActivityTypeFacade,
    private readonly getOneOrganizationStructureUseCase: GetOneOrganizationStructureUseCase,
    private readonly exceptionService: ExceptionsService,
  ) {}

  public async execute(
    updates: UpdateActivityTypeDataOptions,
  ): Promise<IActivityTypeModel> {
    // 1. Find the record to be updated for duplicate check
    const toUpdate = await this.activityTypeFacade.find({
      id: updates.id,
    });

    if (!toUpdate) {
      this.exceptionService.notFoundException(
        ActivityTypeExceptionMessages.ACTIVITY_TYPE_001,
      );
    }

    // 2. Find if there is any duplicate (Organization - Name)
    const duplicate = await this.activityTypeFacade.find({
      name: updates.name,
      organizationId: toUpdate.organization.id,
    });

    if (duplicate && duplicate.id !== toUpdate.id) {
      this.exceptionService.badRequestException(
        ActivityTypeExceptionMessages.ACTIVITY_TYPE_002,
      );
    }

    // Validate OrganizationStructures exist, are in the current organization and are correct (branch is branch, department is department, etc)
    try {
      if (updates.branchId)
        await this.getOneOrganizationStructureUseCase.execute({
          id: updates.branchId,
          organizationId: toUpdate.organization.id,
          type: OrganizationStructureType.BRANCH,
        });
      if (updates.departmentId)
        await this.getOneOrganizationStructureUseCase.execute({
          id: updates.departmentId,
          organizationId: toUpdate.organization.id,
          type: OrganizationStructureType.DEPARTMENT,
        });
      if (updates.roleId)
        await this.getOneOrganizationStructureUseCase.execute({
          id: updates.roleId,
          organizationId: toUpdate.organization.id,
          type: OrganizationStructureType.ROLE,
        });
    } catch (error) {
      this.exceptionService.badRequestException(
        ActivityTypeExceptionMessages.ACTIVITY_TYPE_004,
      );
    }

    return this.activityTypeFacade.update(updates);
  }
}
