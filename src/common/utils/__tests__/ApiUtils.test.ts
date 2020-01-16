import { get } from '../ApiUtils'

test('get() with invalid request string', () => {
  const invalidRequest: string = 'this-request-is-invalid';
  expect(get(invalidRequest)).toThrow(Error);
});

