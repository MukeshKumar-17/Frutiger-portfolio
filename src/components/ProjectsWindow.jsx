import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';
import './ProjectsWindow.css';
import './ProjectsSidebar.css'; // Separate alignment CSS

// Project Data with descriptions
const projectsData = [
    {
        id: 1,
        name: 'WHOP Clone',
        folder: 'Project 01',
        github: 'https://github.com/MukeshKumar-17/WHOP',
        description: 'A full-stack digital marketplace clone built with the MERN stack, Tailwind CSS, and Stripe integration. Features include user authentication, product listing, checkout flow, and creator dashboard.'
    },
    {
        id: 2,
        name: 'MeetMogger AI',
        folder: 'Project 02',
        github: 'https://github.com/MukeshKumar-17/MeetMogger-AI',
        description: 'An AI-powered meeting assistant that helps transcribe, summarize, and analyze meeting content. Built with modern AI APIs and a sleek user interface.'
    },
    {
        id: 3,
        name: 'Frutiger Portfolio',
        folder: 'Project 03',
        github: 'https://github.com/MukeshKumar-17/Frutiger-portfolio',
        description: 'A Frutiger Aero design inspired portfolio website featuring Mac OS X Aqua aesthetics, glassmorphism effects, and interactive UI components built with React and GSAP.'
    }
];

