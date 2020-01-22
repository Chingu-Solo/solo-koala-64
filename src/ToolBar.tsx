import React from 'react';

import classNames from 'classnames';
import { FaList } from 'react-icons/fa';
import { FiGrid } from 'react-icons/fi';
import { TiArrowUp } from 'react-icons/ti';
import { AiOutlineReload, AiOutlineSelect } from 'react-icons/ai';
import { FaRegWindowClose } from 'react-icons/fa';

import fontSizeOptions, { FontSize } from './constants/FontSizes';
import colorSchemeOptions, { ColorScheme } from './constants/ColorSchemes';
import { TextInput } from './components/Tools';
import { 
  EventHandler, 
  InputEvent, 
  SelectEvent,
  Fonts,
} from './common/types';

export type Input = string;

export interface MainToolBarBase {
  inputText: Input,
  searchText: string,
  fontSize: FontSize,
  colorScheme: ColorScheme,
  columnCount: number,
}

interface MainToolBarProps extends MainToolBarBase {
  changeSearchHandler: EventHandler<InputEvent>,
  changeTextHandler: EventHandler<InputEvent>,
  changeSelectFontSizeHandler: EventHandler<SelectEvent>,
  changeSelectColorHandler: EventHandler<SelectEvent>,
  switchListGrid: EventHandler,
  resetState: EventHandler,
}

export function MainToolBar({
  inputText,
  searchText,
  fontSize,
  colorScheme,
  columnCount,
  changeSearchHandler,
  changeTextHandler,
  changeSelectFontSizeHandler,
  changeSelectColorHandler,
  switchListGrid,
  resetState
}: MainToolBarProps) {
  return (
    <div className={classNames("Tools", "MainToolBar")}>
      <TextInput
        value={searchText}
        placeHolder="search fonts" 
        changeHandler={changeSearchHandler}
        className={colorScheme}
      />
      <TextInput 
        value={inputText}
        placeHolder="type-something" 
        changeHandler={changeTextHandler}
        className={colorScheme}
      />
      <select 
        className={colorScheme}
        title="chose font size"
        onChange={changeSelectFontSizeHandler}
      >
        {fontSizeOptions.map((fontSize: FontSize) => (
          <option value={fontSize}>{fontSize}</option>
        ))}
      </select>
      <select 
        className={colorScheme}
        title="chose Color"
        onChange={changeSelectColorHandler}
      >
        {colorSchemeOptions.map((color: ColorScheme) => (
          <option 
            value={color} 
            className={classNames(color, "NoSelectMarker")}
          >
            &#9673;
          </option>
        ))}
      </select>
      <button 
        className={colorScheme}
        onClick={switchListGrid}
        title={`View as ${columnCount === 1
          ? 'Grid'
          : 'List'
        }`}
      >
        {columnCount === 1 
          ? <FiGrid />
          : <FaList />
        }
      </button>
      <button 
        className={colorScheme}
        onClick={resetState}
        title="Reset"
      >
        <AiOutlineReload />
      </button>
    </div>
  )
}

export interface CardToolsBase {
  colorScheme: ColorScheme,
  clickRemoveHandler: EventHandler<number>,
  clickToTopHandler: EventHandler<number>,
  clickSelectHandler: EventHandler<number>,
}

export interface CardToolBarProps extends CardToolsBase {
  listId: number
}

export const CardToolBar = ({
  colorScheme,
  listId,
  clickRemoveHandler, 
  clickToTopHandler, 
  clickSelectHandler,
}: CardToolBarProps) => (
  <div className="Tools">
    <button 
      className={colorScheme}
      onClick={() => clickSelectHandler(listId)}
      title="Select font"
    >
      <AiOutlineSelect className="buttonIcon"/> 
    </button>
    {listId > 0 &&
      <button 
        className={colorScheme}
        onClick={() => clickToTopHandler(listId)}
        title="Move font to top"
      >
        <TiArrowUp className="buttonIcon"/> 
      </button>
    }
    <button 
      className={colorScheme}
      onClick={() => clickRemoveHandler(listId)}
      title="Remove font"
    >
      <FaRegWindowClose className="buttonIcon"/> 
    </button>
  </div>
);



export interface InfoBarProps {
  fonts: Fonts,
  bakFonts: Fonts,
}

export const InfoBar = ({ fonts, bakFonts }: InfoBarProps) => (
  <div>
    {fonts && bakFonts &&
      <div className="InfoBar">
        Viewing {fonts.length} out of {bakFonts.length} fonts.
      </div>
    }
  </div>
);
