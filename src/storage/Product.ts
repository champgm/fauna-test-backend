import { Warehouse } from './Warehouse';

export class Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  warehouse: Warehouse[];
  backorderLimit: number;
  backordered: boolean;
}
