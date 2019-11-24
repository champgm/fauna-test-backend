import bunyan from 'bunyan';
import faunadb, { query } from 'faunadb';
import path from 'path';

import { StorageUtil } from '../StorageUtil';
import { Configuration } from '../../common/Configuration';
import { Customer } from '../Customer';
import { Order } from '../Order';
import { CustomerQueryResult } from './CustomerQueryResult';

export class FaunaStorageUtil extends StorageUtil {
  client: faunadb.Client;
  logger: bunyan;

  constructor(protected configuration: Configuration, incomingLogger: bunyan) {
    super(configuration, incomingLogger);
    this.logger = incomingLogger.child({ file: path.basename(__filename) });
    this.client = new faunadb.Client({ secret: configuration.faunaAccessKey });
  }

  public getOrders(): Promise<Order[]> {
    return this.client
      .query(
        query.Map(
          query.Paginate(query.Match(query.Index('all_orders'))),
          query.Lambda('X', query.Get(query.Var('X'))),
        ),
      );
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
}
