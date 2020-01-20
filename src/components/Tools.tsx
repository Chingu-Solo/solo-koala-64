import React from 'react';
import { EventValueHandler } from '../common/types';
import { ColorScheme } from '../constants/ColorSchemes';

interface TextInputProps {
  value: string,
  placeHolder: string,
  changeHandler: EventValueHandler,
  className: ColorScheme,
}

//name="sommeName" needed?
export function TextInput({
  value,
  placeHolder,
  changeHandler,
  className,
}: TextInputProps) {
  return (
    <input
      value={value}
      type="text" 
      placeholder={placeHolder} 
      onChange={changeHandler}
      className={className}
    />
  );
}
