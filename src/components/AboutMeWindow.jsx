import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';

export default function AboutMeWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus, triggerClose }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const windowRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    // GSAP entrance animation
    useEffect(() => {
        const window = windowRef.current;
        if (!window) return;

        // Set initial state - use minimal transforms for smooth animation
        gsap.set(window, {
            opacity: 0,
            scale: 0.92,
            y: 25,
            transformOrigin: 'center center',
            force3D: true,
            willChange: 'transform, opacity'
        });

        // Animate in with buttery smooth easing
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

    // Handle close with pop-out animation
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
                width: '500px', // Slightly smaller width for profile
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
                        overflowY: 'auto',
                        position: 'relative'
                    }}>
                        {/* Profile Photo with Aero Gloss Border */}
                        <div style={{
                            position: 'absolute',
                            top: '30px',
                            right: '30px',
                            width: '150px',
                            height: '180px',
                            padding: '6px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.0) 51%, rgba(255,255,255,0.1) 100%)',
                            boxShadow: `
                                inset 0 0 0 1px rgba(255,255,255,0.6),
                                inset 0 1px 0 rgba(255,255,255,0.9),
                                0 5px 15px rgba(0,0,0,0.3),
                                0 0 0 1px rgba(0,0,0,0.1)
                            `,
                            backdropFilter: 'blur(5px)',
                            WebkitBackdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src="/mukesh.photo.jpg"
                                alt="Mukesh Kumar K"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(0,0,0,0.2)'
                                }}
                            />
                            {/* Gloss Shine Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '40%',
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)',
                                borderRadius: '7px 7px 40% 40% / 7px 7px 10px 10px',
                                pointerEvents: 'none'
                            }}></div>
                        </div>

                        <h2 style={{
                            fontSize: '50px',
                            marginBottom: '15px',
                            color: '#2a4a7a',
                            fontWeight: '600',
                            maxWidth: '65%',
                            fontFamily: "'Apple Garamond', serif"
                        }}>About Me</h2>

                        <div style={{ fontSize: '14px', maxWidth: '65%' }}>
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
