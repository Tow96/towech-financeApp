/** CustomAxios.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Axios instance that can use and refresh the authToken
 */
import React from 'react';
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

// Stores
import { Responses } from '../models';

// Functions

const rootURL = process.env.NEXT_PUBLIC_WEBAPI || '';

/** getAuthToken
 * Makes a request to refresh the authentication token
 *
 */
async function getAuthToken(): Promise<string> {
  try {
    const res: AxiosResponse<Responses.AuthenticationResponse> = await axios.post(
      `${rootURL}/refresh`,
      null,
      {
        withCredentials: true,
      }
    );
    return res.data.token;
  } catch (err) {
    console.error(err);
    return '';
  }
}

/** mAxios
 * Axios instance equipped with the ability to modify the token Store, is used to
 * constantly refresh the authentication token
 *
 * @param {string} token Current token
 */
const mAxios = (token: string): AxiosInstance => {
  // Axios instance for making requests
  const axiosInstance = axios.create();

  // If a token dispatch is given, the interceptors are set
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      let nuToken = token;

      // If there is no authToken, gets a new one
      if (!token) {
        nuToken = await getAuthToken();
      }
      // If there is one, checks if it isn't expired
      else {
        const decodedToken: { exp: number } = jwtDecode(token);
        // If the authToken is expired, gets a newOne
        if (decodedToken.exp * 1000 < Date.now()) {
          nuToken = await getAuthToken();
        }
      }

      // sets the token as header
      config.headers.set('Authorization', `Bearer ${nuToken}`);

      return config;
    },
    (error) => {
      // console.log('Api-request-error');
      return Promise.reject(error);
    }
  );

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
  private token: string;
  public ROOT_URL = rootURL;

  constructor(token: string) {
    this.token = token;
  }

  async get(
    url: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<unknown>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token).get(url);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }

  async post(
    url: string,
    payload: unknown,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<unknown>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token).post(url, payload);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }

  async patch(
    url: string,
    payload: unknown,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<unknown>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token).patch(url, payload);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }

  async delete(
    url: string,
    loading?: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<AxiosResponse<unknown>> {
    if (loading) loading(true);
    try {
      const res = await mAxios(this.token).delete(url);
      if (loading) loading(false);
      return res;
    } catch (err) {
      if (loading) loading(false);
      throw err;
    }
  }
}
