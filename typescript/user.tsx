import { Person } from './entity';

export interface User {
  email: string;
  primaryPerson: Person;
}
