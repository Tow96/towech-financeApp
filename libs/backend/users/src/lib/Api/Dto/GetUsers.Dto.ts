export class GetUsersDto {
  id: string;
  email: string;
  name: string;

  constructor(id: string, email: string, name: string) {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}
