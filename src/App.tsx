import React, { forwardRef, createRef } from 'react';
//import ReactDOM from "react-dom";
import './App.css';
import CSS from 'csstype';

import { 
  FixedSizeList as List,
  FixedSizeGrid as Grid
} from 'react-window';
import { FaList } from 'react-icons/fa';
import { FiGrid } from 'react-icons/fi';
import AutoSizer from 'react-virtualized-auto-sizer';
//import { fonts } from './fixtures/fonts';

import GoogleFontsAPI, { GoogleFont } from './api/GoogleFonts';


interface CardsProps { 
  data: GoogleFont[],
}

interface CardProps { 
  font: GoogleFont,
}

type CardsDisplay = 'grid' | 'list';


function Card({ font }: CardProps) {
  return(
    <div className="Card">
      <p>{font.family}</p>
      <div>
        <link rel="stylesheet" type="text/css" href={font.styleSheetURL} />
        <p style={{fontFamily: `'${font.family}', serif`}}>
          {`display fonts Cards in ${font.family}`}
        </p>
      </div>
    </div>    
  );
}


//Gird vs List switch
function Row({ index=0, style, data }: RowProps) {
  return (
    <div style={style}>
      <Card font={data[index]} />
    </div>
  );
};


interface RowProps extends CardsProps {
  //TODO give the typing some sense ;)
  index?: number,
  style?: CSS.Properties | any,
  display?: CardsDisplay,
}

function Cards({ data }: CardsProps) {
  //TODO Font Name, the sample text, and an add button
  return(
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="List"
          height={height}
          itemCount={data.length}
          itemSize={150} // itemSize
          width={width}
          itemData={data}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
} 


const GUTTER_SIZE = 5;
const COLUMN_WIDTH = 250;
const ROW_HEIGHT = 100;

interface CellProps { //extends CardsProps {
  columnIndex: number, 
  rowIndex: number, 
  style: CSS.Properties | any,
}


const Cell = ({ columnIndex, rowIndex, style }: CellProps) => (
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
    r{rowIndex}, c{columnIndex}
  </div>
);

const Example = () => (
  <AutoSizer>
    {({ height, width }) => (
      <Grid
        className="Grid"
        columnCount={50}
        columnWidth={COLUMN_WIDTH + GUTTER_SIZE}
        height={height}
        innerElementType={innerElementType}
        rowCount={100}
        rowHeight={ROW_HEIGHT + GUTTER_SIZE}
        width={width}
      >
        {Cell}
      </Grid>
    )}
  </AutoSizer>
);

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


interface AppState {
  fontsAPI: GoogleFontsAPI,
  fonts: GoogleFont[] | null,
  cardsDisplay: CardsDisplay,
}



export default class App extends React.Component {
  readonly state: AppState = {
    fontsAPI: new GoogleFontsAPI(),
    fonts: null,  //or some default
    cardsDisplay: 'grid',
  }

  async componentDidMount() {
    const fonts: GoogleFont[] = await this.state.fontsAPI._getGoogleFonts();
    this.setState({ fonts })
  }

  render() {
    const fonts = this.state.fonts;
    return (
      <div className="App">
        <header>
          <p>Google Fonts</p>
        </header>
        <div className="Tools">
        <button onClick={() => this.setState({ 
          cardsDisplay: this.state.cardsDisplay === 'list' ? 'grid': 'list'
        })}>
            {this.state.cardsDisplay === 'list'
              ? <FaList />
              : <FiGrid />
            }
          </button>
        </div>
        <div className="Cards">
          {fonts && <Cards data={fonts} display={this.state.cardsDisplay}/>}
        </div>
        <footer>
          <p>coded by faebebin | 2020 | Chingu Pre-Work Project</p>
        </footer>
      </div>
    );
  }
}

