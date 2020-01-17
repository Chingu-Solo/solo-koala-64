import React from 'react';
import './App.css';

import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
//import { fonts } from './fixtures/fonts';

import GoogleFontsAPI, { GoogleFont } from './api/GoogleFonts';


interface CardsProps { 
  data: GoogleFont[],
}

interface CardProps { 
  font: GoogleFont,
}


interface CardsRowProps extends CardsProps {
  //TODO proper typing
  index: any,
  style: any,
}


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
function CardsRow({ index, style, data }: CardsRowProps) {
  const font: GoogleFont = data[index];
  return (
    <div style={style}>
      <Card key={index} font={font} />
    </div>
  );
};


//***************************** rm
function Row({ index, style, data }: CardsRowProps) {
  const font: GoogleFont = data[index];
  return (
    <div style={style}>
      Font {index}: {font.family}
    </div>
  );
} 

interface ExampleProps { data: any }
const Example = ({ data }: ExampleProps) => (
  <AutoSizer>
    {({ height, width }) => (
      <List
        className="List"
        height={height}
        itemCount={data.length}
        itemSize={35}
        width={width}
        itemData={data}
      >
        {Row}
      </List>
    )}
  </AutoSizer>
);
//****************************

function Cards({ data }: CardsProps) {
  //TODO Font Name, the sample text, and an add button
  return(
    <div>
      {data && 
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
              {CardsRow}
            </List>
          )}
        </AutoSizer>
      }
    </div>    
  );
} 


interface AppState {
  fontsAPI: GoogleFontsAPI,
  fonts: GoogleFont[] | null,
}

export default class App extends React.Component {
  readonly state: AppState = {
    fontsAPI: new GoogleFontsAPI(),
    fonts: null,  //or some default
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
          tool box
        </div>
        {fonts && <Cards data={fonts}/>}
        {fonts && <Example data={fonts}/>}
        <footer>
          <p>coded by faebebin | 2020 | Chingu Pre-Work Project</p>
        </footer>
      </div>
    );
  }
}
