import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';
import './ProjectsWindow.css';

export default function ProjectsWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus }) {
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

        // Animate in with smooth ease-in-out
        gsap.to(window, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.inOut'
        });
    }, []);

    // Handle close with pop-out animation
    const handleClose = () => {
        const window = windowRef.current;
        if (!window || isClosing) return;

        setIsClosing(true);

        gsap.to(window, {
            opacity: 0,
            scale: 0.85,
            y: 30,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                onClose();
            }
        });
    };

    const handleMouseDown = (e) => {
        // Don't drag if clicking on buttons, inputs, or inside the content area mostly
        // But dragging usually works on titlebar or empty space.
        // For AeroWindow, usually just titlebar is draggable, but here we can make the whole window draggable 
        // if clicked on non-interactive parts, BUT standard OS windows drag by titlebar.
        // The implementation in other files seems to drag by titlebar if checking closest('.aero-window') 
        // but here let's stick to standard behavior or replicate other windows.
        // Replicating other window logic:
        if (e.target.closest('.window-control-btn') ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('.projects-window-content')) return;

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

    const handleWindowClick = (e) => {
        e.stopPropagation();
        if (onFocus) onFocus();
    };

    // Project Data
    const projects = [
        { id: 1, name: 'DeskJockey', icon: '/glass_folder.png' },
        { id: 2, name: 'AI Calorie Tracker', icon: '/glass_folder.png' },
    ];

    return (
        <div
            ref={windowRef}
            className="aero-window"
            style={{
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                width: '800px',
                height: '500px',
                zIndex: zIndex
            }}
            onMouseDown={handleMouseDown}
            onClick={handleWindowClick}
        >
            {/* Glass Frame */}
            <div className="aero-frame">
                {/* Title Bar */}
                <div className="aero-titlebar">
                    <div className="aero-titlebar-left">
                        {icon && <img src={icon} alt="" className="aero-titlebar-icon" />}
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

                {/* Content Area */}
                <div className="aero-content" style={{ padding: 0 }}>
                    <div className="projects-window-content">
                        {/* Sidebar */}
                        <div className="projects-sidebar">
                            <div className="sidebar-section">

                                <div className="sidebar-item active">
                                    <div className="sidebar-icon" style={{ background: '#888' }}></div>
                                    Work
                                </div>
                                <div className="sidebar-item">
                                    <div className="sidebar-icon"></div>
                                    About Me
                                </div>
                                <div className="sidebar-item">
                                    <div className="sidebar-icon"></div>
                                    Resume
                                </div>
                                <div className="sidebar-item">
                                    <div className="sidebar-icon"></div>
                                    Trash
                                </div>
                            </div>

                            <div className="sidebar-section">

                                <div className="sidebar-item">
                                    <div className="sidebar-icon"></div>
                                    Project 01
                                </div>
                                <div className="sidebar-item">
                                    <div className="sidebar-icon"></div>
                                    Project 02
                                </div>
                                <div className="sidebar-item">
                                    <div className="sidebar-icon"></div>
                                    Project 03
                                </div>
                                <div className="sidebar-item">
                                    <div className="sidebar-icon"></div>
                                    Project 04
                                </div>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="projects-main-area">
                            <div className="projects-header">
                                <div className="projects-title">Work</div>
                                <div className="projects-subtitle">Recent Projects</div>
                            </div>

                            <div className="projects-grid">
                                {projects.map(project => (
                                    <div key={project.id} className="project-item">
                                        <img src={project.icon} alt={project.name} className="project-folder-icon" />
                                        <div className="project-name">{project.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="aero-statusbar">
                    <span>4 items</span>
                </div>
            </div>
        </div>
    );
}
