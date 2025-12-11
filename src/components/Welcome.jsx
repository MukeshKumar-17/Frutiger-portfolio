import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import './Welcome.css';

export default function Welcome() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const portfolioRef = useRef(null);
    const letterRefs = useRef([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const animationFrameId = useRef(null);
    const letterStates = useRef([]);
    const isMouseInContainer = useRef(false);

    // Initialize letter states for smooth lerping
    const initLetterStates = useCallback(() => {
        letterStates.current = letterRefs.current.map(() => ({
            currentWeight: 400,
            targetWeight: 400,
            currentScale: 1,
            targetScale: 1
        }));
    }, []);

    // Lerp function for smooth interpolation
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // Calculate target values based on mouse position
    const updateTargets = useCallback(() => {
        const letters = letterRefs.current;
        if (!letters.length || !isMouseInContainer.current) return;

        letters.forEach((letterEl, index) => {
            if (!letterEl || !letterStates.current[index]) return;

            const rect = letterEl.getBoundingClientRect();
            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;

            // Calculate distance from cursor to letter center
            const dx = mousePos.current.x - letterCenterX;
            const dy = mousePos.current.y - letterCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Effect parameters - wider radius for smoother falloff
            const maxDistance = 200;
            const normalWeight = 400;
            const boldWeight = 900;
            const normalScale = 1;
            const hoverScale = 1.08;

            if (distance >= maxDistance) {
                letterStates.current[index].targetWeight = normalWeight;
                letterStates.current[index].targetScale = normalScale;
            } else {
                // Smooth cubic easing for more natural feel
                const t = 1 - (distance / maxDistance);
                const easedT = t * t * t * (t * (t * 6 - 15) + 10); // Smootherstep easing

                letterStates.current[index].targetWeight = normalWeight + (boldWeight - normalWeight) * easedT;
                letterStates.current[index].targetScale = normalScale + (hoverScale - normalScale) * easedT;
            }
        });
    }, []);

    // Animation loop using requestAnimationFrame
    const animate = useCallback(() => {
        const letters = letterRefs.current;

        letters.forEach((letterEl, index) => {
            if (!letterEl || !letterStates.current[index]) return;

            const state = letterStates.current[index];

            // Lerp factor - lower = smoother but slower, higher = snappier
            const lerpFactor = isMouseInContainer.current ? 0.12 : 0.08;

            // Smoothly interpolate current values toward targets
            state.currentWeight = lerp(state.currentWeight, state.targetWeight, lerpFactor);
            state.currentScale = lerp(state.currentScale, state.targetScale, lerpFactor);

            // Apply styles directly for maximum performance
            letterEl.style.fontWeight = Math.round(state.currentWeight);
            letterEl.style.transform = `scale(${state.currentScale.toFixed(4)})`;
        });

        animationFrameId.current = requestAnimationFrame(animate);
    }, []);

    // Mouse move handler - just updates mouse position
    const handleMouseMove = useCallback((e) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
        isMouseInContainer.current = true;
        updateTargets();
    }, [updateTargets]);

    // Mouse leave handler - triggers smooth return to normal
    const handleMouseLeave = useCallback(() => {
        isMouseInContainer.current = false;

        // Set all targets to normal state
        letterStates.current.forEach((state) => {
            state.targetWeight = 400;
            state.targetScale = 1;
        });
    }, []);

    useEffect(() => {
        // Initialize letter states after initial render
        initLetterStates();

        // Start the animation loop
        animationFrameId.current = requestAnimationFrame(animate);

        // Initial animation on mount
        const tl = gsap.timeline();

        tl.fromTo('.welcome-letter',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power3.out',
                stagger: 0.02
            }
        );

        tl.fromTo('.portfolio-letter',
            { opacity: 0, y: 50, rotationX: -90 },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 0.6,
                ease: 'back.out(1.7)',
                stagger: 0.05
            },
            '-=0.5'
        );

        // Setup hover animations for welcome letters
        const welcomeLetters = document.querySelectorAll('.welcome-letter');
        welcomeLetters.forEach((letter) => {
            letter.addEventListener('mouseenter', () => {
                gsap.to(letter, {
                    y: -8,
                    scale: 1.15,
                    color: '#ffffff',
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(100, 200, 255, 0.6)',
                    duration: 0.25,
                    ease: 'power2.out'
                });
            });

            letter.addEventListener('mouseleave', () => {
                gsap.to(letter, {
                    y: 0,
                    scale: 1,
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });

        // Magnetic effect on mouse move for portfolio container
        const onMouseMove = (e) => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) / 50;
            const deltaY = (e.clientY - centerY) / 50;

            gsap.to(portfolioRef.current, {
                x: deltaX,
                y: deltaY,
                duration: 0.5,
                ease: 'power2.out'
            });

            // Update mouse position for proximity effect
            handleMouseMove(e);
        };

        const onMouseLeave = () => {
            gsap.to(portfolioRef.current, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });

            // Trigger smooth return to normal
            handleMouseLeave();
        };

        const container = containerRef.current;
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseLeave);

        return () => {
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseleave', onMouseLeave);

            // Cancel animation frame on cleanup
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [initLetterStates, animate, handleMouseMove, handleMouseLeave]);

    // Split text into individual letters for animation
    const portfolioText = 'Portfolio.';

    // Ref callback to store letter elements and initialize state
    const setLetterRef = useCallback((el, index) => {
        letterRefs.current[index] = el;
        // Initialize state for this letter if not already done
        if (el && !letterStates.current[index]) {
            letterStates.current[index] = {
                currentWeight: 400,
                targetWeight: 400,
                currentScale: 1,
                targetScale: 1
            };
        }
    }, []);

    return (
        <div className="welcome-container" ref={containerRef}>
            <p className="welcome-line" ref={titleRef}>
                {/* Part 1: Hey, I'm (Italic) */}
                {"Hey, I'm ".split('').map((letter, index) => (
                    <span
                        key={`part1-${index}`}
                        className="welcome-letter italic-text"
                        style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                    >
                        {letter === ' ' ? '\u00A0' : letter}
                    </span>
                ))}

                {/* Part 2: MUKESH KUMAR! (Normal) */}
                {"MUKESH KUMAR!".split('').map((letter, index) => (
                    <span
                        key={`part2-${index}`}
                        className="welcome-letter"
                        style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                    >
                        {letter === ' ' ? '\u00A0' : letter}
                    </span>
                ))}

                {/* Part 3: Welcome to my (Italic) */}
                {" Welcome to my".split('').map((letter, index) => (
                    <span
                        key={`part3-${index}`}
                        className="welcome-letter italic-text"
                        style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                    >
                        {letter === ' ' ? '\u00A0' : letter}
                    </span>
                ))}
            </p>

            <h1 className="portfolio-title" ref={portfolioRef}>
                {portfolioText.split('').map((letter, index) => (
                    <span
                        key={index}
                        ref={(el) => setLetterRef(el, index)}
                        className="portfolio-letter"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {letter}
                    </span>
                ))}
            </h1>
        </div>
    );
}
