/** TransactionService.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved.
 *
 * Class that makes requests to the UserService
 * - Manages changes in user information
 * - Allows an admin to manage other user accounts
 */
import React from 'react';
import { AxiosResponse } from 'axios';
import CustomAxios from './CustomAxios';

// Stores
import { TokenAction, TokenState } from '../Hooks/UseToken';

// Models
import { Objects, Requests } from '../models';

export default class UserService {
  private token: TokenState;
  private tokenDispatch: React.Dispatch<TokenAction> | undefined;
  private instance: CustomAxios;
  private SERVICE_URL: string;

  constructor(token?: TokenState, tokenDispatch?: React.Dispatch<TokenAction>) {
    this.token = token || ({} as TokenState);
    this.tokenDispatch = tokenDispatch;
    this.instance = new CustomAxios(this.token, this.tokenDispatch);
    this.SERVICE_URL = this.instance.ROOT_URL + '';
  }

  async changePassword(
    values: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.put(`${this.SERVICE_URL}/users/password`, values, loading);
  }

  /** deleteUser
   * Deletes the user from the DB, only admins can do this
   */
  async deleteUser(
    id: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<Objects.User.BaseUser>> {
    return await this.instance.delete(`${this.SERVICE_URL}/users/${id}`, loading);
  }

  /** editUser
   * Sends a patch request that edits the user
   */
  async editUser(
    id: string,
    user: Objects.User.BackendUser,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.patch(`${this.SERVICE_URL}/users/${id}`, user, loading);
  }

  /** getUsers
   * Gets the basic info of all users in the DB, it will only work for admin users
   */
  async getUsers(
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<Objects.User.BaseUser[]>> {
    return await this.instance.get(`${this.SERVICE_URL}/users`, loading);
  }

  /** generateResetPassword Token
   * Sends the email of the uaser that wants to reset their password
   */
  async generateResetPasswordToken(
    email: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.post(`${this.SERVICE_URL}/users/reset`, { username: email }, loading);
  }

  /** validateResetPasswordToken
   * Sends an api call to verify if a resetToken is valid
   */
  async validateResetPasswordToken(
    token: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.get(`${this.SERVICE_URL}/users/reset/${token}`, loading);
  }

  /** registerUser
   * Adds a user to the db, only admins can get a valid response
   */
  async registerUser(
    user: Requests.WorkerRegisterUser,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<Objects.User.BaseUser>> {
    return await this.instance.post(`${this.SERVICE_URL}/users/register`, user, loading);
  }

  /** setResetNewPassword
   * Sets a new password using a resetPasswordToken
   */
  async setResetNewPassword(
    token: string,
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.post(`${this.SERVICE_URL}/users/reset/${token}`, payload, loading);
  }

  /** updateEmail
   * Changes the email of the user
   */
  async updateEmail(
    email: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.put(`${this.SERVICE_URL}/users/email`, { email: email }, loading);
  }

  /** resendVerificationEmail
   * resends the email verification
   */
  async resendVerificationEmail(loading?: React.Dispatch<React.SetStateAction<boolean>>): Promise<AxiosResponse<any>> {
    return await this.instance.get(`${this.SERVICE_URL}/users/email`, loading);
  }

  /** verifyEmail */
  async verifyEmail(
    token: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    return await this.instance.patch(`${this.SERVICE_URL}/authentication/verify/${token}`, null, loading);
  }
}
