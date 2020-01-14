import React from 'react';
import './App.css';

import { Fonts, fonts } from './fixtures/fonts';

interface CardProps { 
  fonts: Fonts,
}

function Cards({ fonts }: CardProps) {
  return(
     <div className="Cards">
      {fonts.map((font, key) => (
          <p key={key}>{`display fonts Cards in ${font}`}</p>
      ))}
    </div>    
  );
} 


interface AppState extends CardProps {}

export default class App extends React.Component {
  initFonts: Fonts = fonts;
  readonly state: AppState = {
    fonts: this.initFonts,
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
        <footer>
          <p>coded by faebebin | 2020 | Chingu Pre-Work Project</p>
        </footer>
      </div>
    );
  }
}
