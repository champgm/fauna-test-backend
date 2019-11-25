import path from 'path';
import express from 'express';
import bunyan from 'bunyan';

import { Configuration } from '../common/Configuration';
import { RequestHandler } from './RequestHandler';
import { BaseResponse } from '../response/BaseResponse';
import { StorageUtil } from '../storage/StorageUtil';
import { SuccessResponse } from '../response/SuccessResponse';
import { OrderSummary, LineSummary } from '../response/OrderResponse';
import { Order, Line } from '../storage/Order';

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
    const orderSummaries: OrderSummary[] = orders.map((order) => {
      return {

      };
    });
    return new SuccessResponse('Successfully retrieved orders', orders);
  }

  mapOrderToOrderSummary(order: Order): OrderSummary {
    return {
      lines: order.line.map(this.mapLineToLineSummary),
    };
  }

  mapLineToLineSummary(line: Line): LineSummary {
    return {
      name: line.product.name,

      description: line.product.description;
      subtotal: line.quantity;
    };
  }
}
