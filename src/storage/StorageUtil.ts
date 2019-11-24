import bunyan from 'bunyan';

import { Configuration } from '../common/Configuration';
import { Customer } from './Customer';
import { Order } from './Order';

export abstract class StorageUtil {
  constructor(protected configuration: Configuration, incomingLogger: bunyan) { }
  public abstract getOrders(): Promise<Order[]>;
  public abstract getCustomers(): Promise<Customer[]>;
}
