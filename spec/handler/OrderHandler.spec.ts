import path from 'path';
import bunyan from 'bunyan';
import 'jest';
import { OrderHandler } from '../../src/handler/OrderHandler';
import { Configuration } from '../../src/common/Configuration';
import { StorageUtil } from '../../src/storage/StorageUtil';

describe('OrderHandler', () => {
  const logger = bunyan.createLogger({ name: path.basename(__filename) });
  let configuration: Configuration;
  let storageUtil: StorageUtil;
  let handler: OrderHandler;
  const expectedResult = 'expectedResult';
  beforeEach(() => {
    configuration = {} as any;
    storageUtil = {
      getOrders: jest.fn(() => expectedResult),
      getCustomers: jest.fn(),
    } as any;
    handler = new OrderHandler(configuration, storageUtil, logger);
  });
  describe('handle', () => {
    it('should return orders wrapped in a success response', async () => {
      const response = await handler.handle({});
      expect(storageUtil.getOrders).toHaveBeenCalled();
      expect(response.code).toEqual(200);
      expect(response.payload).toEqual(expectedResult);
    });
  });
});
