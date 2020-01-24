import { get } from '../ApiUtils'

//https://www.google.com/amp/s/www.sisense.com/blog/rest-api-testing-strategy-what-exactly-should-you-test/%3famp

//1. Verify correct HTTP status code
//2. Verify response payload. - compare to fixtures TODO
//3. Verify response headers. TODO
//4. Verify correct application state. (App.test.tsx))
//(5. Verify basic performance sanity) TODO
//
//Basic positive tests (happy paths)
//Extended positive testing with optional parameters TODO
//Negative testing with valid input TODO (throwing error testing not working)
//Negative testing with invalid input TODO
//Destructive testing? TODO
//Security, authorization, and permission tests TODO

describe('check api response', () => {
  beforeEach(() => {
    fetch.resetMocks()
  });
 
  it('calls requested api and returns data to me', async () => {
    type R = { data: string }
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));
     
    //assert on the response
    const res = await get<R>('https://google.com');
    expect(res.data).toEqual('12345')
 
    //assert on the times called and arguments given to fetch
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('https://google.com');
  });

  //it('throws Error with invalid response object', async () => {
  //  //fetch.mockReject(new Error('foo'));
  //  fetch.mockResponseOnce(Promise.reject(new Error('bad url')));
  //  expect(async () => {await get('this url is invalid')}).toThrow();
  //});
 
});
