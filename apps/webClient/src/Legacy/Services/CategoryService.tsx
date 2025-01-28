/** CategoryService.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Class that makes requests to the CategoryService
 */
import React from 'react';
import { AxiosResponse } from 'axios';
import CustomAxios from './CustomAxios';

// Models
import { Responses } from '../models';

export default class CategoryService {
  private readonly token: string;
  private instance: CustomAxios;
  private readonly SERVICE_URL: string;

  constructor(token?: string) {
    this.token = token || '';
    this.instance = new CustomAxios(this.token);
    this.SERVICE_URL = this.instance.ROOT_URL + '';
  }

  async getCategories(
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Responses.GetCategoriesResponse>> {
    return (await this.instance.get(
      `${this.SERVICE_URL}/categories`,
      loading
    )) as AxiosResponse<Responses.GetCategoriesResponse>;
  }
}
