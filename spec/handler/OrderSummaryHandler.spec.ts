import path from 'path';
import bunyan from 'bunyan';
import 'jest';
import { OrderSummaryHandler } from '../../src/handler/OrderSummaryHandler';
import { Configuration } from '../../src/common/Configuration';
import { StorageUtil } from '../../src/storage/StorageUtil';
import { OrderSummary } from '../../src/response/OrderResponse';
import { Order } from '../../src/storage/Order';

describe('OrderSummaryHandler', () => {
  const logger = bunyan.createLogger({ name: path.basename(__filename) });
  let configuration: Configuration;
  let storageUtil: StorageUtil;
  let handler: OrderSummaryHandler;
  let order: Order;
  beforeEach(() => {
    order = {
      shipAddress: {
        street: 'street',
        city: 'city',
        state: 'state',
        zipCode: 'zipCode',
      },
      creditCard: {
        network: 'network',
        number: 'number',
      },
      customer: {
        firstName: 'firstName',
        lastName: 'lastName',
        address: {
          street: 'street',
          city: 'city',
          state: 'state',
          zipCode: 'zipCode',
        },
        telephone: 'telephone',
        creditCard: {
          network: 'network',
          number: 'number',
        },

      },
      line: [{
        product: {
          warehouse: [{
            name: 'name',
            address: {
              street: 'street',
              city: 'city',
              state: 'state',
              zipCode: 'zipCode',
            },
          }],
          backorderLimit: 10,
          backordered: true,
          name: 'name',
          description: 'description',
          price: 10,
          quantity: 10,
        },
        quantity: 10,
        price: 10,
      }],
      status: 'status',
      creationDate: 'creationDate',
    };
    configuration = {} as any;
    storageUtil = {
      getOrders: jest.fn(async () => [order]),
      getCustomers: jest.fn(),
    } as any;
    handler = new OrderSummaryHandler(configuration, storageUtil, logger);
  });
  describe('handle', () => {
    it('should use mapOrderToOrderSummary to map order summaries', async () => {
      handler = new OrderSummaryHandler(configuration, storageUtil, logger);
      handler.mapOrderToOrderSummary = jest.fn();
      await handler.handle({});
      expect(handler.mapOrderToOrderSummary).toHaveBeenCalledWith(order, 0, [order]);
    });
  });
  describe('mapOrderToOrderSummary', () => {
    it('should map orders to orderSummaries', async () => {
      const orderSummary: OrderSummary = handler.mapOrderToOrderSummary(order);
      expect(orderSummary).toEqual({
        customerName: 'firstName lastName',
        status: 'status',
        totalPrice: 10,
        address: {
          city: 'city',
          state: 'state',
          street: 'street',
          zipCode: 'zipCode',
        },
        lines: [{
          description: 'description',
          name: 'name',
          subtotal: 10,
        }],
      },
      );
    });
  });
});
