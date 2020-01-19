import { get } from '../common/utils/ApiUtils';

const API_KEY = process.env.REACT_APP_GOOGLE_FONTS_API_KEY;

type Kind = string; //'webfonts#webfont'
type Family = string;
type Sort = 'alpha'|'date'|'popularity'|'style'|'trending';

export type Item = {
  kind: Kind,
  family: Family,
  category: string,
  variants: string[],
  subsets: string[],
  version: string,
  lastModified: string,
  files: any 
}

export type FontsDeveloperAPI = {
  kind: Kind,
  items: Item[],
}

export type StyleSheetURL = string;

export type GoogleFont = {
  family: Family,
  styleSheetURL: StyleSheetURL,
}

export function requestString(): string {
  const sort: Sort  = 'popularity';
  return  `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=${sort}`
}

export function styleSheetURL(item: Item): StyleSheetURL {
  const url = ['https://fonts.googleapis.com/css?family='];
 //if (item.variants.includes('italic')) {
  //  url.push(':');
  //  url.push('italic');
  //}
  //if (item.subsets.includes('greek')) {
  //  url.push('&subset=');
  //  url.push('greek');
  //} 
  url.push(item.family.replace(/ /g, '+'));
  return url.join('');
}

export function googleFonts(items: Item[]): GoogleFont[] {
  return (
    items.map( (item: Item): GoogleFont  => ({
      'family': item.family,
      'styleSheetURL': styleSheetURL(item)
    }))
  );
}

export default async function getGoogleFonts(): Promise<GoogleFont[] | never> {
  const { items } = await get<FontsDeveloperAPI>(requestString());
  return items && googleFonts(items);
}
