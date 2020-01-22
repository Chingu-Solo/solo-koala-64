import React, { forwardRef, Fragment } from 'react';
import update from 'immutability-helper';
//import ReactDOM from "react-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CSS from 'csstype';
import { Navbar, Nav } from 'react-bootstrap';

import { FixedSizeGrid as Grid } from 'react-window';
import { TiArrowUp } from 'react-icons/ti';
import { AiOutlineReload, AiOutlineSelect } from 'react-icons/ai';
import AutoSizer from 'react-virtualized-auto-sizer';
import classNames from 'classnames';

import fontSizeOptions, { defaultSize, FontSize } from './constants/FontSizes';
import colorSchemeOptions, { defaultColor, ColorScheme } from './constants/ColorSchemes';

import { 
  MainToolBarBase,
  MainToolBar,
  CardToolBar,
  CardToolBarProps,
  CardToolsBase,
  Input,
  InfoBarProps,
  InfoBar
} from './ToolBar';
import getGoogleFonts, { GoogleFont } from './api/GoogleFonts';
import { 
  EventHandler, 
  InputEvent,
  AppFont,
  Fonts,
} from './common/types';


const COLUMN_COUNT: number = 3;
const GUTTER_SIZE: number = 5;


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
  const defaultText: string = (
    'Then came the night of the first falling star'
  );
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


class Cards extends React.Component<CardsProps> {
  gridRef: any = React.createRef();

  textHeight(): number {
    //TODO pass to Cell via data-props
    const div: HTMLDivElement = document.createElement('div')
    div.innerHTML = this.props.data.input;
    div.style.fontFamily = 'Montserrat'; //just some big Font
    div.style.fontSize = '14pt';  //TODO dynamic
    return 150; //div.measureText().width;
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
              overscanRowsCount={10}
              className="Grid"
              columnCount={columnCount}
              columnWidth={width / (columnCount+0.01) - 2*GUTTER_SIZE}
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


interface AppState extends MainToolBarBase, InfoBarProps {}

export default class App extends React.Component {
  readonly state: AppState = {
    fonts: [],
    bakFonts: [], // backup to reset without request after messing with state
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
    const gFonts: GoogleFont[] = await getGoogleFonts();
    const fonts: Fonts = gFonts.map(font => (
      Object.defineProperty(font, 'selected', { value: false })
    ))
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

  switchListGrid = () => this.setState({
    columnCount: this.state.columnCount === 1 ? COLUMN_COUNT: 1
  });

  render() {
    //TODO the bootstrap Navbar was lazy implementation 
    //and doesn't completely fit the style ... 
    //it is to be consiere like a placeholder, as the links aren't 
    //implemented anyway'
    const fonts = this.filteredFonts();
    return (
      <div className={classNames("App", this.state.colorScheme)}>
        <Navbar 
          variant={this.state.colorScheme.includes('Light') ? "light" : "dark"} 
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
        <MainToolBar 
          inputText={this.state.inputText}
          searchText={this.state.searchText}
          fontSize={this.state.fontSize}
          colorScheme={this.state.colorScheme}
          columnCount={this.state.columnCount}
          changeSearchHandler={e => {
            this.setState({ searchText: e.target.value });
          }}
          changeTextHandler={e => {
            this.setState({ inputText: e.target.value });
          }}
          changeSelectFontSizeHandler={e => {
            this.setState({ fontSize: e.target.value });
          }}
          changeSelectColorHandler={e => {
            this.setState({ colorScheme: e.target.value });
          }}
          switchListGrid={this.switchListGrid}
          resetState={this.resetState}
        />
        <InfoBar fonts={fonts} bakFonts={this.state.bakFonts}/>
        <div className="Cards">
          {fonts!==[] && 
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
                clickSelectHandler: listId => {
                  if (fonts.length > listId) {
                    const selected = fonts[listId].selected;
                    this.setState({
                      fonts: update(
                        fonts, 
                        {[listId]: {selected: {$set: !selected}}}
                      )
                    });
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
