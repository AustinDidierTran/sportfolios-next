import { Entity } from './entity';
import { Person } from './person';

export interface Team extends Entity {
  admins: Person[];
}
