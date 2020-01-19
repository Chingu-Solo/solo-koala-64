import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import App from '../App';

describe('App', () => {

  it('renders footer text', () => {
    // maybe add some more ;) ...
    const { getByText } = render(<App />);
    const linkElement = getByText(/faebebin/i);
    expect(linkElement).toBeInTheDocument();
  });

  it(`renders screen as expected`, () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('fetches data from server when server returns a successful response', done => {
    const API_KEY = process.env.REACT_APP_GOOGLE_FONTS_API_KEY;
    const request: string = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`
    const mockSuccessResponse = {} //new Response();
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockSuccessResponse);
    
    const wrapper: any = render(<App />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(request);

      done();
      //    process.nextTick(() => {
      //      expect(wrapper.sta).toEqual({
      //        // ... assert the set state
      //      });
      //
      //      global.fetch.mockClear();
      //    });
  });
});

