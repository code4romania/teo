import { Inject, Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization-repository.interface';
import {
  ICreateOrganizationModel,
  IFindOrganizationModel,
  IOrganizationModel,
} from '../models/organization.model';
import { OrganizationRepositoryService } from '../repositories/organization.repository';

@Injectable()
export class OrganizationFacadeService {
  constructor(
    @Inject(OrganizationRepositoryService)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  public async findOrganization(
    options:
      | Partial<IFindOrganizationModel>
      | Partial<IFindOrganizationModel>[], // TODO move in model
  ): Promise<IOrganizationModel> {
    return this.organizationRepository.find(options);
  }

  public async updateOrganizationDescription(
    organizationId: string,
    description: string,
  ): Promise<IOrganizationModel> {
    return this.organizationRepository.update(organizationId, description);
  }

  public async createOrganization(
    organization: ICreateOrganizationModel,
  ): Promise<IOrganizationModel> {
    return this.organizationRepository.create(organization);
  }
}
