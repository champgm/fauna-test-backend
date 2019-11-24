import { Customer } from './Customer';
import { Address } from './Address';
import { CreditCard } from './CreditCard';
import { Product } from './Product';

export class ProductState {
  product: Product;
  quantity: number;
  price: number;
}

export class Order {
  customer: Customer;
  line: ProductState[];
  status: string;
  creationDate: string;
  shipAddress: Address;
  creditCard: CreditCard;
}
