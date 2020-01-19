import { get, checkResponse } from '../ApiUtils'

//https://www.google.com/amp/s/www.sisense.com/blog/rest-api-testing-strategy-what-exactly-should-you-test/%3famp

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

describe('checkResponse', () => {

  beforeEach(() => {
    fetch.resetMocks()
    fetch.mockResponseOnce('', { status: 200 });
  });

  it('throws Error with invalid response object',done  => {
    //const mockInvalidResponse = { 
    //  'ok': false, 
    //  statusText: 'Response NOT OK' 
    //}
    fetch.mockResponseOnce('',Promise.reject(new Error('bad url')));
    expect(() => {get('hmmm')}).toThrow();
    done()
  });

  it('returns a the Response object if valid',() => {
    expect(checkResponse(new Response()).ok).toBe(true);
  });

it('succeeds', done => {

        expect(true).toBe(true);
        done();
    });
});




//TODO would like to test for throw behaviour upon invalid fetch('invalid request')
//describe('get', () => {
//  it('get throws Error with invalid request string', done => {
//    const mockSuccessResponse = {} //new Response();
//    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
//
//    const invalidRequest: string = 'this-request-is-invalid';
//
//  expect(() => {get(invalidRequest)}).toThrow();
//  done();
//});
//  });

