
// import awsSdk from 'aws-sdk';
import middleware from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import express from 'express';
import * as core from 'express-serve-static-core';
import path from 'path';
import bunyan from 'bunyan';

import { BaseResponse } from '../response/BaseResponse';
import { Configuration } from '../common/Configuration';
import { enumerateError } from '../common/ObjectUtil';
import { getConfiguration } from '../common';
import { OrderHandler } from '../handler/OrderHandler';

const BASE_PATH = '/fauna-test-backend';

// Retrieve configuration and create handlers once per lambda startup (vs once per execution)
// if using parameter store or other outside services, this can be costly
let configuration: Configuration;
let orderHandler: OrderHandler;

// This is a wrapper for all route handlers
// We need to take special care to handle asynchronous errors. Lambda has a tendency to eat them
export function asyncHandler(
  handler: (request: express.Request, response: express.Response) => Promise<BaseResponse<any>>,
) {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logger = bunyan.createLogger({
      name: 'fauna-test-backend',
      file: path.basename(__filename),
    });
    logger.info('Express handler was invoked');
    try {
      // Configure/instantiate dependencies
      if (!configuration) {
        configuration = await getConfiguration();
      }
      if (!orderHandler) {
        orderHandler = new OrderHandler(configuration, logger);
      }

      // Execute given handler
      const responseObject = await handler(request, response);
      logger.info('Handler processing success');
      response.status(responseObject.code).json(responseObject);
    } catch (error) {
      logger.error(
        { requestError: enumerateError(error) },
        'An error ocurred while handling a request');
      next(error);
    } finally {
      logger.info('Handler processing complete');
    }
  };
}

export function createExpressApp(): core.Express {
  const expressApp = express();
  // expressApp.use(cors);

  // Parse JSON
  const router = express.Router();
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  router.use(middleware.eventContext());

  // This is for testing, canary deployments, heartbeat stuff, etc
  router.get('/status', (request, response) => {
    const ok = { status: 'ok' };
    response.status(200).json(ok);
  });

  // It might be a little confusing, but this creates a function which is passed into the handler above
  // The handler above will instantiate the handler class before calling this method. 
  router.post('/orders', asyncHandler(async (request) => {
    return orderHandler.handle(request);
  }));

  expressApp.use(BASE_PATH, router);
  return expressApp;
}
