import { Injectable } from '@nestjs/common';
import { IUseCaseService } from 'src/common/interfaces/use-case-service.interface';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { AccessCodeExceptionMessages } from 'src/modules/organization/exceptions/access-codes.exceptions';
import { AccessCodeFacade } from 'src/modules/organization/services/access-code.facade';

@Injectable()
export class DeleteAccessCodeUseCase implements IUseCaseService<string> {
  constructor(
    private readonly accessCodeFacade: AccessCodeFacade,
    private readonly exceptionService: ExceptionsService,
  ) {}

  public async execute(id: string): Promise<string> {
    const accessCode = await this.accessCodeFacade.delete(id);

    if (!accessCode) {
      this.exceptionService.notFoundException(
        AccessCodeExceptionMessages.ACCESS_CODE_001,
      );
    }

    return accessCode;
  }
}
