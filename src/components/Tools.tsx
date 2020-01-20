import React, { Fragment } from 'react';
import classNames from 'classnames';

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
    <Fragment>
      <input
        value={value}
        type="text" 
        placeholder={placeHolder} 
        onChange={changeHandler}
        className={classNames("TextInput", className)}
      />
      <div className="vl"></div>
    </Fragment>
  );
}
