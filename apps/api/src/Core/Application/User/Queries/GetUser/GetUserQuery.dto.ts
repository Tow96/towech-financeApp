export interface GetUserQuery {
  id: string;
}

export interface GetUserQueryResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  accountConfirmed: boolean;
}
