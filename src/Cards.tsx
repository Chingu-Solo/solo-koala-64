import React, { forwardRef } from 'react';
import CSS from 'csstype';

import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { TiArrowUp } from 'react-icons/ti';
import classNames from 'classnames';

import './Cards.css';
import { FontSize } from './constants/FontSizes';
import {
  CardToolBarProps,
  CardToolBar,
  CardToolsBase,
  Input,
} from './ToolBar';
import { ordinalSuffixOf } from './common/utils/TextUtils';
import { AppFont } from './common/types';

const GUTTER_SIZE: number = 25;
const DEFAULT_TEXT: string = (
  'Then came the night of the first falling star'
);

interface CardBase extends CardToolsBase {
  input: Input,
  fontSize: FontSize,
}

interface CardProps extends CardBase, CardToolBarProps { 
  font: AppFont,
}

function Card({ 
  font, 
  fontSize,
  colorScheme,
  input, 
  clickRemoveHandler, 
  clickToTopHandler, 
  clickSelectHandler,
  listId 
}: CardProps) {
  return(
    <div className={classNames(
      "Card", font.selected 
        ? colorScheme.includes('Light') 
          ? "SelectedLight" : "SelectedDark"
        : ""
    )}>
    <CardToolBar 
      colorScheme={colorScheme}
      listId={listId}
      clickRemoveHandler={clickRemoveHandler}
      clickToTopHandler={clickToTopHandler}
      clickSelectHandler={clickSelectHandler}
    />
    <p style={{ margin: "1rem 0" }}>
      {font.family}
      <span style={{ fontSize: "0.8rem" }}>
        {` (${ordinalSuffixOf(font.ranking)} popular)`}
      </span>
    </p>
      <div>
        <link rel="stylesheet" type="text/css" href={font.styleSheetURL} />
        <div style={{
          fontFamily: `'${font.family}', serif`,
          fontSize: fontSize,
          wordWrap: "break-word",
        }}>
          {input || DEFAULT_TEXT}
        </div>
      </div>
    </div>    
  );
}


interface CardsProps {
  // react-window requires to include all information in one {data} prop
  data: CardBase & {
    fonts: AppFont[],
    columnCount: number,
  },
}

interface CellProps extends CardsProps {
  columnIndex: number, 
  rowIndex: number, 
  style: CSS.Properties | any,
}

function Cell({ columnIndex, rowIndex, style, data }: CellProps) {
  const listIndex: number = rowIndex*data.columnCount + columnIndex;
  const i: number = Math.min(listIndex, data.fonts.length-1);
  const displayI: boolean = listIndex < data.fonts.length;
  return (
    <div
      className={"GridItem"}
      style={{
        ...style,
        left: style.left + GUTTER_SIZE,
        top: style.top + GUTTER_SIZE,
        width: style.width - GUTTER_SIZE,
        height: style.height - GUTTER_SIZE
      }}
    >
      {displayI &&
        <Card 
          font={data.fonts[i]} 
          fontSize={data.fontSize}
          colorScheme={data.colorScheme}
          input={data.input} 
          clickRemoveHandler={data.clickRemoveHandler}
          clickToTopHandler={data.clickToTopHandler}
          clickSelectHandler={data.clickSelectHandler}
          listId={i}
        />
      }
    </div>
  );
}

const innerElementType = forwardRef(({ style, ...rest }: CellProps, ref: any) => (
  <div
    ref={ref}
    style={{
      ...style,
      paddingLeft: GUTTER_SIZE,
      paddingTop: GUTTER_SIZE
    }}
    {...rest}
  />
));


export default class Cards extends React.Component<CardsProps> {
  gridRef: any = React.createRef();

  textWidth(): number {
    const el: any = document.createElement('canvas');
    const context: any = el.getContext("2d");
    context.font =  `${this.props.data.fontSize} Montserrat`; //just some big Font
    return context.measureText(this.props.data.input || DEFAULT_TEXT).width;
  }

  render () {
    const columnCount = this.props.data.columnCount;
    return(
      <div className="CardsContainer">
        <button
          className={classNames("ScrollToTop", this.props.data.colorScheme)}
          onClick={() => {
            this.gridRef.current.scrollToItem({
              align: "start",
              columnIndex: 0,
              rowIndex: 0,
            });
          }}
          title="Scroll to top"
        >
          <TiArrowUp /> 
        </button>
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              overscanRowsCount={10}
              className="Grid"
              columnCount={columnCount}
              columnWidth={width / columnCount - GUTTER_SIZE}
              height={height}
              innerElementType={innerElementType}
              rowCount={Math.ceil(this.props.data.fonts.length / columnCount)}
              rowHeight={(
                Math.ceil(this.textWidth()*1.2 / (width / columnCount - GUTTER_SIZE + 20)) 
                * (Number(this.props.data.fontSize.replace('px','')) || 14) * 1.5
                + 170
              )}
              width={width}
              itemData={this.props.data}
              ref={this.gridRef}
            >
              {Cell}
            </Grid>
          )}
        </AutoSizer>
      </div>

    );
  }
}


