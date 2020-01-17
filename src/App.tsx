import React, { forwardRef } from 'react';
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
import { TextInput } from './components/Tools';
import GoogleFontsAPI, { GoogleFont } from './api/GoogleFonts';

type Input = string;

interface CardBase {
  input: Input,
}

interface Data extends CardBase {
  fonts: GoogleFont[],
}

interface ReactWindowComp {
  // react-window requires to include all information in one {data} prop
  data: Data,
}

interface CardProps extends CardBase { 
  font: GoogleFont,
}

function Card({ font, input }: CardProps) {
  const defaultText: string = (
    'Then came the night of the first falling star'
  );
  return(
    <div className="Card">
      <p>{font.family}</p>
      <div>
        <link rel="stylesheet" type="text/css" href={font.styleSheetURL} />
        <p style={{fontFamily: `'${font.family}', serif`}}>
          {input || defaultText}
        </p>
      </div>
    </div>    
  );
}


interface StyledCardsContainer extends ReactWindowComp {
  style: CSS.Properties | any,
}

interface RowProps extends StyledCardsContainer {
  //TODO typing more specific ?
  index?: number,
}

function Row({ index=0, style, data }: RowProps) {
  return (
    <div style={style}>
      <Card font={data.fonts[index]} input={data.input} />
    </div>
  );
};


const GUTTER_SIZE = 5;
const COLUMN_WIDTH = 250;
const ROW_HEIGHT = 100;
const COLUMN_COUNT = 4;

interface CellProps extends StyledCardsContainer {
  columnIndex: number, 
  rowIndex: number, 
}


function Cell({ columnIndex, rowIndex, style, data }: CellProps) {
  // TODO to mess less with (row, col) indices, 
  // I just didnt display if too many cols
  // to me, this seems little dirty ... 
  const i: number = Math.min(columnIndex + rowIndex, data.fonts.length-1);
  const displayI: boolean = (columnIndex + rowIndex) < data.fonts.length;
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
          input={data.input} 
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


type CardsDisplay = 'grid' | 'list';

interface CardsProps extends ReactWindowComp { 
  cardsDisplay: CardsDisplay,
}

function Cards({ data, cardsDisplay }: CardsProps) {
  //TODO Font Name, the sample text, and an add button
  return(
    <AutoSizer>
       {cardsDisplay === 'list'
         ? ({ height, width }) => (
           <List
              className="List"
              height={height}
              itemCount={data.fonts.length}
              itemSize={150} // itemSize
              width={width}
              itemData={data}
            >
              {Row}
            </List>
          )
        : ({ height, width }) => (
            <Grid
              className="Grid"
              columnCount={COLUMN_COUNT}
              columnWidth={COLUMN_WIDTH + GUTTER_SIZE}
              height={height}
              innerElementType={innerElementType}
              rowCount={Math.ceil(data.fonts.length/COLUMN_COUNT)}
              rowHeight={ROW_HEIGHT + GUTTER_SIZE}
              width={width}
              itemData={data}
            >
              {Cell}
            </Grid>
          )
      } 
    </AutoSizer>
  );
}

type Fonts = GoogleFont[] | null;
interface AppState {
  fontsAPI: GoogleFontsAPI,
  fonts: Fonts,
  cardsDisplay: CardsDisplay,
  inputText: Input,
  searchText: string
}

export default class App extends React.Component {
  readonly state: AppState = {
    fontsAPI: new GoogleFontsAPI(),
    fonts: null,  //or some default
    cardsDisplay: 'grid',
    inputText: '',
    searchText: ''
  }

  async componentDidMount() {
    const fonts: GoogleFont[] = await this.state.fontsAPI._getGoogleFonts();
    this.setState({ fonts })
  }

  filteredFonts(): Fonts {
    const searchText = this.state.searchText;
    const fonts = this.state.fonts;
    if (!searchText) {
      return fonts
    } else {
      return (
        fonts && fonts.filter(
          font => font.family.includes(searchText)
        )
      );
    }
  }

  render() {
    const fonts = this.filteredFonts();
    // all fonts stay in the state, and no new API request needed
    return (
      <div className="App">
        <header>
          <p>Google Fonts</p>
        </header>
        <div className="Tools">
          <TextInput 
            placeHolder="search fonts" 
            changeHandler={e => this.setState({ searchText: e.target.value })}
          />
          <TextInput 
            placeHolder="type-something" 
            changeHandler={e => this.setState({ inputText: e.target.value })}
          />
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
        {fonts && 
          <Cards 
            data={{
              fonts, 
              input: this.state.inputText
            }} 
            cardsDisplay={this.state.cardsDisplay}
          />
        }
        </div>
        <footer>
          <p>coded by faebebin | 2020 | Chingu Pre-Work Project</p>
        </footer>
      </div>
    );
  }
}
