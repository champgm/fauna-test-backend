import 'jest';
import supertestAsPromised from 'supertest-as-promised';

import { asyncHandler, createExpressApp } from '../../src/app/ExpressApp';

const orderResponse = { code: 200, message: 'joined room' };
const orders = jest.fn(() => orderResponse);
const customerResponse = { code: 200, message: 'joined room' };
const customers = jest.fn(() => customerResponse);
const orderSummaryResponse = { code: 200, message: 'joined room' };
const orderSummary = jest.fn(() => orderSummaryResponse);

jest.mock('../../src/handler/CustomerHandler', () => {
  return {
    CustomerHandler: jest.fn(() => {
      return {
        handle: customers,
      };
    }),
  };
});
jest.mock('../../src/handler/OrderHandler', () => {
  return {
    OrderHandler: jest.fn(() => {
      return {
        handle: orders,
      };
    }),
  };
});
jest.mock('../../src/handler/OrderSummaryHandler', () => {
  return {
    OrderSummaryHandler: jest.fn(() => {
      return {
        handle: orderSummary,
      };
    }),
  };
});

describe('express_app', () => {
  beforeAll(() => {
  });
  let expectedResult: string;
  let fakeHandler: any;
  let handlerFunction: any;
  let request: any;
  let response: any;
  let next: any;
  let actualResult: string;
  let testApp: supertestAsPromised.SuperTest<supertestAsPromised.Test>;
  beforeEach(() => {
    expectedResult = 'This is the result';
    fakeHandler = async () => {
      actualResult = expectedResult;
      return {
        status: () => {
          json: jest.fn();
        },
      };
    };
    handlerFunction = asyncHandler(fakeHandler);
    request = { get: jest.fn() };
    response = {};
    next = jest.fn();
    testApp = supertestAsPromised(createExpressApp());
  });

  describe('asyncHandler', () => {
    it('passes errors to the next function', async () => {
      const errorString = 'This is an error';
      const fakeHandler: any = async () => {
        throw errorString;
      };
      const handlerFunction = asyncHandler(fakeHandler);
      const request: any = { post: jest.fn() };
      const response: any = {};
      const next = jest.fn();

      await expect(handlerFunction(request, response, next)).resolves.toBeUndefined();
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toEqual(errorString);
    });

    it('executes the handler function', async () => {
      await expect(handlerFunction(request, response, next)).resolves.toBeUndefined();
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('router', () => {
    it('properly routes GET /orders requests', async () => {
      const response = await testApp
        .get('/fauna-test-backend/orders')
        .set('x-apigateway-event', '{}')
        .set('x-apigateway-context', '{}')
        .toPromise();
      expect(response.status).toEqual(200);
      expect(response.text).toEqual(JSON.stringify(orderResponse));
      expect(orders).toHaveBeenCalled();
    });
    it('properly routes GET /customers requests', async () => {
      const response = await testApp
        .get('/fauna-test-backend/customers')
        .set('x-apigateway-event', '{}')
        .set('x-apigateway-context', '{}')
        .toPromise();
      expect(response.status).toEqual(200);
      expect(response.text).toEqual(JSON.stringify(customerResponse));
      expect(customers).toHaveBeenCalled();
    });
    it('properly routes GET /orderSummary requests', async () => {
      const response = await testApp
        .get('/fauna-test-backend/order-summary')
        .set('x-apigateway-event', '{}')
        .set('x-apigateway-context', '{}')
        .toPromise();
      expect(response.status).toEqual(200);
      expect(response.text).toEqual(JSON.stringify(orderSummaryResponse));
      expect(orderSummary).toHaveBeenCalled();
    });
    it('properly routes GET /status requests', async () => {
      const response = await testApp
        .get('/fauna-test-backend/status')
        .set('x-apigateway-event', '{}')
        .set('x-apigateway-context', '{}')
        .toPromise();
      expect(response.status).toEqual(200);
      expect(response.text).toEqual('{"status":"ok"}');
    });
  });
});
