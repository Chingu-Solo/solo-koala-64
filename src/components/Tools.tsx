import React from 'react';
import { EventValueHandler } from '../common/types';

interface TextInputProps {
  value: string,
  placeHolder: string,
  changeHandler: EventValueHandler,
}

//name="sommeName" needed?
export function TextInput({
  value,
  placeHolder,
  changeHandler,
}: TextInputProps) {
  return (
    <input
      value={value}
      type="text" 
      placeholder={placeHolder} 
      onChange={changeHandler}
    />
  );
}
