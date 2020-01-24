import React from 'react';

import classNames from 'classnames';
import { FiGrid } from 'react-icons/fi';
import { TiArrowUp, TiArrowShuffle } from 'react-icons/ti';
import { AiOutlineReload, AiOutlineSelect } from 'react-icons/ai';
import { FaRegWindowClose, FaList } from 'react-icons/fa';

import './ToolBar.css';
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
  gridDisplay: boolean,
}

interface MainToolBarProps extends MainToolBarBase {
  changeSearchHandler: EventHandler<InputEvent>,
  changeTextHandler: EventHandler<InputEvent>,
  changeSelectFontSizeHandler: EventHandler<SelectEvent>,
  changeSelectColorHandler: EventHandler<SelectEvent>,
  switchListGrid: EventHandler,
  shuffleFonts: EventHandler,
  resetState: EventHandler,
}

export function MainToolBar({
  inputText,
  searchText,
  fontSize,
  colorScheme,
  columnCount,
  gridDisplay,
  changeSearchHandler,
  changeTextHandler,
  changeSelectFontSizeHandler,
  changeSelectColorHandler,
  switchListGrid,
  shuffleFonts,
  resetState
}: MainToolBarProps) {
  return (
    <div className={classNames("Tools", "MainToolBar")}>
      <TextInput
        value={searchText}
        placeHolder="&#128269; search fonts" 
        changeHandler={changeSearchHandler}
        className={colorScheme}
      />
      <TextInput 
        value={inputText}
        placeHolder="&#x270e; type-something" 
        changeHandler={changeTextHandler}
        className={colorScheme}
      />
      <select 
        className={colorScheme}
        title="chose font size"
        onChange={changeSelectFontSizeHandler}
      >
        {fontSizeOptions.map((fontSize: FontSize, i) => (
          <option value={fontSize} key={i}>{fontSize}</option>
        ))}
      </select>
      <select 
        className={classNames(colorScheme, "buttonIcon")}
        title="chose Color"
        onChange={changeSelectColorHandler}
      >
        {colorSchemeOptions.map((color: ColorScheme, i) => (
          <option 
            key={i}
            value={color} 
            className={classNames(color, "NoSelectMarker", "buttonIcon")}
          >
            &#9673;
          </option>
        ))}
      </select>
      {columnCount > 1 &&
        <button 
          className={classNames(colorScheme, "buttonIcon")}
          onClick={switchListGrid}
          title={`View as ${gridDisplay ? 'List'  : 'Grid'}`}
        >
          {gridDisplay 
            ? <FaList className="buttonIcon"/>
            : <FiGrid className="buttonIcon"/> 
          }
        </button>
      }
      <button 
        className={colorScheme}
        onClick={shuffleFonts}
        title="shuffle font cards"
      >
        <TiArrowShuffle className="buttonIcon"/>
      </button>
      <button 
        className={colorScheme}
        onClick={resetState}
        title="Reset"
      >
        <AiOutlineReload className="buttonIcon"/>
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
    <div className="InfoBar">
      Viewing {fonts.length} out of {bakFonts.length} fonts.
    </div>
  </div>
);
