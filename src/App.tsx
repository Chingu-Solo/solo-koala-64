import React from 'react';
import './App.css';

import { FixedSizeList as List } from 'react-window';
//import { fonts } from './fixtures/fonts';

import GoogleFontsAPI, { GoogleFont } from './api/GoogleFonts';


interface CardsProps { 
  fonts: GoogleFont[] | null,
}

interface CardProps { 
  font: GoogleFont,
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

function Cards({ fonts }: CardsProps) {
  //TODO Font Name, the sample text, and an add button
  return(
    <div className="Cards">
      {fonts && fonts.map((font, key) => (
        <Card font={font}/>
      ))}
    </div>    
  );
} 


interface AppState extends CardsProps {
  fontsAPI: GoogleFontsAPI,
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
    return (
      <div className="App">
        <header>
          <p>Google Fonts</p>
        </header>
        <div className="Tools">
          tool box
        </div>
        <Cards fonts={this.state.fonts}/>
        <footer>
          <p>coded by faebebin | 2020 | Chingu Pre-Work Project</p>
        </footer>
      </div>
    );
  }
}
