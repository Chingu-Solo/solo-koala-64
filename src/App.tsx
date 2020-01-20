import React, { forwardRef, Fragment } from 'react';
//import ReactDOM from "react-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CSS from 'csstype';
import { Navbar, Nav } from 'react-bootstrap';

import { FixedSizeGrid as Grid } from 'react-window';
import { FaList, FaRegWindowClose } from 'react-icons/fa';
import { FiGrid } from 'react-icons/fi';
import { TiArrowUp } from 'react-icons/ti';
import { AiOutlineReload, AiOutlineSelect } from 'react-icons/ai';
import AutoSizer from 'react-virtualized-auto-sizer';
import classNames from 'classnames';

import fontSizeOptions, { defaultSize, FontSize } from './constants/FontSizes';
import colorSchemeOptions, { defaultColor, ColorScheme } from './constants/ColorSchemes';
import { TextInput } from './components/Tools';
import getGoogleFonts, { GoogleFont } from './api/GoogleFonts';
import { EventIdHandler  } from './common/types';


const COLUMN_COUNT: number = 3;
const GUTTER_SIZE: number = 5;

type Input = string;

interface CardBase {
  input: Input,
  fontSize: FontSize,
  colorScheme: ColorScheme,
  clickRemoveHandler: EventIdHandler
  clickToTopHandler: EventIdHandler
}

interface CardProps extends CardBase { 
  font: GoogleFont,
  listId: number
}

function Card({ 
  font, 
  fontSize,
  colorScheme,
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
          className={colorScheme}
          onClick={() => {}}
          title="Select this font"
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
          title="Remove Font (! New Http Request needed to redo)"
        >
          <FaRegWindowClose className="buttonIcon"/> 
        </button>
      </div>
      <p>{listId}. {font.family}</p>
      <div>
        <link rel="stylesheet" type="text/css" href={font.styleSheetURL} />
        <div style={{
          fontFamily: `'${font.family}', serif`,
          fontSize: fontSize,
        }}>
          {input || defaultText}
        </div>
      </div>
    </div>    
  );
}


interface CardsProps {
  // react-window requires to include all information in one {data} prop
  data: CardBase & {
    fonts: GoogleFont[],
    columnCount: number,
  },
}

interface CellProps extends CardsProps {
  columnIndex: number, 
  rowIndex: number, 
  style: CSS.Properties | any,
}

function Cell({ columnIndex, rowIndex, style, data }: CellProps) {
  const listIndex: number = rowIndex*data.columnCount + columnIndex+1;
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


class Cards extends React.Component<CardsProps> {
  gridRef: any = React.createRef();

  textHeight(): number {
    //TODO pass to Cell via data-props
    const div: HTMLDivElement = document.createElement('div')
    div.innerHTML = this.props.data.input;
    div.style.fontFamily = 'Montserrat'; //just some big Font
    div.style.fontSize = '14pt';  //TODO dynamic
    return 200; //div.measureText().width;
  }

  render () {
    const columnCount = this.props.data.columnCount;
    //const scroll: any = document.getElementsByClassName('Grid')//[0].scrollTop;
    return(
      <Fragment>
        <div>
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
        </div>
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              className="Grid"
              columnCount={columnCount}
              columnWidth={width / columnCount + GUTTER_SIZE}
              height={height}
              innerElementType={innerElementType}
              rowCount={Math.ceil(this.props.data.fonts.length / columnCount)}
              rowHeight={this.textHeight() + GUTTER_SIZE}
              width={width}
              itemData={this.props.data}
              ref={this.gridRef}
            >
              {Cell}
            </Grid>
          )}
        </AutoSizer>
      </Fragment>
    );
  }
}


type Fonts = GoogleFont[] | null;

interface AppState {
  fonts: Fonts,
  bakFonts: Fonts,
  columnCount: number,
  inputText: Input,
  searchText: string,
  fontSize: FontSize,
  colorScheme: ColorScheme,
}

export default class App extends React.Component {
  readonly state: AppState = {
    fonts: null,  //or maybe set some default
    bakFonts: null, // backup to reset without request after messing with state
    columnCount: COLUMN_COUNT,
    searchText: '',
    inputText: '',
    fontSize: defaultSize,
    colorScheme: defaultColor,
  }

  resetState = () => this.setState({ 
    //because we maybe messed with state in RemoveHandler / ToTopHandler
    fonts: this.state.bakFonts, 
    columnCount: COLUMN_COUNT,
    searchText: '',
    inputText: '',
    fontSize: defaultSize,
    colorScheme: defaultColor,
  });

  async componentDidMount() {
    const fonts: GoogleFont[] = await getGoogleFonts();
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

  setListOrGrid = () => this.setState({
    columnCount: this.state.columnCount === 1 ? COLUMN_COUNT: 1
  });

  render() {
    const fonts = this.filteredFonts();
    //TODO the bootstrap Navbar is little lazy and doesn't completely fit the style ... 
    return (
      <div className={classNames("App", this.state.colorScheme)}>
        <Navbar 
          variant={['Black','Blue'].includes(this.state.colorScheme) ? "light" : "dark"} 
          className={this.state.colorScheme} 
          expand="lg">
          <Navbar.Brand href="#home">Google Fonts</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#">Catalog</Nav.Link>
              <Nav.Link href="#">Featured</Nav.Link>
              <Nav.Link href="#">Articles</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className={classNames("Tools", "MainToolBar")}>
          <TextInput
            value={this.state.searchText}
            placeHolder="search fonts" 
            changeHandler={e => this.setState({ searchText: e.target.value })}
            className={this.state.colorScheme}
          />
          <TextInput 
            value={this.state.inputText}
            placeHolder="type-something" 
            changeHandler={e => this.setState({ inputText: e.target.value })}
            className={this.state.colorScheme}
          />
          <button 
            className={this.state.colorScheme}
            onClick={this.setListOrGrid}
            title={`View as ${this.state.columnCount}`}
          >
            {this.state.columnCount === 1 
              ? <FiGrid />
              : <FaList />
            }
          </button>
          <select 
            className={this.state.colorScheme}
            onChange={(e: any): void => this.setState(
              { fontSize: e.target.value }
            )}
          >
            {fontSizeOptions.map((fontSize: FontSize) => (
              <option value={fontSize}>fontSize</option>
            ))}
          </select>
          <select 
            className={this.state.colorScheme}
            onChange={(e: any): void => this.setState(
              { colorScheme: e.target.value }
            )}
          >
            {colorSchemeOptions.map((color: ColorScheme) => (
              <option value={color} className={color}>&#9673;</option>
            ))}
          </select>
          <button 
            className={this.state.colorScheme}
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
                columnCount: this.state.columnCount,
                input: this.state.inputText,
                fontSize: this.state.fontSize,
                colorScheme: this.state.colorScheme,
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
                },
              }} 
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
