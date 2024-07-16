/** UserService.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Class that makes requests to the UserService
 * - Manages the Login
 * - Logout
 * - Token Refreshing
 */
import { AxiosResponse } from 'axios';
import CustomAxios from './CustomAxios';

// Stores
import { TokenAction, TokenState } from '../Hooks/UseToken';

// Models
import { Responses } from '../models';

export default class AuthenticationService {
  private token: TokenState;
  private tokenDispatch: React.Dispatch<TokenAction> | undefined;
  private instance: CustomAxios;
  private SERVICE_URL: string;

  constructor(token?: TokenState, tokenDispatch?: React.Dispatch<TokenAction>) {
    this.token = token || ({} as TokenState);
    this.tokenDispatch = tokenDispatch;
    this.instance = new CustomAxios(this.token, this.tokenDispatch);
    this.SERVICE_URL = this.instance.ROOT_URL + '/authentication';
  }

  async login(
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<Responses.AuthenticationResponse>> {
    return await this.instance.postCookie(`${this.SERVICE_URL}/login`, payload, loading);
  }

  async logout(): Promise<AxiosResponse<null>> {
    return await this.instance.postCookie(`${this.SERVICE_URL}/logout`, null);
  }

  async logoutAll(): Promise<AxiosResponse<null>> {
    return await this.instance.postCookie(`${this.SERVICE_URL}/logout-all`, null);
  }

  async refreshToken(
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<Responses.AuthenticationResponse>> {
    return await this.instance.postCookie(`${this.SERVICE_URL}/refresh`, null, loading);
  }
}
