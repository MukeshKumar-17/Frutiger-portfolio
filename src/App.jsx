import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import AeroWindow from './components/AeroWindow';
import AboutMeWindow from './components/AboutMeWindow';
import SkillsWindow from './components/SkillsWindow';
import ProjectsWindow from './components/ProjectsWindow';
import ResumeWindow from './components/ResumeWindow';
import GalleryWindow from './components/GalleryWindow';
import Welcome from './components/Welcome';
import TiltedContactCard from './components/TiltedContactCard';
import BrowserWindow from './components/BrowserWindow';
import MusicPlayer from './components/MusicPlayer';
import DesktopIcon from './components/DesktopIcon';
import FinderWindow from './components/FinderWindow';
import SpotifyWindow from './components/SpotifyWindow';
import TrashWindow from './components/TrashWindow';
import './App.css';

function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [nextWindowId, setNextWindowId] = useState(1);
  const [showContactCard, setShowContactCard] = useState(false);
  const [showResumeWindow, setShowResumeWindow] = useState(false);
  const [showGalleryWindow, setShowGalleryWindow] = useState(false);
  const [showSpotifyWindow, setShowSpotifyWindow] = useState(false);
  const [showTrashWindow, setShowTrashWindow] = useState(false);
  const [triggerCloseAll, setTriggerCloseAll] = useState(false);

  // Window stack for z-index management - last item has highest z-index
  const [windowStack, setWindowStack] = useState([]);
  const baseZIndex = 100;

  // Get z-index for a window based on its position in the stack
  // Windows not in stack yet get highest z-index to appear on top
  const getZIndex = useCallback((windowId) => {
    const index = windowStack.indexOf(windowId);
    if (index === -1) {
      // Window not in stack yet - give it highest z-index (will be added to stack end)
      return baseZIndex + windowStack.length + 10;
    }
    return baseZIndex + index;
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
    setTriggerCloseAll(true);
    // Reset trigger after animations complete
    setTimeout(() => {
      setOpenWindows([]);
      setWindowStack([]);
      setShowResumeWindow(false);
      setShowGalleryWindow(false);
      setShowSpotifyWindow(false);
      setShowTrashWindow(false);
      setTriggerCloseAll(false);
    }, 250); // Match animation duration
  }, []);

  // Handle Contact Card open - close all windows first
  const handleOpenContactCard = useCallback(() => {
    closeAllWindows();
    setShowContactCard(true);
  }, [closeAllWindows]);

  const handleIconClick = (icon) => {
    if (icon.id === 'trash') {
      // Open trash window
      if (!showTrashWindow) {
        setShowTrashWindow(true);
        setWindowStack(prev => [...prev, 'trash']);
      } else {
        bringToFront('trash');
      }
      return;
    }

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

    if (icon.id === 'mail') {
      // Open gallery window
      if (!showGalleryWindow) {
        setShowGalleryWindow(true);
        setWindowStack(prev => [...prev, 'gallery']);
      } else {
        bringToFront('gallery');
      }
      return;
    }

    if (icon.id === 'spotify') {
      // Open Spotify window
      if (!showSpotifyWindow) {
        setShowSpotifyWindow(true);
        setWindowStack(prev => [...prev, 'spotify']);
      } else {
        bringToFront('spotify');
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
        x: Math.max(50, (window.innerWidth - 700) / 2),
        y: Math.max(50, (window.innerHeight - 500) / 2)
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

  const handleCloseGallery = () => {
    setShowGalleryWindow(false);
    setWindowStack(prev => prev.filter(id => id !== 'gallery'));
  };

  const handleCloseSpotify = () => {
    setShowSpotifyWindow(false);
    setWindowStack(prev => prev.filter(id => id !== 'spotify'));
  };

  const handleCloseTrash = () => {
    setShowTrashWindow(false);
    setWindowStack(prev => prev.filter(id => id !== 'trash'));
  };

  // Background click - close all windows when clicking outside
  const handleBackgroundClick = (e) => {
    // Only close if clicking directly on the app container background
    if (e.target.classList.contains('app-container')) {
      closeAllWindows();
      setShowContactCard(false);
    }
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
      onFocus: () => bringToFront(win.id),
      triggerClose: triggerCloseAll
    };

    switch (win.type) {
      case 'finder':
        return (
          <FinderWindow
            {...commonProps}
            onOpenResume={() => {
              if (!showResumeWindow) {
                setShowResumeWindow(true);
                setWindowStack(prev => [...prev, 'resume']);
              } else {
                bringToFront('resume');
              }
            }}
            onOpenGallery={() => {
              if (!showGalleryWindow) {
                setShowGalleryWindow(true);
                setWindowStack(prev => [...prev, 'gallery']);
              } else {
                bringToFront('gallery');
              }
            }}
            onOpenAboutMe={() => {
              const existingWindow = openWindows.find(w => w.type === 'aboutme');
              if (existingWindow) {
                bringToFront(existingWindow.id);
              } else {
                handleIconClick({ id: 'aboutme', name: 'About Me', src: '/finder.png' });
              }
            }}
            onOpenProject={(projectId) => {
              // Close existing Projects window if any
              const existingWindow = openWindows.find(w => w.type === 'system_prefs');
              if (existingWindow) {
                handleCloseWindow(existingWindow.id);
              }
              // Create new Projects window with pre-selected project
              const newId = nextWindowId;
              const newWindow = {
                id: newId,
                type: 'system_prefs',
                title: 'Projects',
                icon: '/system_prefs.png',
                preSelectedProjectId: projectId,
                position: { x: Math.max(50, (window.innerWidth - 800) / 2), y: Math.max(50, (window.innerHeight - 500) / 2) }
              };
              setOpenWindows(prev => [...prev, newWindow]);
              // Ensure new window is at the top of the stack
              setWindowStack(prev => [...prev.filter(id => id !== newId), newId]);
              setNextWindowId(prev => prev + 1);
            }}
          />
        );
      case 'aboutme':
        return <AboutMeWindow {...commonProps} />;
      case 'sherlock':
        return <SkillsWindow {...commonProps} />;
      case 'explorer':
        return <BrowserWindow {...commonProps} />;
      case 'system_prefs':
        return (
          <ProjectsWindow
            {...commonProps}
            preSelectedProjectId={win.preSelectedProjectId || null}
            onOpenAboutMe={() => handleIconClick({ id: 'finder', name: 'About Me', src: '/finder.png' })}
            onOpenResume={() => {
              if (!showResumeWindow) {
                setShowResumeWindow(true);
                setWindowStack(prev => [...prev, 'resume']);
              } else {
                bringToFront('resume');
              }
            }}
          />
        );
      case 'mail':
        return <GalleryWindow {...commonProps} />;
      case 'music':
        return <MusicPlayer {...commonProps} />;
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

      {/* Desktop Icons */}

      <DesktopIcon
        name="Resume.pdf"
        icon="/docr.png"
        initialPosition={{ x: 20, y: 115 }}
        onClick={() => {
          if (!showResumeWindow) {
            setShowResumeWindow(true);
            setWindowStack(prev => [...prev, 'resume']);
          } else {
            bringToFront('resume');
          }
        }}
      />

      <DesktopIcon
        name="AboutMe.txt"
        icon="/doct.png"
        initialPosition={{ x: 20, y: 15 }}
        onClick={() => {
          const existingWindow = openWindows.find(w => w.type === 'aboutme');
          if (existingWindow) {
            bringToFront(existingWindow.id);
          } else {
            handleIconClick({ id: 'aboutme', name: 'About Me', src: '/finder.png' });
          }
        }}
      />

      {/* Project Desktop Icons */}
      <DesktopIcon
        name="Project01"
        icon="/glass_folder.png"
        initialPosition={{ x: 20, y: 215 }}
        onClick={() => {
          // Check if a Projects window already exists
          const existingWindow = openWindows.find(w => w.type === 'system_prefs');
          if (existingWindow) {
            // Close it and open a new one with the selected project
            handleCloseWindow(existingWindow.id);
          }
          // Create new Projects window with pre-selected project
          const newId = nextWindowId;
          const newWindow = {
            id: newId,
            type: 'system_prefs',
            title: 'Projects',
            icon: '/system_prefs.png',
            preSelectedProjectId: 1, // WHOP Clone
            position: { x: Math.max(50, (window.innerWidth - 800) / 2), y: Math.max(50, (window.innerHeight - 500) / 2) }
          };
          setOpenWindows(prev => [...prev, newWindow]);
          // Ensure new window is at the top of the stack
          setWindowStack(prev => [...prev.filter(id => id !== newId), newId]);
          setNextWindowId(prev => prev + 1);
        }}
      />

      <DesktopIcon
        name="Project02"
        icon="/glass_folder.png"
        initialPosition={{ x: 20, y: 315 }}
        onClick={() => {
          const existingWindow = openWindows.find(w => w.type === 'system_prefs');
          if (existingWindow) {
            handleCloseWindow(existingWindow.id);
          }
          const newId = nextWindowId;
          const newWindow = {
            id: newId,
            type: 'system_prefs',
            title: 'Projects',
            icon: '/system_prefs.png',
            preSelectedProjectId: 2, // MeetMogger AI
            position: { x: Math.max(50, (window.innerWidth - 800) / 2), y: Math.max(50, (window.innerHeight - 500) / 2) }
          };
          setOpenWindows(prev => [...prev, newWindow]);
          setWindowStack(prev => [...prev.filter(id => id !== newId), newId]);
          setNextWindowId(prev => prev + 1);
        }}
      />

      <DesktopIcon
        name="Project03"
        icon="/glass_folder.png"
        initialPosition={{ x: 20, y: 415 }}
        onClick={() => {
          const existingWindow = openWindows.find(w => w.type === 'system_prefs');
          if (existingWindow) {
            handleCloseWindow(existingWindow.id);
          }
          const newId = nextWindowId;
          const newWindow = {
            id: newId,
            type: 'system_prefs',
            title: 'Projects',
            icon: '/system_prefs.png',
            preSelectedProjectId: 3, // Frutiger Portfolio
            position: { x: Math.max(50, (window.innerWidth - 800) / 2), y: Math.max(50, (window.innerHeight - 500) / 2) }
          };
          setOpenWindows(prev => [...prev, newWindow]);
          setWindowStack(prev => [...prev.filter(id => id !== newId), newId]);
          setNextWindowId(prev => prev + 1);
        }}
      />

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
          triggerClose={triggerCloseAll}
        />
      )}

      {showGalleryWindow && (
        <GalleryWindow
          title="Art Gallery"
          icon="/mail.png"
          onClose={handleCloseGallery}
          zIndex={getZIndex('gallery')}
          onFocus={() => bringToFront('gallery')}
          triggerClose={triggerCloseAll}
        />
      )}

      {showSpotifyWindow && (
        <SpotifyWindow
          onClose={handleCloseSpotify}
          zIndex={getZIndex('spotify')}
          onFocus={() => bringToFront('spotify')}
          triggerClose={triggerCloseAll}
        />
      )}

      {showTrashWindow && (
        <TrashWindow
          onClose={handleCloseTrash}
          zIndex={getZIndex('trash')}
          onFocus={() => bringToFront('trash')}
          triggerClose={triggerCloseAll}
        />
      )}

      <Dock onIconClick={handleIconClick} />
    </div>
  );
}

export default App;
