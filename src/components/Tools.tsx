import React from 'react';
import { EventValueHandler } from '../common/types';

interface TextInputProps {
  placeHolder: string,
  changeHandler: EventValueHandler,
}

//name="sommeName" needed?
export function TextInput({
  placeHolder,
  changeHandler,
}: TextInputProps) {
  return (
    <input
      type="text" 
      placeholder={placeHolder} 
      onChange={changeHandler}
    />
  );
}
