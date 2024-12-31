import { IUserRepository } from '@financeApp/backend-domain';
import { UserRepository } from '../User/Repositories/User.Repository';

export const PersistenceService = [{ provide: IUserRepository, useClass: UserRepository }];
