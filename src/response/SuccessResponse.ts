import { BaseResponse } from './BaseResponse';

export class SuccessResponse<T> extends BaseResponse<T> {
  public constructor(message: string, payload: T) {
    super(200, message, payload);
  }
}
