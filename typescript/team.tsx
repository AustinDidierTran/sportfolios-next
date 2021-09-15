import { Person } from './person';

export interface Team {
  id: string;
  name: string;
  photoUrl: string;
  admins: Person[];
  deletedAt: Date;
}
