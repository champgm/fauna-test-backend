import {
  enumerateError,
  getFullErrorStack,
  revealAllProperties,
} from '../../src/common/ObjectUtil';
import 'jest';

describe('ObjectUtil', () => {
  describe('enumerateError', () => {
    it('should enumerate the 5 fields', async () => {
      const error = new Error('error message');
      const enumeratedError = enumerateError(error);
      expect(Object.keys(enumeratedError)).toEqual([
        'constructor',
        '__defineGetter__',
        '__defineSetter__',
        'hasOwnProperty',
        '__lookupGetter__',
        '__lookupSetter__',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toString',
        'valueOf',
        'toLocaleString',
        'name',
        'message',
        'stack',
      ]);
    });
  });
  describe('getFullErrorStack', () => {
    it('should recursively parse stack', async () => {
      const error: any = new Error('error message');
      error.cause = () => {
        return 'MORE ERRORS';
      };
      const fullStack = getFullErrorStack(error);
      expect(fullStack).toContain('MORE ERRORS');
    });
    it('should not fail if error does not contain cause', async () => {
      const error: any = new Error('error message');
      error.cause = () => { };
      const fullStack = getFullErrorStack(error);
      expect(fullStack).toContain('error message');
      expect(fullStack).not.toContain('MORE ERRORS');
    });
    it('should return an empty string if toString returns [object Object]', async () => {
      const error: any = { an: 'error' };
      const fullStack = getFullErrorStack(error);
      expect(fullStack).toEqual('');
    });
  });
  describe('revealAllProperties', () => {
    it('should reveal all properties', async () => {
      const error = new Error('an error message');
      const clone = revealAllProperties(error);
      expect(Object.keys(clone)).toEqual([
        'constructor',
        '__defineGetter__',
        '__defineSetter__',
        'hasOwnProperty',
        '__lookupGetter__',
        '__lookupSetter__',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toString',
        'valueOf',
        'toLocaleString',
        'name',
        'message',
        'stack',
      ]);
    });
  });
});
