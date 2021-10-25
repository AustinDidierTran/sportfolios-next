export interface ITicketOption {
  name: string;
  description: string;
  price: number;
}

export interface ITicket {
  id: string;
  buyer: {
    email: string;
    completeName: string;
  };
  number: number;
  name: string;
  optionId: string;
  redeemedOn?: Date;
}
