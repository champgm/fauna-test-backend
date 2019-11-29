import awsServerlessExpress from 'aws-serverless-express';

import { createExpressApp } from './app/ExpressApp';

const expressApp = createExpressApp();
console.log(`expressApp._router.stack${JSON.stringify(expressApp._router.stack, null, 2)}`);
const server = awsServerlessExpress.createServer(createExpressApp());
export function handler(event, context, callback) {
  console.log('Index handler was invoked.');
  awsServerlessExpress.proxy(server, event, context);
}
