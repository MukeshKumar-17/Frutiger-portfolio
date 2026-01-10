import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AeroWindow.css';

export default function BrowserWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const windowRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });
    const url = "Coding Profiles";

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

    // Stop propagation and bring to front when clicking inside window
    const handleWindowClick = (e) => {
        e.stopPropagation();
        if (onFocus) onFocus();
    };

    const openInNewTab = () => {
        window.open('https://codolio.com/profile/Mukesh_Kumar', '_blank');
    };

    return (
        <div
            ref={windowRef}
            className="aero-window"
            style={{
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                width: '600px',
                height: '400px',
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

                {/* Navigation Bar (Address Bar style) */}
                <div className="aero-navbar">
                    <div className="aero-nav-buttons">
                        <button className="nav-btn back-btn" disabled>
                            <span>◀</span>
                        </button>
                        <button className="nav-btn forward-btn" disabled>
                            <span>▶</span>
                        </button>
                    </div>

                    {/* Address Bar */}
                    <div className="aero-search" style={{ width: '100%', maxWidth: 'none', margin: '0 10px' }}>
                        <input
                            type="text"
                            value={url}
                            readOnly
                            style={{
                                width: '100%',
                                paddingLeft: '25px',
                                fontFamily: 'align',
                                color: '#333'
                            }}
                        />
                        <span className="search-icon" style={{ left: '8px', right: 'auto' }}>🔒</span>
                    </div>

                    {/* Open in New Tab Button */}
                    <button
                        className="nav-btn"
                        onClick={openInNewTab}
                        title="Open in new tab"
                        style={{ width: '32px' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </button>
                </div>

                {/* Content Area - Iframe */}
                {/* Content Area - Mini Start Page */}
                <div className="aero-content" style={{ padding: 0, background: '#f0f4f8' }}>
                    <div className="aero-main" style={{
                        padding: '40px',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #e0e7ef 0%, #f9fcff 100%)'
                    }}>

                        <h2 style={{
                            fontSize: '50px',
                            color: '#3d5d88',
                            marginBottom: '40px',
                            fontFamily: "'Apple Garamond', serif",
                            textShadow: '0 1px 0 rgba(255,255,255,0.8)',
                            fontWeight: '600'
                        }}>Coding Profiles</h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '40px',
                            width: '90%',
                            maxWidth: '800px'
                        }}>
                            {[
                                { name: 'LeetCode', icon: '/icon_leetcode_metal.png', url: 'https://leetcode.com/u/MUKESH_KUMAR_K' },
                                { name: 'CodeChef', icon: '/icon_codechef_metal.png', url: 'https://www.codechef.com/users/kit23bam032' },
                                { name: 'Codeforces', icon: '/icon_codeforces_metal.png', url: 'https://codeforces.com/profile/MUKESH_KUMAR_K' },
                                { name: 'Codolio', icon: '/icon_codolio_metal.png', url: 'https://codolio.com/profile/Mukesh_Kumar' }
                            ].map((profile) => (
                                <a
                                    key={profile.name}
                                    href={profile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="profile-icon-wrapper"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.querySelector('img').style.transform = 'scale(1.15) translateY(-5px)';
                                        e.currentTarget.querySelector('span').style.color = '#2a4a7a';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.querySelector('img').style.transform = 'scale(1) translateY(0)';
                                        e.currentTarget.querySelector('span').style.color = '#555';
                                    }}
                                >
                                    <div style={{
                                        width: '80px', /* Reduced from 120px */
                                        height: '80px', /* Reduced from 120px */
                                        marginBottom: '10px',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img
                                            src={profile.icon}
                                            alt={profile.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                borderRadius: '24px', // Squircle shape for 80px size (approx 30%)
                                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))'
                                            }}
                                        />
                                    </div>
                                    <span style={{
                                        fontSize: '14px', /* Slightly smaller text */
                                        color: '#555',
                                        fontWeight: '600',
                                        transition: 'color 0.2s ease',
                                        textShadow: '0 1px 0 rgba(255,255,255,0.8)'
                                    }}>
                                        {profile.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="aero-statusbar">
                    <span>Ready</span>
                </div>
            </div>
        </div>
    );
}
