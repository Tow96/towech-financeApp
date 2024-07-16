/** CustomAxios.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Axios instance that can use and refresh the authToken
 */
import React from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';

// Stores
import { TokenAction, TokenState } from '../Hooks/UseToken';
import { Responses } from '../models';

// Functions

const rootURL = process.env.REACT_APP_WEBAPI || '';

/** getAuthToken
 * Makes a request to refresh the authentication token
 *
 * @param {React.Dispatch<tokenAction>} tokenDispatch Dispatch for the token
 */
async function getAuthToken(tokenDispatch: React.Dispatch<TokenAction>): Promise<string> {
  try {
    const res: AxiosResponse<Responses.AuthenticationResponse> = await axios.post(
      `${rootURL}/authentication/refresh`,
      null,
      {
        withCredentials: true,
      },
    );
    tokenDispatch({ type: 'REFRESH', payload: res.data });
    return res.data.token;
  } catch (err) {
    tokenDispatch({ type: 'LOGOUT', payload: { token: '' } });
    return '';
  }
}

/** mAxios
 * Axios instance equipped with the ability to modify the token Store, is used to
 * constantly refresh the authentication token
 *
 * @param {string} token Current token
 * @param {React.Dispatch<tokenAction>} tokenDispatch Dispatch to update the token
 */
const mAxios = (token: string, tokenDispatch?: React.Dispatch<TokenAction>): AxiosInstance => {
  // Axios instance for making requests
  const axiosInstance = axios.create();

  // If a token dispatch is given, the interceptors are set
  if (tokenDispatch) {
    axiosInstance.interceptors.request.use(
      async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        let nuToken = token;

        // If there is no authToken, gets a new one
        if (!token) {
          nuToken = await getAuthToken(tokenDispatch);
        }
        // If there is one, checks if it isn't expired
        else {
          const decodedToken: any = jwtDecode(token);
          // If the authToken is expired, gets a newOne
          if (decodedToken.exp * 1000 < Date.now()) {
            nuToken = await getAuthToken(tokenDispatch);
          }
        }

        // sets the token as header
        config.headers = {
          Authorization: `Bearer ${nuToken}`,
        };

        return config;
      },
      (error) => {
        // console.log('api-request-error');
        return Promise.reject(error);
      },
    );
  }

  return axiosInstance;
};

/** customAxios
 * Axios instance that allows the use of two different versions of http requests
 *
 * - The first version is the regular ones.
 * - The second version sends the requests with cookies.
 *
 * This offers an extra layer of protection to the cookies of the system
 */
export default class CustomAxios {
  private token: TokenState;
  private tokenDispatch: React.Dispatch<TokenAction> | undefined;
  public ROOT_URL = rootURL;

  constructor(token: TokenState, tokenDispatch?: React.Dispatch<TokenAction>) {
    this.token = token;
    this.tokenDispatch = tokenDispatch;
  }

  async get(url: string, loading?: React.Dispatch<React.SetStateAction<boolean>>): Promise<AxiosResponse<any>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token.token, this.tokenDispatch).get(url);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }

  async post(
    url: string,
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token.token, this.tokenDispatch).post(url, payload);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }

  async postCookie(
    url: string,
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token.token, this.tokenDispatch).post(url, payload, { withCredentials: true });
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }

  async patch(
    url: string,
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token.token, this.tokenDispatch).patch(url, payload);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }

  async put(
    url: string,
    payload: any,
    loading?: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<AxiosResponse<any>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token.token, this.tokenDispatch).put(url, payload);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }

  async delete(url: string, loading?: React.Dispatch<React.SetStateAction<boolean>>): Promise<AxiosResponse<any>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token.token, this.tokenDispatch).delete(url);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }
}
