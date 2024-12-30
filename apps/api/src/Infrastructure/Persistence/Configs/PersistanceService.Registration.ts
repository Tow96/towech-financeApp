import { IUserRepository } from '../../../Core/Domain/User/Abstractions/User.Repository';
import { UserRepository } from '../User/Repositories/User.Repository';

export const PersistenceService = [{ provide: IUserRepository, useClass: UserRepository }];
