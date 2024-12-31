import { CreateUserCommandHandler } from '../User/Commands/CreateUser/CreateUser.CommandHandler';
import { GetUserQueryHandler } from '../User/Queries/GetUser/GetUser.QueryHandler';

export const ApplicationCommands = [CreateUserCommandHandler];
export const ApplicationQueries = [GetUserQueryHandler];
