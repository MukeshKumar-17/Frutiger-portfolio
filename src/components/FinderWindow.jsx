import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';

export default function FinderWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus, triggerClose, onOpenResume, onOpenGallery }) {
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

    // Projects data (same as ProjectsWindow)
    const projects = [
        { id: 1, name: 'DeskJockey', icon: '/glass_folder.png' },
        { id: 2, name: 'AI Calorie Tracker', icon: '/glass_folder.png' },
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
                        <button className="nav-btn forward-btn" disabled><span>▶</span></button>
                    </div>
                    <div className="aero-breadcrumb">
                        <span className="breadcrumb-item">{title || 'Finder'}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="aero-content">
                    {/* Sidebar */}
                    <div className="aero-sidebar">
                        <div className="sidebar-section">
                            <div className="sidebar-header">Favorites</div>
                            <div className="sidebar-item active">📁 Projects</div>
                            <div
                                className="sidebar-item"
                                style={{ cursor: 'pointer' }}
                                onClick={() => onOpenResume && onOpenResume()}
                            >
                                📄 Resume
                            </div>
                            <div
                                className="sidebar-item"
                                style={{ cursor: 'pointer' }}
                                onClick={() => onOpenGallery && onOpenGallery()}
                            >
                                🖼️ Photos
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
