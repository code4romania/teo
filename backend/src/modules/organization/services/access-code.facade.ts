import { Injectable } from '@nestjs/common';
import {
  IAccessCodeModel,
  ICreateAccessCodeModel,
  IFindAccessCodeModel,
  IUpdateAccessCodeModel,
} from '../models/access-code.model';
import { AccessCodeRepositoryService } from '../repositories/access-code.repository';

@Injectable()
export class AccessCodeFacade {
  constructor(
    private readonly accessCodeRepository: AccessCodeRepositoryService,
  ) {}

  public async find(
    findOptions: IFindAccessCodeModel,
  ): Promise<IAccessCodeModel> {
    return this.accessCodeRepository.find(findOptions);
  }

  public async update(
    updateAccessCodeModel: IUpdateAccessCodeModel,
  ): Promise<IAccessCodeModel> {
    return this.accessCodeRepository.update(updateAccessCodeModel);
  }

  public async create(
    createAccessCodeModel: ICreateAccessCodeModel,
  ): Promise<IAccessCodeModel> {
    return this.accessCodeRepository.create(createAccessCodeModel);
  }

  public async delete(id: string): Promise<IAccessCodeModel> {
    return this.accessCodeRepository.delete(id);
  }
}
