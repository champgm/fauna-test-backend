import express from 'express';

import { Configuration } from '../common/Configuration';
import { BaseResponse } from '../response/BaseResponse';

export abstract class RequestHandler {
  constructor(protected configuration: Configuration) { }
  public abstract handle(request: express.Request): Promise<BaseResponse<any>>;
}
