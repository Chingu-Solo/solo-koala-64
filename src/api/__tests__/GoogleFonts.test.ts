import { render } from '@testing-library/react';
import GoogleFontsAPI, { 
  requestString, 
  styleSheetURL,
  googleFonts,
  GoogleFont,
  StyleSheetURL,
  Item
} from '../GoogleFonts';

import { fontsJSON } from '../../__fixtures__/fonts'


test('requestString returns expected string', () => {
  expect(requestString()).toMatch(
    /https:\/\/www.googleapis.com\/webfonts\/v1\/webfonts\?key=/
  );
  expect(requestString()).toMatch(
    /sort=popularity/
  );
});

test('basic properties of GooglFont Mock', () => {
  expect(fontsJSON.items.length).toBe(10);
});

test('styleSheetURL returns as expected string', () => {
  const fontItemMock: Item = fontsJSON.items[1];
  const url: StyleSheetURL = styleSheetURL(fontItemMock);
  expect(fontItemMock.family).toMatch(/Open Sans/);
  expect(url).toMatch(
    /https:\/\/fonts.googleapis.com\/css\?family=Open\+Sans/
  );
});


test('googleFonts returns as expected', () => {
  const fontItemsMock: Item[] = fontsJSON.items.slice(0,2);
  const gFonts: GoogleFont[] = googleFonts(fontItemsMock);
  expect(gFonts[0].family).toMatch(/Roboto/);
  expect(gFonts[0].styleSheetURL).toMatch(
    /https:\/\/fonts.googleapis.com\/css\?family/
  );
  expect(gFonts[1].family).toMatch(/Open Sans/);
});

describe('check api with fixture mock', () => {
  beforeEach(() => {
    fetch.resetMocks()
  });
 
  it('calls get with a Google Fonts fixture', async () => {
    fetch.mockResponseOnce(JSON.stringify(fontsJSON));
     
    const fonts: GoogleFont[] = await GoogleFontsAPI();
    expect(fonts.length).toBe(10)
 
    //assert on the times called and arguments given to fetch
    expect(fonts[0].family).toBe('Roboto');
  });

});
