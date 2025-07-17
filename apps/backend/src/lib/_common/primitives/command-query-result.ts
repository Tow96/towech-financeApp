export enum CommandQueryResult {
  Success = 'SUCCESS',
  Conflict = 'CONFLICT',
  NotFound = 'NOT_FOUND',
}

export interface Result<T> {
  status: CommandQueryResult;
  message: T;
}
