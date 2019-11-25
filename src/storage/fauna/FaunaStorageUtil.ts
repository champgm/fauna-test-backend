import bunyan from 'bunyan';
import faunadb, { query } from 'faunadb';
import path from 'path';

import { StorageUtil } from '../StorageUtil';
import { Configuration } from '../../common/Configuration';
import { Customer } from '../Customer';
import { Order, Line } from '../Order';
import { CustomerQueryResult } from './CustomerQueryResult';
import { OrderQueryResult } from './OrderQueryResult';

export class FaunaStorageUtil extends StorageUtil {
  client: faunadb.Client;
  logger: bunyan;

  constructor(protected configuration: Configuration, incomingLogger: bunyan) {
    super(configuration, incomingLogger);
    this.logger = incomingLogger.child({ file: path.basename(__filename) });
    this.client = new faunadb.Client({ secret: configuration.faunaAccessKey });
  }

  public async getOrders(): Promise<any> {
    const orderQueryResult: OrderQueryResult = await this.client
      .query(
        query.Map(
          query.Paginate(query.Match(query.Index('all_orders'))),
          query.Lambda('X', query.Get(query.Var('X'))),
        ),
      ) as any;
    return this.getOrderReferences(orderQueryResult);
  }

  public async getCustomers(): Promise<Customer[]> {
    const results: CustomerQueryResult = this.client
      .query(
        query.Map(
          query.Paginate(query.Match(query.Index('all_customers'))),
          query.Lambda('X', query.Get(query.Var('X'))),
        ),
      ) as any;
    return results.data.map(customerDatum => customerDatum.data);
  }

  getOrderReferences(orderQueryResult: OrderQueryResult) {
    return Promise.all(orderQueryResult.data.map(async (orderData) => {
      const customerPromise = this.client.query(query.Get(orderData.data.customer));
      const linePromises = orderData.data.line.map(async (lineData) => {
        const productResult: any = await this.client.query(query.Get(lineData.product));
        console.log(`productResult${JSON.stringify(productResult, null, 2)}`);
        return {
          product: productResult.data,
          quantity: lineData.quantity,
          price: lineData.price,
        } as Line;
      });
      return {
        customer: await customerPromise,
        line: await Promise.all(linePromises),
        status: orderData.data.status,
        creationDate: orderData.data.creationDate['@ts'],
        shipAddress: orderData.data.shipAddress,
        creditCard: orderData.data.creditCard,
      } as Order;
    }));
  }
}
