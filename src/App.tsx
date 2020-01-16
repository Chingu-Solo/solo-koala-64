import React from 'react';
import './App.css';

import { fonts } from './fixtures/fonts';

import GoogleFontsAPI, { GoogleFont } from './api/GoogleFonts'


interface CardProps { 
  fonts: GoogleFont,
}

function Cards({ fonts }: CardProps) {
  //TODO Font Name, the sample text, and an add button
  return(
     <div className="Cards">
      {fonts.map((font, key) => (
          <p key={key}>{`display fonts Cards in ${font}`}</p>
      ))}
    </div>    
  );
} 


interface AppState extends CardProps {
  response: string;
}

export default class App extends React.Component {
  fonts: Fonts = fonts;
  readonly state: AppState = {
    fonts: this.initFonts, //TODO call G-fonts API once.  async > if !fonts > display standard
    response: '',
  }

  componentDidMount() {
    this.getGoogleFonst(); 
  }

  render() {
    return (
      <div className="App">
        <header>
          <p>Google Fonts</p>
        </header>
        <div className="Tools">
        </div>
        <Cards fonts={this.state.fonts}/>
        <p>{this.state.response}</p>
        <footer>
          <p>coded by faebebin | 2020 | Chingu Pre-Work Project</p>
        </footer>
      </div>
    );
  }
}
