import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';

export default function AboutMeWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 } }) {
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

    // Handle close with animation
    const handleClose = () => {
        const window = windowRef.current;
        if (!window || isClosing) return;

        setIsClosing(true);

        gsap.to(window, {
            opacity: 0,
            scale: 0.8,
            y: 50,
            duration: 0.25,
            ease: 'power2.in',
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

    // Stop propagation to prevent closing when clicking inside window
    const handleWindowClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            ref={windowRef}
            className="aero-window"
            style={{
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                width: '600px', // Slightly smaller width for profile
                minHeight: '350px'
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

                {/* Content Area - No Toolbar/Sidebar, just Main Content */}
                <div className="aero-content" style={{ flexDirection: 'column', padding: '0' }}>

                    {/* Main Content */}
                    <div className="aero-main" style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        padding: '30px',
                        lineHeight: '1.6',
                        color: '#333',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '15px',
                            color: '#2a4a7a',
                            fontWeight: '600'
                        }}>About Me</h2>

                        <div style={{ fontSize: '14px' }}>
                            <p style={{ marginBottom: '15px' }}>
                                Hi, I’m <strong>Mukesh Kumar K</strong>, a Computer Science student specializing in Artificial Intelligence & Machine Learning. I enjoy building clean, functional interfaces and turning ideas into practical digital experiences.
                            </p>

                            <p style={{ marginBottom: '15px' }}>
                                I’m currently focused on frontend development using modern web technologies, while continuously exploring system design, product thinking, and scalable applications. I believe good software is not just about code, but about clarity, usability, and impact.
                            </p>

                            <p>
                                I’m always eager to learn, collaborate, and build products that solve real-world problems.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
