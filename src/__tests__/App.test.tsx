import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';

import App from '../App';

describe('App', () => {

  it('renders footer text', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/faebebin/i);
    expect(linkElement).toBeInTheDocument();
  });

  it(`renders the loading screen`, () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('fetches data from server when server returns a successful response', done => { // 1
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); // 4
    
    const wrapper = shallow(<ExampleComponent />); // 5
                            
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://url-of-your-server.com/example/json');

    process.nextTick(() => { // 6
      expect(wrapper.state()).toEqual({
        // ... assert the set state
      });

      global.fetch.mockClear(); // 7
      done(); // 8
    });
  });
});

