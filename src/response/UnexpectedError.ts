import { BaseResponse } from './BaseResponse';

export class UnexpectedError<T> extends BaseResponse<T> {
  public constructor(message: string, payload?: T) {
    super(500, message, payload);
  }
}
