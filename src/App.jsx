import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import AeroWindow from './components/AeroWindow';
import Welcome from './components/Welcome';
import './App.css';

function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [nextWindowId, setNextWindowId] = useState(1);

  const handleIconClick = (icon) => {
    // Don't open if trash is clicked (or handle differently)
    if (icon.id === 'trash') return;

    // Create a new window for this icon
    const newWindow = {
      id: nextWindowId,
      title: icon.name,
      icon: icon.src,
      position: {
        x: 100 + (nextWindowId * 30) % 200,
        y: 80 + (nextWindowId * 30) % 150
      }
    };

    setOpenWindows(prev => [...prev, newWindow]);
    setNextWindowId(prev => prev + 1);
  };

  const handleCloseWindow = (windowId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
  };

  // Close all windows when clicking outside
  const handleBackgroundClick = () => {
    if (openWindows.length > 0) {
      setOpenWindows([]);
    }
  };

  return (
    <div className="app-container" onClick={handleBackgroundClick}>
      <TopBar />

      {/* Welcome Typography */}
      <Welcome />

      <div className="desktop-icon-container" onClick={(e) => e.stopPropagation()}>
        <img src="/hard_disk.png" alt="Macintosh HD" className="desktop-icon" />
        <span className="desktop-icon-label">Macintosh HD</span>
      </div>

      {/* Aero Windows */}
      {openWindows.map((window) => (
        <AeroWindow
          key={window.id}
          title={window.title}
          icon={window.icon}
          initialPosition={window.position}
          onClose={() => handleCloseWindow(window.id)}
        />
      ))}

      <Dock onIconClick={handleIconClick} />
    </div>
  );
}

export default App;
