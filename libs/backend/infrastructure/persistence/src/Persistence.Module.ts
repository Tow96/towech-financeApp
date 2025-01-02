import { Module } from '@nestjs/common';
import { IUserRepository } from '@financeApp/backend-domain';
import { UserRepository } from './User/Repositories/User.Repository';

@Module({
  providers: [{ provide: IUserRepository, useClass: UserRepository }],
  exports: [IUserRepository],
})
export class PersistenceModule {}
