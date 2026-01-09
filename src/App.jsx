import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import AeroWindow from './components/AeroWindow';
import AboutMeWindow from './components/AboutMeWindow';
import SkillsWindow from './components/SkillsWindow';
import ProjectsWindow from './components/ProjectsWindow';
import ResumeWindow from './components/ResumeWindow';
import Welcome from './components/Welcome';
import TiltedContactCard from './components/TiltedContactCard';
import BrowserWindow from './components/BrowserWindow';
import './App.css';

function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [nextWindowId, setNextWindowId] = useState(1);
  const [showContactCard, setShowContactCard] = useState(false);
  const [showResumeWindow, setShowResumeWindow] = useState(false);

  const handleIconClick = (icon) => {
    // Don't open if trash is clicked (or handle differently)
    if (icon.id === 'trash') return;

    if (icon.id === 'spring') {
      setShowContactCard(true);
      return;
    }

    if (icon.id === 'monitor') {
      window.open('https://github.com/MukeshKumar-17', '_blank');
      return;
    }

    if (icon.id === 'news') {
      setShowResumeWindow(true);
      return;
    }

    // Create a new window for this icon              
    const newWindow = {
      id: nextWindowId,

      type: icon.id,
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

      {/* Contact Card Overlay */}
      {showContactCard && (
        <TiltedContactCard onClose={() => setShowContactCard(false)} />
      )}



      {/* Aero Windows */}
      {openWindows.map((window) => (
        window.type === 'finder' ? (
          <AboutMeWindow
            key={window.id}
            title={window.title}
            icon={window.icon}
            initialPosition={window.position}
            onClose={() => handleCloseWindow(window.id)}
          />
        ) : window.type === 'sherlock' ? (
          <SkillsWindow
            key={window.id}
            title={window.title}
            icon={window.icon}
            initialPosition={window.position}
            onClose={() => handleCloseWindow(window.id)}
          />
        ) : window.type === 'explorer' ? (
          <BrowserWindow
            key={window.id}
            title={window.title}
            icon={window.icon}
            initialPosition={window.position}
            onClose={() => handleCloseWindow(window.id)}
          />
        ) : window.type === 'system_prefs' ? (
          <ProjectsWindow
            key={window.id}
            title={window.title}
            icon={window.icon}
            initialPosition={window.position}
            onClose={() => handleCloseWindow(window.id)}
          />
        ) : (
          <AeroWindow
            key={window.id}
            title={window.title}
            icon={window.icon}
            initialPosition={window.position}
            onClose={() => handleCloseWindow(window.id)}
          />
        )
      ))}

      {showResumeWindow && (
        <ResumeWindow
          title="Resume"
          icon="/news.png"
          onClose={() => setShowResumeWindow(false)}
        />
      )}

      <Dock onIconClick={handleIconClick} />
    </div>
  );
}

export default App;
