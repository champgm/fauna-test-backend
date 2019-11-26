import 'jest';

import awsServerlessExpress from 'aws-serverless-express';

import { handler } from '../src/Handler';

jest.mock('aws-serverless-express');

describe('index', () => {
  let callback = jest.fn();
  let event;
  beforeEach(() => {
    event = {
      Records: [{ EventSource: 'aws:sns' }],
    };
    callback = jest.fn();
  });
  describe('handler', () => {
    it('should proxy to awsServerlessExpress', async () => {
      event.Records[0].EventSource = 'not sns';
      handler(event, {}, callback);
      expect(awsServerlessExpress.proxy).toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
