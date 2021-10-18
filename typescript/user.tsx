import { Person } from './entity';

export interface User {
  email: string;
  primaryPerson: Person;
}

export interface UserInfo {
  email: string;
  primaryPerson: Person;
}
