import React from 'react';

import { GoogleFont } from '../api/GoogleFonts';

export type InputEvent = React.ChangeEvent<HTMLInputElement>;
export type SelectEvent = React.ChangeEvent<HTMLSelectElement>;

export type EventHandler<T = {}> = (arg1: T) => void;

//export type KeyValue<T, U> = {
//  key: T,
//  value: U,
//};

export type AppFont = GoogleFont & { 
  selected: boolean 
  ranking: number
};
export type Fonts = AppFont[] | [];
