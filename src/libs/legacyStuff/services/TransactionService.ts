/** TransactionService.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Class that makes requests to the TransactionService
 * - Manages Wallet creation and administration
 * - Manages Transaction administration
 */
import React from 'react';
import { AxiosResponse } from 'axios';
import CustomAxios from './CustomAxios';

// Stores
import { TokenAction } from '../Hooks/UseToken';

// Models
// import { Objects, Requests, Responses } from '../models';

export default class TransactionService {
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

  async deleteTransaction(
    id: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.delete(`${this.SERVICE_URL}/transactions/${id}`, loading);
  }

  async deleteWallet(
    id: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.delete(`${this.SERVICE_URL}/wallets/${id}`, loading);
  }

  async editTransaction(
    transactionId: string,
    transaction: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.patch(
      `${this.SERVICE_URL}/transactions/${transactionId}`,
      transaction,
      loading
    );
  }

  async editWallet(
    wallet: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.patch(`${this.SERVICE_URL}/wallets/${wallet._id}`, wallet, loading);
  }

  async getWallets(
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.get(`${this.SERVICE_URL}/wallets`, loading);
  }

  async getWalletTransactions(
    walletid: string,
    dataMonth: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.get(
      `${this.SERVICE_URL}/wallets/${walletid}/transactions?datamonth=${dataMonth}`,
      loading
    );
  }

  async transferBetweenWallets(
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.post(`${this.SERVICE_URL}/wallets/transfer`, payload, loading);
  }

  async newTransaction(
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.post(`${this.SERVICE_URL}/transactions`, payload, loading);
  }

  async newWallet(
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse> {
    return await this.instance.post(`${this.SERVICE_URL}/wallets`, payload, loading);
  }
}
