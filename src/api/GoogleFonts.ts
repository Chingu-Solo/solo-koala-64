import { Get } from '../common/utils/ApiUtils';

const API_KEY = process.env.REACT_APP_GOOGLE_FONTS_API_KEY;

type Kind = string; //'webfonts#webfont'
type Family = string;

type Item = {
  kind: Kind,
  family: Family,
  category: string,
  variants: string[],
  subsets: string[],
  version: string,
  lastModified: string,
}

type FontsDeveloperAPI = {
  kind: Kind,
  items: Item[],
}

type StyleSheetURL = string;

export type GoogleFont = {
  family: Family,
  styleSheetURL: StyleSheetURL,
}

export default class GoogleFontsAPI {
  request: string = (
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`
  );

  async _getGoogleFonts(): GoogleFont[] {
    const { kind, items } = await Get<FontsDeveloperAPI>(this.request);
    return Promise 
  }

  styleSheetURL(item: Item): StyleSheetURL {
    const url = ['https://fonts.googleapis.com/css?family='];
    url.push(item.family.replace(/ /g, '+'));
    //** if more specific needed
    //href="https://fonts.googleapis.com/css?family={family}"
    return url.join('');
  }
}

//**
 //if (item.variants.includes('italic')) {
  //  url.push(':');
  //  url.push('italic');
  //}
  //if (item.subsets.includes('greek')) {
  //  url.push('&subset=');
  //  url.push('greek');
  //} 
