// TODO: Add roles enumerator

export interface CreateUser {
  name: string;
  mail: string;
  role: 'admin' | 'user';
}
