import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';

export default function AeroWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const windowRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    // GSAP entrance animation
    useEffect(() => {
        const window = windowRef.current;
        if (!window) return;

        // Set initial state
        gsap.set(window, {
            opacity: 0,
            scale: 0.7,
            y: 80,
            transformOrigin: 'center bottom'
        });

        // Animate in with smooth ease
        gsap.to(window, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'back.out(1.4)'
        });
    }, []);

    // Handle close with pop-out animation
    const handleClose = () => {
        const window = windowRef.current;
        if (!window || isClosing) return;

        setIsClosing(true);

        gsap.to(window, {
            opacity: 0,
            scale: 1.05,  // Pop-out effect - slight scale up
            duration: 0.2,
            ease: 'power2.out',
            onComplete: () => {
                onClose();
            }
        });
    };

    const handleMouseDown = (e) => {
        // Don't drag if clicking on buttons or inputs
        if (e.target.closest('.window-control-btn') ||
            e.target.closest('button') ||
            e.target.closest('input')) return;

        e.stopPropagation();
        // Bring window to front when clicked
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

    // Stop propagation and bring to front when clicking inside window
    const handleWindowClick = (e) => {
        e.stopPropagation();
        if (onFocus) onFocus();
    };

    return (
        <div
            ref={windowRef}
            className="aero-window"
            style={{ left: position.x, top: position.y, cursor: isDragging ? 'grabbing' : 'grab', zIndex: zIndex }}
            onMouseDown={handleMouseDown}
            onClick={handleWindowClick}
        >
            {/* Glass Frame */}
            <div className="aero-frame">
                {/* Title Bar */}
                <div className="aero-titlebar">
                    <div className="aero-titlebar-left">
                        {icon && <img src={icon} alt="" className="aero-titlebar-icon" />}
                        <span className="aero-title">{title}</span>
                    </div>
                    <div className="aero-window-controls">
                        <button className="window-control-btn minimize-btn">
                            <span className="control-icon">─</span>
                        </button>
                        <button className="window-control-btn maximize-btn">
                            <span className="control-icon">□</span>
                        </button>
                        <button className="window-control-btn close-btn" onClick={handleClose}>
                            <span className="control-icon">✕</span>
                        </button>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="aero-navbar">
                    <div className="aero-nav-buttons">
                        <button className="nav-btn back-btn">
                            <span>◀</span>
                        </button>
                        <button className="nav-btn forward-btn" disabled>
                            <span>▶</span>
                        </button>
                    </div>
                    <div className="aero-breadcrumb">
                        <span className="breadcrumb-item">📁</span>
                        <span className="breadcrumb-separator">›</span>
                        <span className="breadcrumb-item">{title}</span>
                    </div>
                    <div className="aero-search">
                        <input type="text" placeholder={`Search ${title}`} />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="aero-toolbar">
                    <button className="toolbar-btn">Organize ▾</button>
                    <button className="toolbar-btn">New Folder</button>
                    <div className="toolbar-separator"></div>
                    <button className="toolbar-btn">Share with ▾</button>
                    <button className="toolbar-btn">Burn</button>
                </div>

                {/* Content Area */}
                <div className="aero-content">
                    {/* Sidebar */}
                    <div className="aero-sidebar">
                        <div className="sidebar-section">
                            <div className="sidebar-header">⭐ Favorites</div>
                            <div className="sidebar-item">📁 Desktop</div>
                            <div className="sidebar-item">📥 Downloads</div>
                            <div className="sidebar-item">📄 Documents</div>
                        </div>
                        <div className="sidebar-section">
                            <div className="sidebar-header">📚 Libraries</div>
                            <div className="sidebar-item">🖼️ Pictures</div>
                            <div className="sidebar-item">🎵 Music</div>
                            <div className="sidebar-item">🎬 Videos</div>
                        </div>
                        <div className="sidebar-section">
                            <div className="sidebar-header">💻 Computer</div>
                            <div className="sidebar-item">💿 Local Disk (C:)</div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="aero-main">
                        <div className="empty-folder-message">
                            This folder is empty.
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="aero-statusbar">
                    <span>0 items</span>
                </div>
            </div>
        </div>
    );
}
