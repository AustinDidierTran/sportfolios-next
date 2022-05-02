import { Organization, Person } from './types';

export interface CartItem {
  checked: boolean;
  description: string;
  id: string;
  label: string;
  metadata: any;
  price: number;
  taxRates: TaxRate[];
}

export interface CartItemSeller {
  entity: Organization;
  isMember: boolean;
  items: CartItem[];
}

export interface CartItemBuyer {
  person: Person;
  sellers: CartItemSeller[];
}

export interface TaxRate {
  id: string;
  display: string;
  percentage: string;
  amount: number;
}
