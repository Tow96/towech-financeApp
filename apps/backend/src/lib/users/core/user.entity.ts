import { User as ClerkUser } from '@clerk/backend';

export class User {
  private clerkUser: ClerkUser;

  constructor(clerkUser: ClerkUser) {
    this.clerkUser = clerkUser;
  }

  get id() {
    return this.clerkUser.id;
  }
}
