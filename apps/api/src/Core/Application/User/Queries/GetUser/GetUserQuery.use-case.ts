import { Injectable } from '@nestjs/common';

import { GetUserQuery, GetUserQueryResponse } from './GetUserQuery.dto';
import { IUserRepository } from '../../../../Domain/User/Abstractions/IUserRepository';

@Injectable()
export class GetUserQueryUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async run(dto: GetUserQuery): Promise<GetUserQueryResponse> {
    const user = await this.userRepository.findById(dto.id);
    // TODO: create exceptions
    if (!user) throw new Error('User not found!');

    return {
      name: user.Name,
      email: user.Email,
      role: user.Role,
      id: user.Id,
      accountConfirmed: user.AccountConfirmed,
    };
  }
}
