import React, { forwardRef, Fragment } from 'react';
//import ReactDOM from "react-dom";
import './App.css';
import CSS from 'csstype';

import { 
  FixedSizeList as List,
  FixedSizeGrid as Grid
} from 'react-window';
import { FaList, FaRegWindowClose } from 'react-icons/fa';
import { FiGrid } from 'react-icons/fi';
import { TiArrowUp } from 'react-icons/ti';
import { AiOutlineReload, AiOutlineSelect } from 'react-icons/ai';
import AutoSizer from 'react-virtualized-auto-sizer';
//import { fonts } from './fixtures/fonts';
import { TextInput } from './components/Tools';
import GoogleFontsAPI, { GoogleFont } from './api/GoogleFonts';
import { EventIdHandler } from './common/types';

type Input = string;

interface CardBase {
  input: Input,
  clickRemoveHandler: EventIdHandler
  clickToTopHandler: EventIdHandler
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
  listId: number
}

function Card({ 
  font, 
  input, 
  clickRemoveHandler, 
  clickToTopHandler, 
  listId 
}: CardProps) {
  const defaultText: string = (
    'Then came the night of the first falling star'
  );
  return(
    <div className="Card">
      <div className="Tools">
        <button 
          onClick={() => {}}
          title="Select this font"
        >
          <AiOutlineSelect /> 
        </button>
        <button 
          onClick={() => clickToTopHandler(listId)}
          title="Move font to top"
        >
          <TiArrowUp /> 
        </button>
        <button 
          onClick={() => clickRemoveHandler(listId)}
          title="Remove Font (! New Http Request needed to redo)"
        >
          <FaRegWindowClose /> 
        </button>
      </div>
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
      <Card 
        font={data.fonts[index]} 
        input={data.input} 
        clickRemoveHandler={data.clickRemoveHandler}
        clickToTopHandler={data.clickToTopHandler}
        listId={index}
      />
    </div>
  );
};


const GUTTER_SIZE = 5;
const COLUMN_WIDTH = 250;
const ROW_HEIGHT = 100;
const COLUMN_COUNT = 3;

interface CellProps extends StyledCardsContainer {
  columnIndex: number, 
  rowIndex: number, 
}


function Cell({ columnIndex, rowIndex, style, data }: CellProps) {
  const listIndex = columnIndex*COLUMN_COUNT + rowIndex;
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
          input={data.input} 
          clickRemoveHandler={data.clickRemoveHandler}
          clickToTopHandler={data.clickToTopHandler}
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


type CardsDisplay = 'grid' | 'list';

interface CardsProps extends ReactWindowComp { 
  cardsDisplay: CardsDisplay,
}

class Cards extends React.Component<CardsProps> {
  //TODO Font Name, the sample text, and an add button
  listRef: any = React.createRef();
  gridRef: any = React.createRef();
  render () {
    return(
      <Fragment>
        <div>
        <button 
          onClick={() => {
            if (this.props.cardsDisplay === 'list') {
              this.gridRef.current.scrollToItem({
                align: "start",
                columnIndex: 0,
                rowIndex: 0,
              });
            } else {
              this.listRef.current.scrollToItem(0, 'start');
            }
          }}
          title="Scroll to top"
        >
          <TiArrowUp /> 
        </button>
      </div>
        <AutoSizer>
           {this.props.cardsDisplay === 'list'
             ? ({ height, width }) => (
                <Grid
                  className="Grid"
                  columnCount={COLUMN_COUNT}
                  columnWidth={COLUMN_WIDTH + GUTTER_SIZE}
                  height={height}
                  innerElementType={innerElementType}
                  rowCount={Math.ceil(this.props.data.fonts.length/COLUMN_COUNT)}
                  rowHeight={ROW_HEIGHT + GUTTER_SIZE}
                  width={width}
                  itemData={this.props.data}
                  ref={this.gridRef}
                >
                  {Cell}
                </Grid>
               )
             : ({ height, width }) => (
               <List
                  className="List"
                  height={height}
                  itemCount={this.props.data.fonts.length}
                  itemSize={150} // itemSize
                  width={width}
                  itemData={this.props.data}
                  ref={this.listRef}
                >
                  {Row}
                </List>
              )
          } 
        </AutoSizer>
      </Fragment>
    );
  }
}

type Fonts = GoogleFont[] | null;
interface AppState {
  fontsAPI: GoogleFontsAPI,
  fonts: Fonts,
  bakFonts: Fonts,
  cardsDisplay: CardsDisplay,
  inputText: Input,
  searchText: string
}

export default class App extends React.Component {
  readonly state: AppState = {
    fontsAPI: new GoogleFontsAPI(),
    fonts: null,  //or maybe set some default
    bakFonts: null, // backup to reset without request after messing with state
    cardsDisplay: 'list',
    inputText: '',
    searchText: ''
  }

  async componentDidMount() {
    const fonts: GoogleFont[] = await this.state.fontsAPI._getGoogleFonts();
    this.setState({ fonts })
    fonts && this.setState({ bakFonts: [...fonts] })
  }

  filteredFonts(): Fonts {
    const searchText = this.state.searchText;
    const fonts = this.state.fonts;
    if (!searchText) {
      return fonts
    } else {
      return (
        fonts && fonts.filter(
          font => font.family.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }

  resetState = () => this.setState({ 
    cardsDisplay: 'list',
    searchText: '',
    inputText: '',
    fonts: this.state.bakFonts, //because we messed with state
  });

  setListOrGrid = () => this.setState({
    cardsDisplay: this.state.cardsDisplay === 'list' ? 'grid': 'list'
  });

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
            value={this.state.searchText}
            placeHolder="search fonts" 
            changeHandler={e => this.setState({ searchText: e.target.value })}
          />
          <TextInput 
            value={this.state.inputText}
            placeHolder="type-something" 
            changeHandler={e => this.setState({ inputText: e.target.value })}
          />
          <button 
            onClick={this.setListOrGrid}
            title={`View as ${this.state.cardsDisplay}`}
          >
            {this.state.cardsDisplay === 'list'
              ? <FaList />
              : <FiGrid />
            }
          </button>
          <button 
            onClick={this.resetState}
            title="Reset"
          >
            <AiOutlineReload />
          </button>
        </div>
        <div className="Cards">
          {fonts && 
            <Cards 
              data={{
                fonts, 
                input: this.state.inputText,
                clickRemoveHandler: listId => {
                  //if (sureFonts.indexOf(listId) !== -1) { //TODO type problem
                  if (fonts.length > listId) {
                    fonts.splice(listId, 1);
                    this.setState({ fonts: fonts });
                  }
                },
                clickToTopHandler: listId => {
                  if (fonts.length > listId) {
                    const newTop = fonts.splice(listId, 1)[0];
                    this.setState({ fonts: [newTop, ...fonts]});
                  }
                }
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
