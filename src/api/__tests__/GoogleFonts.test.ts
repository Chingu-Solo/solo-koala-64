import { render } from '@testing-library/react';
import GoogleFontsAPI from '../GoogleFonts'

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/faebebin/i);
  expect(linkElement).toBeInTheDocument();
});