export default function ProjectsWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus, onOpenAboutMe, onOpenResume, triggerClose, preSelectedProjectId = null }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Initialize selectedProject from preSelectedProjectId if provided
    const [selectedProject, setSelectedProject] = useState(() => {
        if (preSelectedProjectId) {
            return projectsData.find(p => p.id === preSelectedProjectId) || null;
        }
        return null;
    });

    // Track active sidebar index
    // 0: Work, 1: About Me, 2: Resume, 3: GitHub, 4+: Projects
    const [activeIndex, setActiveIndex] = useState(() => {
        if (preSelectedProjectId) {
            const idx = projectsData.findIndex(p => p.id === preSelectedProjectId);
            return idx !== -1 ? 4 + idx : 0;
        }
        return 0;
    });

    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationProject, setExplanationProject] = useState(null);

    // Explanation window drag state
    const [explanationPosition, setExplanationPosition] = useState({ x: 0, y: 0 });
    const [isExplanationDragging, setIsExplanationDragging] = useState(false);
    const explanationWindowRef = useRef(null);
    const explanationOffsetRef = useRef({ x: 0, y: 0 });

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
            e.target.closest('.projects-window-content')) return;

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

    const handleSidebarClick = (index, action) => {
        setActiveIndex(index);
        if (action) action();
    };

    const handleProjectSelect = (project, index) => {
        setSelectedProject(project);
        setActiveIndex(index);
        setShowExplanation(false);
    };

    const handleOpenGitHub = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleOpenExplanation = (project) => {
        setExplanationProject(project);
        // Set initial position for explanation window
        setExplanationPosition({ x: position.x + 420, y: position.y + 50 });
        setShowExplanation(true);
    };

    const handleCloseExplanation = () => {
        setShowExplanation(false);
        setExplanationProject(null);
    };

    // Explanation window drag handlers
    const handleExplanationMouseDown = (e) => {
        if (e.target.closest('.window-control-btn')) return;
        e.stopPropagation();
        setIsExplanationDragging(true);
        const rect = explanationWindowRef.current.getBoundingClientRect();
        explanationOffsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleExplanationMouseMove = (e) => {
        if (!isExplanationDragging) return;
        setExplanationPosition({
            x: e.clientX - explanationOffsetRef.current.x,
            y: e.clientY - explanationOffsetRef.current.y
        });
    };

    const handleExplanationMouseUp = () => {
        setIsExplanationDragging(false);
    };

    useEffect(() => {
        if (isExplanationDragging) {
            window.addEventListener('mousemove', handleExplanationMouseMove);
            window.addEventListener('mouseup', handleExplanationMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleExplanationMouseMove);
            window.removeEventListener('mouseup', handleExplanationMouseUp);
        };
    }, [isExplanationDragging]);

    return (
        <>
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
                        <span className="aero-title">Projects</span>
                    </div>

                    {/* Navigation Bar */}
                    <div className="aero-navbar">
                        <div className="aero-nav-buttons">
                            <button className="nav-btn back-btn"><span>◀</span></button>
                            <button className="nav-btn forward-btn"><span>▶</span></button>
                        </div>
                        {/* Address Bar style from Finder/Browser */}
                        <div className="aero-breadcrumb" style={{ flex: 1, margin: '0 10px', height: '26px', padding: '0' }}>
                            <input
                                type="text"
                                value={selectedProject ? selectedProject.name : 'Projects'}
                                readOnly
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    padding: '0 10px',
                                    fontSize: '12px',
                                    color: '#333',
                                    outline: 'none',
                                    fontFamily: "'Lucida Grande', 'Lucida Sans Unicode', 'Helvetica Neue', sans-serif"
                                }}
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="aero-content" style={{ padding: 0 }}>
                        <div className="projects-window-content">
                            {/* Sidebar */}
                            <div className="projects-sidebar" style={{ position: 'relative' }}>
                                {/* Selection Highlight Button */}
                                <div
                                    className="sidebar-selection-highlight"
                                    style={{
                                        position: 'absolute',
                                        // Base: 38px (padding + header + margins), Stride: 30px per item
                                        top: `${38 + (activeIndex * 30)}px`,
                                        left: '8px',
                                        right: '8px',
                                        height: '26px',
                                        borderRadius: '1000px',
                                        background: 'linear-gradient(rgba(50, 130, 220, 0.8), rgba(30, 100, 200, 0.85), rgba(20, 80, 180, 0.8))',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25), 0 1px 1px rgba(30, 80, 150, 0.5), inset 0 2px 4px rgba(0, 30, 80, 0.4), inset 0 3px 5px 2px rgba(50, 120, 200, 0.5)',
                                        zIndex: 0,
                                        pointerEvents: 'none',
                                        // Only show highlight if we have a valid index (0-2 for projects)
                                        display: activeIndex >= 0 && activeIndex < projectsData.length ? 'block' : 'none'
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

                                <div className="sidebar-section">
                                    <div className="sidebar-header">Favorites</div>
                                    {projectsData.map((project, idx) => (
                                        <div
                                            key={project.id}
                                            className={`sidebar-item ${activeIndex === idx ? 'active' : ''}`}
                                            onClick={() => handleProjectSelect(project, idx)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {project.folder}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="projects-main-area">
                                <div className="projects-header">
                                    <div className="projects-title">
                                        {selectedProject ? selectedProject.name : 'Projects'}
                                    </div>
                                </div>

                                <div className="projects-grid">
                                    {!selectedProject ? (
                                        // Show all project folders when no project selected
                                        projectsData.map((project, idx) => (
                                            <div
                                                key={project.id}
                                                className="project-item"
                                                onClick={() => handleProjectSelect(project, 4 + idx)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img src="/glass_folder.png" alt={project.name} className="project-folder-icon" />
                                                <div className="project-name">{project.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        // Show GitHub and Explanation icons when project is selected
                                        <>
                                            <div
                                                className="project-item"
                                                onClick={() => handleOpenGitHub(selectedProject.github)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img src="/monitor.png" alt="GitHub" className="project-folder-icon" />
                                                <div className="project-name">GitHub</div>
                                            </div>
                                            <div
                                                className="project-item"
                                                onClick={() => handleOpenExplanation(selectedProject)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img src="/doct.png" alt="Explanation" className="project-folder-icon" />
                                                <div className="project-name">About Project</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="aero-statusbar">
                        <span>{selectedProject ? '2 items' : '3 items'}</span>
                    </div>
                </div>
            </div>

            {/* Explanation Window */}
            {showExplanation && explanationProject && (
                <div
                    ref={explanationWindowRef}
                    className="aero-window"
                    style={{
                        left: explanationPosition.x,
                        top: explanationPosition.y,
                        width: '400px',
                        height: '300px',
                        zIndex: zIndex + 1,
                        position: 'fixed',
                        cursor: isExplanationDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={handleExplanationMouseDown}
                >
                    <div className="aero-frame">
                        <div className="aero-titlebar">
                            <div className="aero-window-controls">
                                <button className="window-control-btn close-btn" onClick={handleCloseExplanation}>
                                    <span className="control-icon">✕</span>
                                </button>
                            </div>
                            <span className="aero-title">{explanationProject.name}</span>
                        </div>
                        <div className="aero-content" style={{ padding: '20px', flexDirection: 'column' }}>
                            <h3 style={{
                                margin: '0 0 15px 0',
                                color: '#2a4a7a',
                                fontFamily: "'Apple Garamond', serif",
                                fontSize: '24px'
                            }}>
                                {explanationProject.name}
                            </h3>
                            <p style={{
                                margin: 0,
                                color: '#444',
                                lineHeight: '1.6',
                                fontSize: '14px'
                            }}>
                                {explanationProject.description}
                            </p>
                            <a
                                href={explanationProject.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    marginTop: '20px',
                                    color: '#0066cc',
                                    textDecoration: 'none',
                                    fontSize: '13px'
                                }}
                            >
                                View on GitHub →
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
