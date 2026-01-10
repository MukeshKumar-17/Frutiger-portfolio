import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import './Welcome.css';

export default function Welcome() {
    const containerRef = useRef(null);
    const portfolioRef = useRef(null);
    const letterRefs = useRef([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const animationFrameId = useRef(null);
    const letterStates = useRef([]);
    const isMouseInContainer = useRef(false);

    // CONFIG
    const RADIUS = 200;
    const NORMAL_W = 400;
    const BOLD_W = 900;
    const NORMAL_SCALE = 1;
    const HOVER_SCALE = 1.08;

    const initLetterStates = useCallback(() => {
        letterStates.current = letterRefs.current.map(() => ({
            currentWeight: NORMAL_W,
            targetWeight: NORMAL_W,
            currentScale: 1,
            targetScale: 1
        }));
    }, []);

    const lerp = (a, b, t) => a + (b - a) * t;

    const updateTargets = useCallback(() => {
        const letters = letterRefs.current;
        if (!letters.length || !isMouseInContainer.current) return;

        letters.forEach((letterEl, index) => {
            if (!letterEl || !letterStates.current[index]) return;

            const rect = letterEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = mousePos.current.x - cx;
            const dy = mousePos.current.y - cy;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance >= RADIUS) {
                letterStates.current[index].targetWeight = NORMAL_W;
                letterStates.current[index].targetScale = NORMAL_SCALE;
            } else {
                const t = 1 - distance / RADIUS;
                const eased = t * t * (3 - 2 * t);
                letterStates.current[index].targetWeight = NORMAL_W + (BOLD_W - NORMAL_W) * eased;
                letterStates.current[index].targetScale = NORMAL_SCALE + (HOVER_SCALE - NORMAL_SCALE) * eased;
            }
        });
    }, []);

    const animate = useCallback(() => {
        const letters = letterRefs.current;

        letters.forEach((letterEl, index) => {
            if (!letterEl || !letterStates.current[index]) return;

            const s = letterStates.current[index];
            const factor = isMouseInContainer.current ? 0.12 : 0.08;

            s.currentWeight = lerp(s.currentWeight, s.targetWeight, factor);
            s.currentScale = lerp(s.currentScale, s.targetScale, factor);

            if (CSS.supports("font-variation-settings", "'wght' 400")) {
                letterEl.style.fontVariationSettings = `'wght' ${s.currentWeight.toFixed(2)}`;
            } else {
                letterEl.style.fontWeight = Math.round(s.currentWeight);
            }

            letterEl.style.transform = `scale(${s.currentScale.toFixed(4)})`;
        });

        animationFrameId.current = requestAnimationFrame(animate);
    }, []);

    const handleMouseMove = useCallback((e) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
        isMouseInContainer.current = true;
        updateTargets();
    }, [updateTargets]);

    const handleMouseLeave = useCallback(() => {
        isMouseInContainer.current = false;
        letterStates.current.forEach((s) => {
            s.targetWeight = NORMAL_W;
            s.targetScale = NORMAL_SCALE;
        });
    }, []);

    useEffect(() => {
        initLetterStates();
        animationFrameId.current = requestAnimationFrame(animate);

        const tl = gsap.timeline();
        tl.fromTo('.welcome-letter',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.02 }
        );

        tl.fromTo('.portfolio-letter',
            { opacity: 0, y: 50, rotationX: -90 },
            { opacity: 1, y: 0, rotationX: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.05 },
            '-=0.5'
        );

        const welcomeLetters = document.querySelectorAll('.welcome-letter');
        welcomeLetters.forEach((letter) => {
            letter.addEventListener('mouseenter', () => {
                gsap.to(letter, {
                    y: -8,
                    scale: 1.12,
                    color: '#000',
                    duration: 0.25,
                    ease: 'power2.out'
                });
            });
            letter.addEventListener('mouseleave', () => {
                gsap.to(letter, {
                    y: 0,
                    scale: 1,
                    color: '#000',
                    duration: 0.4,
                    ease: 'elastic.out(1,0.3)'
                });
            });
        });

        const onMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            gsap.to(portfolioRef.current, {
                x: (e.clientX - cx) / 50,
                y: (e.clientY - cy) / 50,
                duration: 0.5,
                ease: "power2.out"
            });

            handleMouseMove(e);
        };

        const onLeave = () => {
            gsap.to(portfolioRef.current, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1,0.3)"
            });

            handleMouseLeave();
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", onMove);
            container.addEventListener("mouseleave", onLeave);
        }

        return () => {
            if (container) {
                container.removeEventListener("mousemove", onMove);
                container.removeEventListener("mouseleave", onLeave);
            }
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [initLetterStates, animate, handleMouseMove, handleMouseLeave]);

    const portfolioText = "Portfolio.";

    const setLetterRef = (el, index) => {
        letterRefs.current[index] = el;
        if (el && !letterStates.current[index]) {
            letterStates.current[index] = {
                currentWeight: NORMAL_W,
                targetWeight: NORMAL_W,
                currentScale: 1,
                targetScale: 1
            };
        }
    };

    return (
        <div className="welcome-container" ref={containerRef}>
            <p className="welcome-line">
                {"Hey, I'm".split(" ").map((word, i, arr) => (
                    <span key={`hey-${i}`} className="welcome-letter italic-text">
                        {word}{i < arr.length - 1 ? '\u00A0' : ''}
                    </span>
                ))}
                <span className="welcome-letter">&nbsp;</span>
                {"MUKESH KUMAR!".split(" ").map((word, i, arr) => (
                    <span key={`name-${i}`} className="welcome-letter">
                        {word}{i < arr.length - 1 ? '\u00A0' : ''}
                    </span>
                ))}
                <span className="welcome-letter">&nbsp;</span>
                {"Welcome to my".split(" ").map((word, i, arr) => (
                    <span key={`welcome-${i}`} className="welcome-letter italic-text">
                        {word}{i < arr.length - 1 ? '\u00A0' : ''}
                    </span>
                ))}
            </p>

            <h1 className="portfolio-title" ref={portfolioRef}>
                {portfolioText.split("").map((letter, index) => (
                    <span
                        key={index}
                        ref={(el) => setLetterRef(el, index)}
                        className="portfolio-letter"
                    >
                        {letter}
                    </span>
                ))}
            </h1>
        </div>
    );
}
