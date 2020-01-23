import React from 'react';
import classNames from 'classnames';

import './Tools.css';
import { EventHandler, InputEvent } from '../common/types';
import { ColorScheme } from '../constants/ColorSchemes';

interface TextInputProps {
  value: string,
  placeHolder: string,
  changeHandler: EventHandler<InputEvent>,
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
      className={classNames("TextInput", className)}
    />
  );
}
