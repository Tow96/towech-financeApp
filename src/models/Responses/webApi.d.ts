import Category from '../Objects/category'

export interface AuthenticationResponse {
  token: string;
}

export interface GetCategoriesResponse {
  Income: Category[],
  Expense: Category[],
  Archived: Category[],
}
