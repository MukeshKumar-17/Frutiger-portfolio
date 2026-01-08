import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './FlowingMenu.css';

function FlowingMenu({
    items = [],
    speed = 15 // Increased duration for slower speed
}) {
    return (
        <div className="menu-wrap">
            <nav className="menu">
                {items.map((item, idx) => (
                    <MenuItem
                        key={idx}
                        {...item}
                        speed={speed}
                    />
                ))}
            </nav>
        </div>
    );
}

function MenuItem({ link, text, image, skills = [], speed }) {
    const itemRef = useRef(null);
    const marqueeRef = useRef(null);
    const marqueeInnerRef = useRef(null);
    const animationRef = useRef(null);
    const [repetitions, setRepetitions] = useState(2);

    const animationDefaults = { duration: 0.6, ease: 'expo' };

    const findClosestEdge = (mouseX, mouseY, width, height) => {
        const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
        const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
        return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
    };

    const distMetric = (x, y, x2, y2) => {
        const xDiff = x - x2;
        const yDiff = y - y2;
        return xDiff * xDiff + yDiff * yDiff;
    };

    useEffect(() => {
        const calculateRepetitions = () => {
            if (!marqueeInnerRef.current) return;

            const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part');
            if (!marqueeContent) return;

            const contentWidth = marqueeContent.offsetWidth;
            const viewportWidth = window.innerWidth; // Or container width

            // Simple plenty repetitions to ensure seamlessness
            setRepetitions(12);
        };

        calculateRepetitions();
        window.addEventListener('resize', calculateRepetitions);
        return () => window.removeEventListener('resize', calculateRepetitions);
    }, [skills]);

    useEffect(() => {
        const setupMarquee = () => {
            if (!marqueeInnerRef.current) return;

            const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part');
            if (!marqueeContent) return;

            const contentWidth = marqueeContent.offsetWidth;
            if (contentWidth === 0) return;

            if (animationRef.current) {
                animationRef.current.kill(); // Kill previous to avoid stacking
            }

            // Reset position
            gsap.set(marqueeInnerRef.current, { x: 0 });

            // Animate
            // We want to move by the width of ONE content part to create the seamless loop effect
            animationRef.current = gsap.to(marqueeInnerRef.current, {
                x: -contentWidth,
                duration: speed,
                ease: 'none',
                repeat: -1
            });
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(setupMarquee, 100);

        return () => {
            clearTimeout(timer);
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, [skills, repetitions, speed]);

    const handleMouseEnter = ev => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const edge = findClosestEdge(x, y, rect.width, rect.height);

        gsap
            .timeline({ defaults: animationDefaults })
            .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
            .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
    };

    const handleMouseLeave = ev => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const edge = findClosestEdge(x, y, rect.width, rect.height);

        gsap
            .timeline({ defaults: animationDefaults })
            .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    };

    return (
        <div className="menu__item" ref={itemRef}>
            <a
                className="menu__item-link"
                href={link}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {text}
            </a>
            <div className="marquee" ref={marqueeRef}>
                <div className="marquee__inner-wrap">
                    <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
                        {/* Create enough duplicates for loop */}
                        {[...Array(repetitions)].map((_, idx) => (
                            <div className="marquee__part" key={idx}>
                                {/* Render skills as the marquee content */}
                                {skills.map((skill, sIdx) => (
                                    <span key={sIdx} className="marquee__part-item">{skill}</span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlowingMenu;
