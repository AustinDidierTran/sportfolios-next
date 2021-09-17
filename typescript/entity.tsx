export interface Entity {
  id: string;
  name: string;
  photoUrl: string;
  deletedAt?: Date;
}

export interface Person extends Entity {
  surname: string;
}

export interface Team extends Entity {
  admins: Person[];
}
