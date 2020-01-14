import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/faebebin/i);
  expect(linkElement).toBeInTheDocument();
});


//import renderer from 'react-test-renderer';
//
//TODO install / config properly
//
//describe('App', () => {
//  it(`renders the loading screen`, () => {
//    const tree = renderer.create(<App />).toJSON();
//    expect(tree).toMatchSnapshot();
//  });
//});
