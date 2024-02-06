/** CategoryService.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Class that makes requests to the CategoryService
 */
import React from 'react';
import { AxiosResponse } from 'axios';
import CustomAxios from './CustomAxios';

// Stores
import { TokenAction } from '../Hooks/UseToken';

// Models
// import { Responses } from '../models';

export default class CategoryService {
  private token: { token: string };
  private tokenDispatch: React.Dispatch<TokenAction> | undefined;
  private instance: CustomAxios;
  private SERVICE_URL: string;

  constructor(token?: { token: string }, tokenDispatch?: React.Dispatch<TokenAction>) {
    this.token = token || ({} as { token: string });
    this.tokenDispatch = tokenDispatch;
    this.instance = new CustomAxios(this.token, this.tokenDispatch);
    this.SERVICE_URL = this.instance.ROOT_URL + '';
  }

  async getCategories(
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.get(`${this.SERVICE_URL}/categories`, loading);
  }
}