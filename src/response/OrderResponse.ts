import { BaseResponse } from './BaseResponse';
import { Address } from '../storage/Address';

export interface LineSummary {
  name: string;
  description: string;
  subtotal: number;
}

export interface OrderSummary {
  address: Address;
  customerName: string;
  lines: LineSummary[];
  status: string;
  totalPrice: number;
}

export class OrderSummaryResponse extends BaseResponse<OrderSummary[]> {
  public constructor(message: string, payload: OrderSummary[]) {
    super(200, message, payload);
  }
}
