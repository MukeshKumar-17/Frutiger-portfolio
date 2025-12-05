import React from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <TopBar />

      <div className="desktop-icon-container">
        <img src="/hard_disk.png" alt="Macintosh HD" className="desktop-icon" />
        <span className="desktop-icon-label">Macintosh HD</span>
      </div>

      <Window />
      <Dock />
    </div>
  );
}

export default App;
