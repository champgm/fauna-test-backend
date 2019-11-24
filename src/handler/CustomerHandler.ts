import path from 'path';
import express from 'express';
import bunyan from 'bunyan';

import { Configuration } from '../common/Configuration';
import { RequestHandler } from './RequestHandler';
import { BaseResponse } from '../response/BaseResponse';
import { StorageUtil } from '../storage/StorageUtil';
import { SuccessResponse } from '../response/SuccessResponse';

export class CustomerHandler extends RequestHandler {
  logger: bunyan;

  constructor(
    protected configuration: Configuration,
    protected storageHandler: StorageUtil,
    incomingLogger: bunyan,
  ) {
    super(configuration);
    this.logger = incomingLogger.child({ file: path.basename(__filename) });
  }

  public async handle(request: express.Request): Promise<BaseResponse<any>> {
    const orders = await this.storageHandler.getCustomers();
    return new SuccessResponse('Successfully retrieved orders', orders);
  }
}
