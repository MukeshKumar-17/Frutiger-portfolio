import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';
import FlowingMenu from './FlowingMenu';

const items = [
    {
        text: 'Frontend',
        link: '#',
        image: '',
        skills: ['React', 'Vue', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Framer Motion']
    },
    {
        text: 'Backend',
        link: '#',
        image: '',
        skills: ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'REST APIs', 'GraphQL', 'WebSockets']
    },
    {
        text: 'Languages',
        link: '#',
        image: '',
        skills: ['JavaScript', 'Python', 'C++', 'Java', 'SQL', 'HTML', 'CSS', 'Bash']
    },
    {
        text: 'Database',
        link: '#',
        image: '',
        skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Prisma']
    }
];

export default function SkillsWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus }) {
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
            style={{
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                width: '900px',
                minHeight: '350px',
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

                {/* Content Area */}
                <div className="aero-content" style={{ flexDirection: 'column', padding: '0', overflow: 'hidden' }}>

                    {/* Main Content */}
                    <div className="aero-main" style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                        padding: '0',
                        lineHeight: '1.6',
                        color: '#333',
                        overflowY: 'hidden',
                        position: 'relative',
                        height: '100%'
                    }}>
                        {/* Title Section */}
                        <div style={{ padding: '20px 30px 10px 30px' }}>
                            <h2 style={{
                                fontSize: '50px',
                                margin: '0',
                                color: '#2a4a7a',
                                fontWeight: '600',
                                fontFamily: "'Apple Garamond', serif"
                            }}>Skills</h2>
                        </div>

                        {/* Menu Section */}
                        <div style={{ flex: 1, width: '100%', position: 'relative' }}>
                            <FlowingMenu items={items} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
