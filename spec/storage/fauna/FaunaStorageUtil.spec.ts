import 'jest';
import bunyan from 'bunyan';
import path from 'path';
import faunadb, { query } from 'faunadb';

import { Configuration } from '../../../src/common/Configuration';
import { FaunaStorageUtil } from '../../../src/storage/fauna/FaunaStorageUtil';

// const query = {
//   Map: jest.fn(),
//   Paginate: jest.fn(),
//   Match: jest.fn(),
//   Index: jest.fn(),
//   Lambda: jest.fn(),
//   Get: jest.fn(),
//   Var: jest.fn(),
// };
jest.mock('faunadb', () => {
  return {
    query: {
      Map: jest.fn(() => 'MapResult'),
      Paginate: jest.fn(() => 'PaginateResult'),
      Match: jest.fn(() => 'MatchResult'),
      Index: jest.fn(() => 'IndexResult'),
      Lambda: jest.fn(() => 'LambdaResult'),
      Get: jest.fn(() => 'GetResult'),
      Var: jest.fn(() => 'VarResult'),
    },
  };
});

describe('FaunaStorageUtil', () => {
  const logger = bunyan.createLogger({ name: path.basename(__filename) });
  let faunaStorageUtil: FaunaStorageUtil;
  let configuration: Configuration;
  let faunaDbClient: faunadb.Client;
  let queryResults: any;
  beforeEach(() => {
    queryResults = 'queryResults';
    configuration = {} as any;
    faunaDbClient = {
      query: jest.fn(async () => queryResults),
    } as any;
    faunaStorageUtil = new FaunaStorageUtil(configuration, faunaDbClient, logger);
    jest.clearAllMocks();
  });
  describe('getOrders', () => {
    it('should correctly query for orders, then retrieve references', async () => {
      const orderReferences = 'orderReferences';
      faunaStorageUtil.getOrderReferences = jest.fn(() => orderReferences) as any;

      const result = await faunaStorageUtil.getOrders();
      expect(result).toEqual(orderReferences);
      expect(query.Map).toHaveBeenCalledWith('PaginateResult', 'LambdaResult');
      expect(query.Paginate).toHaveBeenCalledWith('MatchResult');
      expect(query.Match).toHaveBeenCalledWith('IndexResult');
      expect(query.Index).toHaveBeenCalledWith('all_orders');
      expect(query.Lambda).toHaveBeenCalledWith('X', 'GetResult');
      expect(query.Get).toHaveBeenCalledWith('VarResult');
      expect(query.Var).toHaveBeenCalledWith('X');

      expect(faunaStorageUtil.getOrderReferences).toHaveBeenCalledWith(queryResults);
    });
  });
  describe('getCustomers', () => {
    it('should correctly query for customers, then return that data', async () => {
      faunaDbClient.query = jest.fn(async () => ({ data: [{ data: 'data' }] })) as any;

      const result = await faunaStorageUtil.getCustomers();
      expect(result).toEqual(['data']);
      expect(query.Map).toHaveBeenCalledWith('PaginateResult', 'LambdaResult');
      expect(query.Paginate).toHaveBeenCalledWith('MatchResult');
      expect(query.Match).toHaveBeenCalledWith('IndexResult');
      expect(query.Index).toHaveBeenCalledWith('all_customers');
      expect(query.Lambda).toHaveBeenCalledWith('X', 'GetResult');
      expect(query.Get).toHaveBeenCalledWith('VarResult');
      expect(query.Var).toHaveBeenCalledWith('X');
    });
  });
  describe('getOrderReferences', () => {
    it('should make calls to the client for each reference which must be resolved', async () => {
      const orderQueryResult: any = {
        data: [{
          data: {
            creationDate: 'creationDate',
            customer: 'customer',
            line: [{ product: 'product' }],
          },
        }],
      };
      await faunaStorageUtil.getOrderReferences(orderQueryResult);
      expect(query.Get).toHaveBeenCalledWith('customer');
      expect(query.Get).toHaveBeenCalledWith('product');
    });
  });
});
