import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';

export default function ResumeWindow({ title, icon, onClose, initialPosition = { x: 100, y: 50 }, zIndex = 100, onFocus }) {
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
            e.target.closest('input') ||
            e.target.tagName === 'IFRAME') return;

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

    const handleOpenNewTab = () => {
        window.open('/MukeshResume.pdf', '_blank');
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
                height: '80vh',
                minHeight: '500px',
                zIndex: zIndex
            }}
            onMouseDown={handleMouseDown}
            onClick={handleWindowClick}
        >
            {/* Glass Frame */}
            <div className="aero-frame" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Title Bar */}
                <div className="aero-titlebar">
                    <div className="aero-titlebar-left">
                        {icon && <img src={icon} alt="" className="aero-titlebar-icon" />}
                    </div>
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

                {/* Content Area */}
                <div className="aero-content" style={{ padding: 0, overflow: 'hidden', position: 'relative', flex: 1, display: 'flex' }}>

                    {/* View in New Tab Button Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '25px',
                        zIndex: 10
                    }}>
                        <button
                            onClick={handleOpenNewTab}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid rgba(0, 0, 0, 0.2)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#333',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                backdropFilter: 'blur(5px)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.95)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.8)'}
                        >
                            <span style={{ fontSize: '14px' }}>↗</span> Open in New Tab
                        </button>
                    </div>

                    <iframe
                        src="/MukeshResume.pdf"
                        title="Resume PDF"
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            background: 'white'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
