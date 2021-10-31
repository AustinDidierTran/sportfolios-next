import { Person } from './entity';

export interface User {
  email: string;
  primaryPerson: Person;
}

export interface UserInfo {
  primaryPerson: {
    id: string;
    personId: string;
    name: string;
    photoUrl: string;
    surname: string;
  };
  persons: {
    personId: string;
    name: string;
    photoUrl: string;
    surname: string;
  }[];
  language: string;
  userId: string;
}
