import React from 'react';
import { Tile } from './tile'

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Tile value={1} color="red"/>
        <Tile value={6} color="black"/>
        <Tile value={10} color="blue"/>
        <Tile value={13} color="orange"/>
      </header>
    </div>
  );
}

export default App;
