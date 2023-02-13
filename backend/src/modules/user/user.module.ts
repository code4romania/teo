import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AdminUserEntity,
  RegularUserEntity,
  UserEntity,
} from './entities/user.entity';
import { AdminUserRepositoryService } from './repositories/admin-user.repository';
import { UserFacadeService } from './services/user-facade.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AdminUserEntity, RegularUserEntity]),
  ],
  providers: [UserFacadeService, AdminUserRepositoryService],
  exports: [UserFacadeService],
})
export class UserModule {}
