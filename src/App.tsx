import React from 'react';
import update from 'immutability-helper';
//import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import classNames from 'classnames';

import './App.css';
import './ColorSchemes.css';
import { defaultSize } from './constants/FontSizes';
import { defaultColor } from './constants/ColorSchemes';
import { 
  MainToolBarBase,
  MainToolBar,
  InfoBarProps,
  InfoBar
} from './ToolBar';
import { TiArrowUp } from 'react-icons/ti';
import CardsContainer from './Cards';
import getGoogleFonts, { GoogleFont } from './api/GoogleFonts';
import { Fonts } from './common/types';
import { shuffle } from './common/utils/IterablesUtils';

// set the minimum width befor column-count gets reduced by 1.
const MIN_COLUMN_WIDTH: number = 500;

interface AppState extends MainToolBarBase, InfoBarProps {};

export default class App extends React.Component {
  appRef: any = React.createRef();
  gridRef: any = React.createRef();

  readonly state: AppState = {
    fonts: [],
    gridDisplay: true,
    searchText: '',
    inputText: '',
    fontSize: defaultSize,
    colorScheme: defaultColor,
    bakFonts: [], // backup to reset without request after messing with state
    columnCount: 1, // fallback value
  }

  resetState = () => this.setState({ 
    fonts: this.state.bakFonts, 
    gridDisplay: true,
    searchText: '',
    inputText: '',
    fontSize: defaultSize,
    colorScheme: defaultColor,
  });

  async componentDidMount() {
    const gFonts: GoogleFont[] = await getGoogleFonts();
    if (gFonts) {
      const fonts: Fonts = gFonts.map(
        (font, i) => Object.defineProperties(font, {
          selected: { value: false },
          ranking: { value: i+1 }
        }
      ));
      this.setState({ 
        fonts, 
        bakFonts: [...fonts],
        columnCount: this.getColumnCount(this.appRef.current.offsetWidth)
      });
    }
    window.addEventListener('resize', () => this.updateColumnnCount());
  }

  filteredFonts = (): Fonts => !this.state.searchText
    ? this.state.fonts
    : this.state.fonts.filter(font => (
        font.family.toLowerCase().includes(this.state.searchText.toLowerCase())
      ));

  updateColumnnCount = () => {
    this.setState({ columnCount: this.getColumnCount(this.appRef.current.offsetWidth) });
  }

  getColumnCount = (width: number): number => Math.ceil(width / MIN_COLUMN_WIDTH);

  switchListGrid = () => {
    this.setState({ gridDisplay: !this.state.gridDisplay });
  }

  shuffleFonts = () => {this.setState({ fonts: shuffle(this.state.fonts) })}

  scrollToTop = () => {
    this.gridRef.current.scrollToItem({
      align: "start",
      columnIndex: 0,
      rowIndex: 0,
    });
  }

  render() {
    //TODO the bootstrap Navbar was lazy implementation and doesn't completely fit the style ... 
    //it is more of a placeholder, as no links aren't yet implemented anyway'
    const fonts = this.filteredFonts();
    return (
      <div className={classNames("App", this.state.colorScheme)} ref={this.appRef}>
        <Navbar 
          sticky="top"
          variant={this.state.colorScheme.includes('Light') ? "light" : "dark"} 
          className={this.state.colorScheme} 
          expand="md"
        >
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
          gridDisplay={this.state.gridDisplay}
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
          shuffleFonts={this.shuffleFonts}
          resetState={() => {
            this.resetState();
            this.scrollToTop();
          }}
        />
        <InfoBar fonts={fonts} bakFonts={this.state.bakFonts}/>
        {fonts!==[] && 
          <CardsContainer
            gridRef={this.gridRef}
            data={{
              fonts, 
              columnCount: this.state.gridDisplay ? this.state.columnCount : 1,
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
        <button
          className={classNames("ScrollToTop", this.state.colorScheme)}
          onClick={this.scrollToTop}
          title="Scroll to top"
        >
          <TiArrowUp /> 
        </button>
        <footer>
          <p>coded by faebebin | 2020 | Chingu Pre-Work Project</p>
        </footer>
      </div>
    );
  }
}
