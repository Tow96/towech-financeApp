// export default interface User {
//   _id: string;
//   name: string;
//   username: string;
//   password: string | undefined;
//   role: string;
//   accountConfirmed: boolean;
//   refreshTokens: string[];
//   singleSessionToken: string | undefined;
//   resetToken: string | undefined;
//   createdAt: Date;
// }

// The base user contains the data that any admin can see (and modify)
export interface BaseUser {
  _id: string;
  accountConfirmed: boolean;
  createdAt: Date;
  name: string;
  role: 'admin' | 'user';
  username: string;
}

// The frontend user contains the fields that only the owner of the account can see
export interface FrontendUser extends BaseUser {
  refreshTokens: string[] | undefined;
  resetToken: string | undefined;
  singleSessionToken: string | undefined;
}

// The backend user contains data that should only be managed by the authorized services
export interface BackendUser extends FrontendUser {
  password: string;
}
