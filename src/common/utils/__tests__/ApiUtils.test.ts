import { get } from '../ApiUtils'

//TODO
//https://www.google.com/amp/s/www.sisense.com/blog/rest-api-testing-strategy-what-exactly-should-you-test/%3famp

//
//1. Verify correct HTTP status code
//2. Verify response payload. - compare to fixtures 
//3. Verify response headers. HTTP server headers have implications on both security and performance.
//4. Verify correct application state. 
//(5. Verify basic performance sanity)
//
//Basic positive tests (happy paths)
//Extended positive testing with optional parameters
//Negative testing with valid input
//Negative testing with invalid input
//Destructive testing
//Security, authorization, and permission tests (which are out of the scope of this post)


test('get() with invalid request string', () => {
  const invalidRequest: string = 'this-request-is-invalid';
  expect(() => {get(invalidRequest)}).toThrow(Error);
});

