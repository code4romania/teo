import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDirection } from 'src/common/enums/order-direction.enum';
import {
  Pagination,
  RepositoryWithPagination,
} from 'src/infrastructure/base/repository-with-pagination.class';
import { VolunteerProfileEntity } from 'src/modules/volunteer/entities/volunteer-profile.entity';
import { Repository } from 'typeorm';
import { OrganizationStructureEntity } from '../entities/organization-structure.entity';
import { OrganizationStructureType } from '../enums/organization-structure-type.enum';
import { IOrganizationStructureRepository } from '../interfaces/organization-structure-repository.interface';
import {
  ICreateOrganizationStructureModel,
  IFindAllOrganizationStructureModel,
  IFindAllOrganizationStructurePaginatedModel,
  IFindOrganizationStructureModel,
  IOrganizationStructureModel,
  IUpdateOrganizationStructureModel,
  OrganizationStructureTransformer,
} from '../models/organization-structure.model';

@Injectable()
export class OrganizationStructureRepositoryService
  extends RepositoryWithPagination<OrganizationStructureEntity>
  implements IOrganizationStructureRepository
{
  constructor(
    @InjectRepository(OrganizationStructureEntity)
    private readonly structureRepository: Repository<OrganizationStructureEntity>,
  ) {
    super(structureRepository);
  }

  async create(
    newStructure: ICreateOrganizationStructureModel,
  ): Promise<IOrganizationStructureModel> {
    const structure = await this.structureRepository.save(
      OrganizationStructureTransformer.toEntity(newStructure),
    );

    return this.find({ id: structure.id });
  }

  async find(
    findOptions: IFindOrganizationStructureModel,
  ): Promise<IOrganizationStructureModel> {
    const structure = await this.structureRepository.findOne({
      where: findOptions,
      relations: {
        createdBy: true,
      },
    });

    return structure
      ? OrganizationStructureTransformer.fromEntity(structure)
      : null;
  }

  async findMany(
    findOptions: IFindAllOrganizationStructurePaginatedModel,
  ): Promise<Pagination<IOrganizationStructureModel>> {
    const { type, organizationId, orderBy, orderDirection } = findOptions;

    const query = this.structureRepository
      .createQueryBuilder('structure')
      .leftJoinAndMapOne(
        'structure.createdBy',
        'structure.createdBy',
        'createdBy',
      )
      .loadRelationCountAndMap(
        'structure.numberOfMembers',
        `structure.${this.getPropertyByType(type)}`,
      )
      .select()
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(vp.id)', 'numberOfMembers')
          .from(VolunteerProfileEntity, 'vp')
          .where(
            `vp.${OrganizationStructureType.BRANCH.toLocaleLowerCase()}.id = structure.id`,
          );
      }, 'numberOfMembers')
      .where(
        'structure.type = :type AND structure.organizationId = :organizationId',
        { type, organizationId },
      )
      .groupBy(`structure.id, createdBy.id`)
      .orderBy(
        `${
          orderBy === 'numberOfMembers'
            ? '"numberOfMembers"'
            : this.buildOrderByQuery('structure', orderBy) || 'structure.name'
        }`,
        orderDirection || OrderDirection.ASC,
      );

    // Order by
    // 1. For relations and maps check if orderBy field contains "."
    // 1.1 if it has then send it as is
    // 1.2 if not prefix it with the entity prefix
    // 2. For aggregate columns such as SUM, COUNT

    return this.findManyPaginatedQuery(
      query,
      findOptions,
      OrganizationStructureTransformer.fromEntity,
    );
  }

  async findAll(
    options: IFindAllOrganizationStructureModel,
  ): Promise<IOrganizationStructureModel[]> {
    const structures = await this.structureRepository.find({
      where: options,
    });

    return structures.map(OrganizationStructureTransformer.fromEntity);
  }

  async update({
    id,
    ...updates
  }: IUpdateOrganizationStructureModel): Promise<IOrganizationStructureModel> {
    await this.structureRepository.update({ id }, { ...updates });

    return this.find({ id });
  }

  async delete(id: string): Promise<string> {
    const structure = await this.structureRepository.findOneBy({ id });

    if (structure) {
      await this.structureRepository.remove(structure);
      return id;
    }

    return null;
  }

  private getPropertyByType(type: OrganizationStructureType): string {
    let property = 'volunteerProfileBranches';
    switch (type) {
      case OrganizationStructureType.BRANCH:
        property = 'volunteerProfileBranches';
        break;
      case OrganizationStructureType.DEPARTMENT:
        property = 'volunteerProfileDepartments';
        break;
      case OrganizationStructureType.ROLE:
        property = 'volunteerProfileRoles';
        break;
    }

    return property;
  }

  private buildOrderByQuery = (prefix: string, orderBy?: string): string => {
    // if order by is undefined skip
    if (!orderBy) return orderBy;

    // if orderBy contains field from relation entity leave it as is otherwise add entity prefix
    return orderBy.split('.').length > 1 ? orderBy : `${prefix}.${orderBy}`;
  };
}
