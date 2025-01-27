export interface LoginRequest {
  username: string;
  password: string;
  keepSession: boolean;
}

export interface NewCategoryRequest {
  icon_id: number;
  parent_id: string;
  name: string;
  type: string;
  global: boolean;
}
