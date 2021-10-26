import { User } from './user';

export interface ITicketOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface ITicket {
  id: string;
  buyer: User;
  number: number;
  name: string;
  option: ITicketOption;
  optionId: string;
  redeemedOn?: Date;
}
