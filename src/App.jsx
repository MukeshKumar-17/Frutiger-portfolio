import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
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

  // Window stack for z-index management - last item has highest z-index
  const [windowStack, setWindowStack] = useState([]);
  const baseZIndex = 100;

  // Get z-index for a window based on its position in the stack
  const getZIndex = useCallback((windowId) => {
    const index = windowStack.indexOf(windowId);
    return index === -1 ? baseZIndex : baseZIndex + index;
  }, [windowStack]);

  // Bring a window to the front
  const bringToFront = useCallback((windowId) => {
    setWindowStack(prev => {
      const filtered = prev.filter(id => id !== windowId);
      return [...filtered, windowId];
    });
  }, []);

  // Close all windows with animation support
  const closeAllWindows = useCallback(() => {
    setOpenWindows([]);
    setWindowStack([]);
    setShowResumeWindow(false);
  }, []);

  // Handle Contact Card open - close all windows first
  const handleOpenContactCard = useCallback(() => {
    closeAllWindows();
    setShowContactCard(true);
  }, [closeAllWindows]);

  const handleIconClick = (icon) => {
    // Don't open if trash is clicked (or handle differently)
    if (icon.id === 'trash') return;

    if (icon.id === 'spring') {
      handleOpenContactCard();
      return;
    }

    if (icon.id === 'monitor') {
      window.open('https://github.com/MukeshKumar-17', '_blank');
      return;
    }

    if (icon.id === 'news') {
      // Bring resume to front if already open, otherwise open it
      if (!showResumeWindow) {
        setShowResumeWindow(true);
        setWindowStack(prev => [...prev, 'resume']);
      } else {
        bringToFront('resume');
      }
      return;
    }

    // Check if this type of window is already open
    const existingWindow = openWindows.find(w => w.type === icon.id);
    if (existingWindow) {
      // Bring existing window to front
      bringToFront(existingWindow.id);
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
    setWindowStack(prev => [...prev, nextWindowId]);
    setNextWindowId(prev => prev + 1);
  };

  const handleCloseWindow = (windowId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    setWindowStack(prev => prev.filter(id => id !== windowId));
  };

  const handleCloseResume = () => {
    setShowResumeWindow(false);
    setWindowStack(prev => prev.filter(id => id !== 'resume'));
  };

  // Background click - do nothing (keep windows open like real desktop)
  const handleBackgroundClick = () => {
    // Removed: closing all windows on background click
    // This matches real desktop OS behavior
  };

  // Render window based on type
  const renderWindow = (win) => {
    const commonProps = {
      key: win.id,
      title: win.title,
      icon: win.icon,
      initialPosition: win.position,
      onClose: () => handleCloseWindow(win.id),
      zIndex: getZIndex(win.id),
      onFocus: () => bringToFront(win.id)
    };

    switch (win.type) {
      case 'finder':
        return <AboutMeWindow {...commonProps} />;
      case 'sherlock':
        return <SkillsWindow {...commonProps} />;
      case 'explorer':
        return <BrowserWindow {...commonProps} />;
      case 'system_prefs':
        return <ProjectsWindow {...commonProps} />;
      default:
        return <AeroWindow {...commonProps} />;
    }
  };

  return (
    <div className="app-container" onClick={handleBackgroundClick}>
      <TopBar
        onOpenProjects={() => {
          const existingWindow = openWindows.find(w => w.type === 'system_prefs');
          if (existingWindow) {
            bringToFront(existingWindow.id);
          } else {
            handleIconClick({ id: 'system_prefs', name: 'Projects', src: '/system_prefs.png' });
          }
        }}
        onOpenContact={handleOpenContactCard}
        onOpenResume={() => {
          if (!showResumeWindow) {
            setShowResumeWindow(true);
            setWindowStack(prev => [...prev, 'resume']);
          } else {
            bringToFront('resume');
          }
        }}
      />

      {/* Welcome Typography */}
      <Welcome />

      {/* Contact Card Overlay - highest z-index, covers everything */}
      <AnimatePresence>
        {showContactCard && (
          <TiltedContactCard onClose={() => setShowContactCard(false)} />
        )}
      </AnimatePresence>

      {/* Aero Windows */}
      {openWindows.map(renderWindow)}

      {showResumeWindow && (
        <ResumeWindow
          title="Resume"
          icon="/news.png"
          onClose={handleCloseResume}
          zIndex={getZIndex('resume')}
          onFocus={() => bringToFront('resume')}
        />
      )}

      <Dock onIconClick={handleIconClick} />
    </div>
  );
}

export default App;
