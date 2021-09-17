import { User } from './user';

export interface SoldItem {
  amount: number;
  createdAt: Date;
  description: string;
  label: string;
  metadata: any;
  photoUrl: string;
  quantity: number;
  buyer: User;
}
