export class BaseResponse<T> {
  public code: number;
  public message: string;
  public payload?: T;

  public constructor(code: number, message: string, payload: T) {
    this.code = code;
    this.message = message;
    this.payload = payload;
  }
}
