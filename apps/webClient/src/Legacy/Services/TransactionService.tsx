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

// Models
import { Objects, Requests, Responses } from '../models';

export default class TransactionService {
  private readonly token: string;
  private instance: CustomAxios;
  private readonly SERVICE_URL: string;

  constructor(token?: string) {
    this.token = token || '';
    this.instance = new CustomAxios(this.token);
    this.SERVICE_URL = this.instance.ROOT_URL + '';
  }

  async deleteTransaction(
    id: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Responses.ChangeTransactionResponse>> {
    return (await this.instance.delete(
      `${this.SERVICE_URL}/transactions/${id}`,
      loading
    )) as AxiosResponse<Responses.ChangeTransactionResponse>;
  }

  async deleteWallet(
    id: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Objects.Wallet>> {
    return (await this.instance.delete(
      `${this.SERVICE_URL}/wallets/${id}`,
      loading
    )) as AxiosResponse<Objects.Wallet>;
  }

  async editTransaction(
    transactionId: string,
    transaction: Objects.Transaction,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Responses.ChangeTransactionResponse>> {
    return (await this.instance.patch(
      `${this.SERVICE_URL}/transactions/${transactionId}`,
      transaction,
      loading
    )) as AxiosResponse<Responses.ChangeTransactionResponse>;
  }

  async editWallet(
    wallet: Objects.Wallet,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Objects.Wallet>> {
    return (await this.instance.patch(
      `${this.SERVICE_URL}/wallets/${wallet._id}`,
      wallet,
      loading
    )) as AxiosResponse<Objects.Wallet>;
  }

  async getWallets(
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Objects.Wallet[]>> {
    return (await this.instance.get(`${this.SERVICE_URL}/wallets`, loading)) as AxiosResponse<
      Objects.Wallet[]
    >;
  }

  async getWalletTransactions(
    walletId: string,
    dataMonth: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Objects.Transaction[]>> {
    return (await this.instance.get(
      `${this.SERVICE_URL}/wallets/${walletId}/transactions?datamonth=${dataMonth}`,
      loading
    )) as AxiosResponse<Objects.Transaction[]>;
  }

  async transferBetweenWallets(
    payload: Requests.WorkerTransfer,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Responses.ChangeTransactionResponse>> {
    return (await this.instance.post(
      `${this.SERVICE_URL}/wallets/transfer`,
      payload,
      loading
    )) as AxiosResponse<Responses.ChangeTransactionResponse>;
  }

  async newTransaction(
    payload: Objects.Transaction,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Responses.ChangeTransactionResponse>> {
    return (await this.instance.post(
      `${this.SERVICE_URL}/transactions`,
      payload,
      loading
    )) as AxiosResponse<Responses.ChangeTransactionResponse>;
  }

  async newWallet(
    payload: Objects.Wallet,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<Objects.Wallet>> {
    return (await this.instance.post(
      `${this.SERVICE_URL}/wallets`,
      payload,
      loading
    )) as AxiosResponse<Objects.Wallet>;
  }
}
