import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './AeroWindow.css';

export default function AeroWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 } }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        // Don't drag if clicking on buttons or inputs
        if (e.target.closest('.window-control-btn') ||
            e.target.closest('button') ||
            e.target.closest('input')) return;

        e.stopPropagation();
        setIsDragging(true);
        const rect = dragRef.current.getBoundingClientRect();
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

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Stop propagation to prevent closing when clicking inside window
    const handleWindowClick = (e) => {
        e.stopPropagation();
    };

    return (
        <motion.div
            ref={dragRef}
            className="aero-window"
            style={{ left: position.x, top: position.y, cursor: isDragging ? 'grabbing' : 'grab' }}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
                        <button className="window-control-btn close-btn" onClick={onClose}>
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
        </motion.div>
    );
}
