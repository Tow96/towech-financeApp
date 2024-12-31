export interface WorkerChangeEmail {
  _id: string;
  email: string;
  token: string;
}

export interface WorkerChangePassword {
  _id: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface WorkerGetUserById {
  _id: string;
}

export interface WorkerGetUserByUsername {
  username: string;
}

export interface WorkerPasswordReset {
  _id: string;
  token: string | undefined;
}

export interface WorkerRegisterUser {
  name: string;
  email: string;
  role: string;
}
