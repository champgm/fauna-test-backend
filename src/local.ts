import { createExpressApp } from './app/ExpressApp';

const expressApp = createExpressApp();
expressApp.listen(8080, () => {
  console.log('Listening on port 8080');
});
