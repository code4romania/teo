import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessRequestEntity } from '../entities/access-request.entity';
import { IAccessRequestRepository } from '../interfaces/access-request-repository.interface';
import {
  AccessRequestTransformer,
  CreateAccessRequestModel,
  FindAccessRequestModel,
  IAccessRequestModel,
  UpdateAccessRequestModel,
} from '../model/access-request.model';

@Injectable()
export class AccessRequestRepository implements IAccessRequestRepository {
  constructor(
    @InjectRepository(AccessRequestEntity)
    private readonly accessRequestRepository: Repository<AccessRequestEntity>,
  ) {}

  findAll(findOptions: unknown): Promise<IAccessRequestModel[]> {
    throw new Error('Method not implemented.');
  }

  async find(
    findOptions: FindAccessRequestModel,
  ): Promise<IAccessRequestModel> {
    const accessRequest = await this.accessRequestRepository.findOne({
      where: { ...findOptions },
      relations: {
        updatedBy: true,
        requestedBy: true,
      },
    });

    return accessRequest
      ? AccessRequestTransformer.fromEntity(accessRequest)
      : null;
  }

  async update({
    id,
    ...updates
  }: UpdateAccessRequestModel): Promise<IAccessRequestModel> {
    await this.accessRequestRepository.update({ id }, { ...updates });

    return this.find({ id });
  }

  async create(
    newRequest: CreateAccessRequestModel,
  ): Promise<IAccessRequestModel> {
    const accessRequestEntity = await this.accessRequestRepository.save(
      AccessRequestTransformer.toEntity(newRequest),
    );

    return AccessRequestTransformer.fromEntity(accessRequestEntity);
  }

  async delete(id: string): Promise<string> {
    const accessRequest = await this.accessRequestRepository.findOneBy({ id });

    if (accessRequest) {
      await this.accessRequestRepository.remove(accessRequest);
      return id;
    }

    return null;
  }
}