import { BaseResponse } from './BaseResponse';
import { Address } from '../storage/Address';

export interface LineSummary {
  name: string;
  description: string;
  subtotal: number;
}

export interface OrderSummary {
  lines: LineSummary[];
  totalPrice: number;
  address: Address;
  customerName: string;
}

export class OrderResponse extends BaseResponse<OrderSummary[]> {
  public constructor(message: string, payload: OrderSummary[]) {
    super(200, message, payload);
  }
}
