import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import './Dock.css';

const icons = [
    { id: 'finder', name: 'Finder', src: '/finder.png', tooltip: 'About Me' },
    { id: 'mail', name: 'Mail', src: '/mail.png' },
    { id: 'explorer', name: 'Explorer', src: '/ie.png' },
    { id: 'sherlock', name: 'Sherlock', src: '/sherlock.png', tooltip: 'Skills' },
    { id: 'system_prefs', name: 'System Prefs', src: '/system_prefs.png' },
    { id: 'monitor', name: 'Monitor', src: '/monitor.png' },
    { id: 'quicktime', name: 'QuickTime', src: '/quicktime.png' },
    { id: 'grab', name: 'Grab', src: '/grab.png' },
    // Separator here conceptually
    { id: 'spring', name: 'Spring', src: '/spring.png' },
    { id: 'news', name: 'News', src: '/news.png' },
    { id: 'trash', name: 'Trash', src: '/trash.png' },
];

// Spring configuration for smooth, natural feel
const springConfig = {
    stiffness: 400,
    damping: 25,
    mass: 0.5,
};

function DockIcon({ icon, mouseX, onClick }) {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (icon.id === 'finder' || icon.id === 'sherlock') {
            setCursorPos({ x: e.clientX, y: e.clientY });
        }
    };

    // Calculate distance from mouse to icon center
    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Configuration
    const baseSize = 60;
    const maxSize = 100;
    const magnificationRange = 180;

    // Map distance to scale using smooth interpolation
    const widthSync = useTransform(
        distance,
        [-magnificationRange, 0, magnificationRange],
        [baseSize, maxSize, baseSize]
    );

    // Apply spring physics for ultra-smooth animation
    const width = useSpring(widthSync, springConfig);
    const height = useSpring(widthSync, springConfig);

    // Subtle Y translation for the "rise" effect
    const ySync = useTransform(
        distance,
        [-magnificationRange, 0, magnificationRange],
        [0, -15, 0]
    );
    const y = useSpring(ySync, springConfig);

    const renderTooltip = () => {
        if (icon.id === 'finder' || icon.id === 'sherlock') {
            if (!isHovered) return null;
            return createPortal(
                <div
                    className="aero-tooltip finder-tooltip"
                    style={{
                        position: 'fixed',
                        left: cursorPos.x + 15, // Offset to right
                        top: cursorPos.y - 15,  // Slightly centered vertically related to cursor
                        transform: 'none',
                        bottom: 'auto',
                        zIndex: 9999,
                        pointerEvents: 'none' // Critical so it doesn't steal mouse events
                    }}
                >
                    <span className="aero-tooltip-text">{icon.tooltip}</span>
                </div>,
                document.body
            );
        }

        // Standard tooltip for other icons
        return (
            <AnimatePresence>
                {isHovered && icon.tooltip && (
                    <motion.div
                        className="aero-tooltip"
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        <span className="aero-tooltip-text">{icon.tooltip}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    return (
        <motion.div
            ref={ref}
            className="dock-icon"
            style={{
                width,
                height,
                y,
            }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={() => onClick(icon)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            <img src={icon.src} alt={icon.name} draggable={false} />

            {/* Render appropriate tooltip */}
            {renderTooltip()}
        </motion.div>
    );
}


export default function Dock({ onIconClick }) {
    // Track mouse X position
    const mouseX = useMotionValue(Infinity);

    const handleIconClick = (icon) => {
        if (onIconClick) {
            onIconClick(icon);
        }
    };

    return (
        <motion.div
            className="dock-container"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            <motion.div className="dock-glass">
                {icons.map((icon, index) => (
                    <React.Fragment key={icon.id}>
                        {index === 8 && <div className="dock-separator"></div>}
                        <DockIcon
                            icon={icon}
                            mouseX={mouseX}
                            onClick={handleIconClick}
                        />
                    </React.Fragment>
                ))}
            </motion.div>
        </motion.div>
    );
}
