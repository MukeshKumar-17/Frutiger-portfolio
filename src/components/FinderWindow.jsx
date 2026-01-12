import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';
import './FinderSidebar.css';

export default function FinderWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus, triggerClose, onOpenResume, onOpenGallery, onOpenAboutMe, onOpenProject }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const windowRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    // GSAP entrance animation
    useEffect(() => {
        const window = windowRef.current;
        if (!window) return;

        gsap.set(window, {
            opacity: 0,
            scale: 0.92,
            y: 25,
            transformOrigin: 'center center',
            force3D: true,
            willChange: 'transform, opacity'
        });

        gsap.to(window, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.25,
            ease: 'power1.out',
            force3D: true,
            clearProps: 'willChange'
        });
    }, []);

    // Handle external close trigger
    useEffect(() => {
        if (triggerClose && !isClosing) {
            handleClose();
        }
    }, [triggerClose]);

    const handleClose = () => {
        const window = windowRef.current;
        if (!window || isClosing) return;

        setIsClosing(true);

        gsap.to(window, {
            opacity: 0,
            scale: 0.95,
            y: 15,
            duration: 0.18,
            ease: 'power1.in',
            force3D: true,
            onComplete: () => {
                onClose();
            }
        });
    };

    const handleMouseDown = (e) => {
        if (e.target.closest('.window-control-btn') ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('.aero-main') ||
            e.target.closest('.sidebar-item')) return;

        e.stopPropagation();
        if (onFocus) onFocus();

        setIsDragging(true);
        const rect = windowRef.current.getBoundingClientRect();
        offsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - offsetRef.current.x,
            y: e.clientY - offsetRef.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleWindowClick = (e) => {
        e.stopPropagation();
        if (onFocus) onFocus();
    };

    // Sidebar state
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSidebarClick = (index, action) => {
        setActiveIndex(index);
        if (action) action();
    };

    // Projects data
    const projects = [
        { id: 1, name: 'WHOP Clone', icon: '/glass_folder.png', url: 'https://github.com/MukeshKumar-17/WHOP' },
        { id: 2, name: 'MeetMogger AI', icon: '/glass_folder.png', url: 'https://github.com/MukeshKumar-17/MeetMogger-AI' },
        { id: 3, name: 'Frutiger Portfolio', icon: '/glass_folder.png', url: 'https://github.com/MukeshKumar-17/Frutiger-portfolio' },
    ];

    return (
        <div
            ref={windowRef}
            className="aero-window"
            style={{ left: position.x, top: position.y, cursor: isDragging ? 'grabbing' : 'grab', zIndex: zIndex, width: '680px', height: '420px' }}
            onMouseDown={handleMouseDown}
            onClick={handleWindowClick}
        >
            <div className="aero-frame">
                {/* Title Bar */}
                <div className="aero-titlebar">
                    <div className="aero-window-controls">
                        <button className="window-control-btn minimize-btn" onClick={handleClose}>
                            <span className="control-icon">─</span>
                        </button>
                        <button className="window-control-btn maximize-btn" onClick={handleClose}>
                            <span className="control-icon">□</span>
                        </button>
                        <button className="window-control-btn close-btn" onClick={handleClose}>
                            <span className="control-icon">✕</span>
                        </button>
                    </div>
                    <div className="window-title-central">{title || 'Finder'}</div>
                </div>

                {/* Navigation Bar */}
                <div className="aero-navbar">
                    <div className="aero-nav-buttons">
                        <button className="nav-btn back-btn"><span>◀</span></button>
                        <button className="nav-btn forward-btn"><span>▶</span></button>
                    </div>
                    <div className="aero-breadcrumb">
                        <span className="breadcrumb-item">{title || 'Finder'}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="aero-content">


                    {/* Sidebar */}
                    <div className="finder-sidebar">
                        <div className="sidebar-section" style={{ position: 'relative' }}>
                            <div className="sidebar-header">Favorites</div>

                            {/* Selection Highlight Button */}
                            <div
                                className="sidebar-selection-highlight"
                                style={{
                                    position: 'absolute',
                                    // CSS Metrics from FinderSidebar.css:
                                    // Padding Top: 12px
                                    // Header Height: 18px
                                    // Header Margin Bottom: 6px
                                    // First Item Margin Top: 2px
                                    // Base Start = 12 + 18 + 6 + 2 = 38px

                                    // Item Height: 26px
                                    // Item Margin Top: 2px
                                    // Item Margin Bottom: 2px
                                    // Stride = 26 + 2 + 2 = 30px
                                    // Correct Base for Highlight INSIDE Section: 18(H) + 6(MB) + 2(MT) = 26px
                                    top: `${26 + (activeIndex * 30)}px`,
                                    left: '5px',
                                    right: '5px',
                                    height: '28px',
                                    borderRadius: '1000px',
                                    background: 'linear-gradient(rgba(50, 130, 220, 0.8), rgba(30, 100, 200, 0.85), rgba(20, 80, 180, 0.8))',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25), 0 1px 1px rgba(30, 80, 150, 0.5), inset 0 2px 4px rgba(0, 30, 80, 0.4), inset 0 3px 5px 2px rgba(50, 120, 200, 0.5)',
                                    zIndex: 0,
                                    pointerEvents: 'none'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '6%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 'calc(100% - 12px)',
                                    height: '40%',
                                    background: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1))',
                                    borderRadius: '100px 100px 50px 50px',
                                    filter: 'blur(0.5px)'
                                }}></div>
                            </div>

                            <div
                                className={`sidebar-item ${activeIndex === 0 ? 'active' : ''}`}
                                onClick={() => handleSidebarClick(0)}
                            >
                                Projects
                            </div>
                            <div
                                className={`sidebar-item ${activeIndex === 1 ? 'active' : ''}`}
                                onClick={() => handleSidebarClick(1, () => onOpenResume && onOpenResume())}
                            >
                                Resume
                            </div>
                            <div
                                className={`sidebar-item ${activeIndex === 2 ? 'active' : ''}`}
                                onClick={() => handleSidebarClick(2, () => onOpenGallery && onOpenGallery())}
                            >
                                Photos
                            </div>
                            <div
                                className={`sidebar-item ${activeIndex === 3 ? 'active' : ''}`}
                                onClick={() => handleSidebarClick(3, () => onOpenAboutMe && onOpenAboutMe())}
                            >
                                About Me
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="aero-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gridAutoRows: 'min-content', padding: '20px', gap: '25px', alignContent: 'start' }}>

                        {projects.map(project => (
                            <div
                                key={project.id}
                                className="folder-item"
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                onClick={() => onOpenProject && onOpenProject(project.id)}
                            >
                                <img src={project.icon} alt={project.name} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                                <span style={{ fontSize: '12px', color: '#333', textAlign: 'center' }}>{project.name}</span>
                            </div>
                        ))}

                    </div>
                </div>

                {/* Status Bar */}
                <div className="aero-statusbar">
                    <span>{projects.length} items</span>
                </div>
            </div>
        </div>
    );
}
