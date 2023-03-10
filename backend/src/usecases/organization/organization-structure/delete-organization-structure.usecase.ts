import { Injectable } from '@nestjs/common';
import { IUseCaseService } from 'src/common/interfaces/use-case-service.interface';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { OrganizationStructureExceptionMessages } from 'src/modules/organization/exceptions/organization-structure.exceptions';
import { OrganizationStructureFacade } from 'src/modules/organization/services/organization-structure.facade';

@Injectable()
export class DeleteOrganizationStructureUseCase
  implements IUseCaseService<string>
{
  constructor(
    private readonly organizationStructureFacade: OrganizationStructureFacade,
    private readonly exceptionService: ExceptionsService,
  ) {}

  public async execute(id: string): Promise<string> {
    const removed = await this.organizationStructureFacade.delete(id);

    if (!removed) {
      this.exceptionService.notFoundException(
        OrganizationStructureExceptionMessages.ORGANIZATION_STRUCTURE_001,
      );
    }

    return removed;
  }
}
