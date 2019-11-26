import path from 'path';
import bunyan from 'bunyan';
import 'jest';
import { CustomerHandler } from '../../src/handler/CustomerHandler';
import { Configuration } from '../../src/common/Configuration';
import { StorageUtil } from '../../src/storage/StorageUtil';

describe('CustomerHandler', () => {
  const logger = bunyan.createLogger({ name: path.basename(__filename) });
  let configuration: Configuration;
  let storageUtil: StorageUtil;
  let handler: CustomerHandler;
  const expectedResult = 'expectedResult';
  beforeEach(() => {
    configuration = {} as any;
    storageUtil = {
      getOrders: jest.fn(),
      getCustomers: jest.fn(() => expectedResult),
    } as any;
    handler = new CustomerHandler(configuration, storageUtil, logger);
  });
  describe('handle', () => {
    it('should return customers wrapped in a success response', async () => {
      const response = await handler.handle({});
      expect(storageUtil.getCustomers).toHaveBeenCalled();
      expect(response.code).toEqual(200);
      expect(response.payload).toEqual(expectedResult);
    });
  });
});
