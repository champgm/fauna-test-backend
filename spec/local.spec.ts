import 'jest';

const listen = jest.fn((port, callback) => {
  callback();
});
const createExpressApp = jest.fn(() => {
  return { listen };
});

jest.mock('../src/app/ExpressApp', () => {
  return { createExpressApp };
});

import '../src/local';

describe('local runner', () => {
  it('should call \'listen\' on expressApp', async () => {
    expect(createExpressApp).toHaveBeenCalled();
    expect(listen).toHaveBeenCalledWith(8080, expect.any(Function));
  });
});
