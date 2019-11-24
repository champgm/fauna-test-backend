import awsServerlessExpress from 'aws-serverless-express';

import { createExpressApp } from './app/ExpressApp';

const server = awsServerlessExpress.createServer(createExpressApp());
export function handler(event, context, callback) {
  console.log('Index handler was invoked.');
  awsServerlessExpress.proxy(server, event, context);
}
