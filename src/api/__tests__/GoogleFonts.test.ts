import { render } from '@testing-library/react';
import GoogleFontsAPI from '../GoogleFonts'

import { fontsJSON } from '../../__fixtures__/fonts'

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/faebebin/i);
  expect(linkElement).toBeInTheDocument();
});

    const request: string = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`
    const mockSuccessResponse = {} //new Response();
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });

