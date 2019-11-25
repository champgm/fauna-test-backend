import path from 'path';
import express from 'express';
import bunyan from 'bunyan';

import { Configuration } from '../common/Configuration';
import { RequestHandler } from './RequestHandler';
import { BaseResponse } from '../response/BaseResponse';
import { StorageUtil } from '../storage/StorageUtil';
import { OrderSummary, LineSummary , OrderSummaryResponse } from '../response/OrderResponse';
import { Order } from '../storage/Order';

export class OrderSummaryHandler extends RequestHandler {
  logger: bunyan;

  constructor(
    protected configuration: Configuration,
    protected storageHandler: StorageUtil,
    incomingLogger: bunyan,
  ) {
    super(configuration);
    this.logger = incomingLogger.child({ file: path.basename(__filename) });
  }

  public async handle(request: express.Request): Promise<BaseResponse<any>> {
    const orders = await this.storageHandler.getOrders();
    const orderSummaries: OrderSummary[] = orders.map(this.mapOrderToOrderSummary);
    return new OrderSummaryResponse('Successfully retrieved order summaries', orderSummaries);
  }

  mapOrderToOrderSummary(order: Order): OrderSummary {
    const lines = order.line.map((line) => {
      return {
        name: line.product.name,
        description: line.product.description,
        subtotal: line.quantity,
      };
    });
    const totalPrice = lines.reduce((price: number, lineSummary: LineSummary) => {
      return price + lineSummary.subtotal;
    }, 0);
    console.log(`order${JSON.stringify(order, null, 2)}`);
    return {
      lines,
      totalPrice,
      address: order.shipAddress,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      status: order.status,
    };
  }
}
