import { IBaseModel } from 'src/common/interfaces/base.model';
import {
  IOrganizationStructureModel,
  OrganizationStructureTransformer,
} from 'src/modules/organization/models/organization-structure.model';
import {
  IOrganizationModel,
  OrganizationTransformer,
} from 'src/modules/organization/models/organization.model';
import {
  AdminUserTransformer,
  IAdminUserModel,
} from 'src/modules/user/models/admin-user.model';
import {
  IRegularUserModel,
  RegularUserTransformer,
} from 'src/modules/user/models/regular-user.model';
import { VolunteerEntity } from '../entities/volunteer.entity';
import { VolunteerStatus } from '../enums/volunteer-status.enum';
import {
  IVolunteerProfileModel,
  VolunteerProfileModelTransformer,
} from './volunteer-profile.model';

export interface IVolunteerModel extends IBaseModel {
  id: string;
  status: VolunteerStatus;

  archivedOn: Date;
  blockedOn: Date;

  // Relations
  volunteerProfile: IVolunteerProfileModel;
  archivedBy: IAdminUserModel; // If the user leaves the organization, archivedBy will be null
  blockedBy: IAdminUserModel;
  organization: IOrganizationModel;
  user: IRegularUserModel;
}

export type CreateVolunteerOptions = {
  userId: IVolunteerModel['user']['id'];
  organizationId: IVolunteerModel['organization']['id'];
};

export type FindVolunteerOptions = Partial<IVolunteerModel> & {
  userId?: IVolunteerModel['user']['id'];
  organizationId?: IVolunteerModel['organization']['id'];
};

export class VolunteerModelTransformer {
  static fromEntity(volunteer: VolunteerEntity): IVolunteerModel {
    if (!volunteer) return null;
    return {
      id: volunteer.id,
      status: volunteer.status,

      archivedOn: volunteer.archivedOn,
      blockedOn: volunteer.blockedOn,

      archivedBy: AdminUserTransformer.fromEntity(volunteer.archivedBy),
      blockedBy: AdminUserTransformer.fromEntity(volunteer.blockedBy),

      // Relations
      volunteerProfile: VolunteerProfileModelTransformer.fromEntity(
        volunteer.volunteerProfile,
      ),
      organization: OrganizationTransformer.fromEntity(volunteer.organization),
      user: RegularUserTransformer.fromEntity(volunteer.user),

      updatedOn: volunteer.updatedOn,
      createdOn: volunteer.createdOn,
    };
  }

  static toEntity(volunteer: CreateVolunteerOptions): VolunteerEntity {
    const entity = new VolunteerEntity();

    entity.userId = volunteer.userId;
    entity.organizationId = volunteer.organizationId;

    return entity;
  }
}
