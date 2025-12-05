import React, { useRef } from 'react';
import './Dock.css';

const icons = [
    { name: 'Finder', src: '/finder.png' },
    { name: 'Mail', src: '/mail.png' },
    { name: 'Explorer', src: '/ie.png' },
    { name: 'Sherlock', src: '/sherlock.png' },
    { name: 'System Prefs', src: '/system_prefs.png' },
    { name: 'Monitor', src: '/monitor.png' },
    { name: 'QuickTime', src: '/quicktime.png' },
    { name: 'Grab', src: '/grab.png' },
    // Separator here conceptually
    { name: 'Spring', src: '/spring.png' },
    { name: 'News', src: '/news.png' },
    { name: 'Trash', src: '/trash.png' },
];

export default function Dock() {
    const dockRef = useRef(null);

    const handleMouseMove = (e) => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll('.dock-icon');
        const dockRect = dock.getBoundingClientRect();

        // Mouse X relative to the viewport is e.clientX
        // But we want it relative to the dock's items?
        // The Fisheye effect depends on the distance of the mouse X from the center of each icon.

        icons.forEach((icon) => {
            const rect = icon.getBoundingClientRect();
            const iconCenterX = rect.left + rect.width / 2;
            const distanceFromMouse = Math.abs(e.clientX - iconCenterX);

            // Configuration for magnification
            const maxScale = 1.8;
            const minScale = 1.0;
            const range = 150; // Distance of effect influence

            let scale = minScale;

            if (distanceFromMouse < range) {
                // Calculate scale based on distance (Gaussian-ish or Cosine)
                // Using a simple cosine curve for smoothness
                const normalizedDistance = distanceFromMouse / range;
                // Cosine from 0 to Pi
                const curve = Math.cos(normalizedDistance * Math.PI / 2); // 1 at 0, 0 at 1
                scale = minScale + (maxScale - minScale) * curve;
            }

            icon.style.width = `${60 * scale}px`;
            icon.style.height = `${60 * scale}px`;
            icon.style.marginBottom = `${(scale - 1) * 30}px`; // Push up slightly?
            // Actually standard mac dock aligns bottom, so changing width/height with flex-end is enough if margin is handled
            // But we need to make sure the margin doesn't break layout.
            // Flexbox 'align-items: flex-end' handles the vertical growth upwards.
            // We just need horizontal expansion.
        });
    };

    const handleMouseLeave = () => {
        const dock = dockRef.current;
        if (!dock) return;
        const icons = dock.querySelectorAll('.dock-icon');
        icons.forEach((icon) => {
            icon.style.width = '60px';
            icon.style.height = '60px';
            icon.style.marginBottom = '0px';
        });
    };

    return (
        <div className="dock-container" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="dock-glass" ref={dockRef}>
                {icons.map((icon, index) => (
                    <React.Fragment key={icon.name}>
                        {index === 8 && <div className="dock-separator"></div>}
                        <div className="dock-icon" title={icon.name}>
                            <img src={icon.src} alt={icon.name} />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
