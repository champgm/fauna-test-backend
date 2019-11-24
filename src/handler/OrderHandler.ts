import path from 'path';
import express from 'express';
import bunyan from 'bunyan';

import { Configuration } from '../common/Configuration';
import { RequestHandler } from './RequestHandler';
import { BaseResponse } from '../response/BaseResponse';

export class OrderHandler extends RequestHandler {
  logger: bunyan;

  constructor(
    protected configuration: Configuration,
    incomingLogger: bunyan,
  ) {
    super(configuration);
    this.logger = incomingLogger.child({ file: path.basename(__filename) });
  }

  public async handle(request: express.Request): Promise<BaseResponse<any>> {

// Do database stuff here

    return undefined;
  }
}
