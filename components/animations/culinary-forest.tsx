
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const leavesData = [
    { id: 'L1', src: '/culinary-page/leaf-one.png', basePosition: { left: '0%' }, xPercentOffset: -20, size: 800, rotation: -10, speedFactor: 1.3, initialYPercent: 350, blurAmount: 6, zIndex: 3 },
    { id: 'L2', src: '/culinary-page/leaf-two.png', basePosition: { left: '0%' }, xPercentOffset: -55, size: 1300, rotation: -10, speedFactor: 1.1, initialYPercent: 350, blurAmount: 4, zIndex: 2 },
    { id: 'L3', src: '/culinary-page/leaf-three.png', basePosition: { left: '0%' }, xPercentOffset: -40, size: 600, rotation: -25, speedFactor: 0.4, initialYPercent: 430, blurAmount: 2, zIndex: 1 },
    { id: 'R1', src: '/culinary-page/leaf-four.png', basePosition: { left: '100%' }, xPercentOffset: -80, size: 900, rotation: -180, speedFactor: 0.8, initialYPercent: 275, blurAmount: 3, zIndex: 1 },
    { id: 'R2', src: '/culinary-page/leaf-five.png', basePosition: { left: '100%' }, xPercentOffset: -60, size: 1200, rotation: 0, speedFactor: 1, initialYPercent: 40, blurAmount: 4, zIndex: 3 },
    { id: 'R3', src: '/culinary-page/leaf-six.png', basePosition: { left: '100%' }, xPercentOffset: -60, size: 1300, rotation: -15, speedFactor: 1.5, initialYPercent: 300, blurAmount: 6, zIndex: 2 },
];

export default function CulinaryForestOverlay() {
    const overlayContainerRef = useRef<HTMLDivElement | null>(null);
    const leafRefs = useRef<(HTMLDivElement | null)[]>(new Array(leavesData.length).fill(null)); // Initialize with correct length

    useGSAP(
        () => {
            if (!overlayContainerRef.current) return;

            const ctx = gsap.context(() => {
                leafRefs.current.forEach((leafEl, index) => {
                    if (!leafEl) return;
                    const leafData = leavesData[index]; // leavesData is stable, so direct access is fine

                    // Set initial state: at/below bottom of screen, correct side, rotated, invisible
                    gsap.set(leafEl, {
                        ...leafData.basePosition,
                        xPercent: leafData.xPercentOffset + (Math.random() * 10 - 5),
                        yPercent: leafData.initialYPercent, // Positive values: start at/below screen bottom
                        rotation: leafData.rotation + (Math.random() * 20 - 10),
                        opacity: 0,
                    });

                    // Animate to final state: moves up, opacity fades in then out
                    gsap.to(leafEl, {
                        yPercent: -150 - (200 * leafData.speedFactor), // Negative values: move far above the top
                        rotation: `${leafData.rotation + (Math.random() < 0.5 ? 1 : -1) * 20 * leafData.speedFactor}`, // Optional: more pronounced rotation
                        ease: 'none',
                        scrollTrigger: {
                            trigger: overlayContainerRef.current,
                            start: 'top bottom', // Animation starts when top of trigger hits bottom of viewport
                            end: '+=400%',   // Animation ends when bottom of trigger hits top of viewport (plus buffer)
                            scrub: 1 + (Math.random() * 0.6 - 0.3),
                            // markers: process.env.NODE_ENV === 'development',
                            onUpdate: self => {
                                const progress = self.progress;
                                const fadeInEnd = 0.10; // Quick fade-in as they enter from bottom
                                const fadeOutStart = 0.90; // Start fade-out as they approach top

                                let currentOpacity;
                                if (progress < fadeInEnd) {
                                    currentOpacity = progress / fadeInEnd;
                                } else if (progress > fadeOutStart) {
                                    currentOpacity = (1 - progress) / (1 - fadeOutStart);
                                } else {
                                    currentOpacity = 1;
                                }
                                gsap.set(leafEl, { opacity: Math.max(0, Math.min(1, currentOpacity)) });
                            },
                        },
                    });
                });
            }, overlayContainerRef);
            return () => ctx.revert();
        }, { dependencies: [overlayContainerRef.current], scope: overlayContainerRef }
    );

    const setLeafRef = (el: HTMLDivElement | null, index: number) => {
        leafRefs.current[index] = el; // Assign directly to the pre-initialized array slot
    };

    return (
        <div ref={overlayContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
            {leavesData.map((leaf, index) => (
                <div
                    key={leaf.id}
                    ref={(el) => setLeafRef(el, index)}
                    className="absolute"
                    style={{
                        width: `${leaf.size}px`,
                        height: 'auto',
                        zIndex: leaf.zIndex,
                        filter: `blur(${leaf.blurAmount}px)`,
                    }}
                >
                    <Image
                        src={leaf.src}
                        alt={`Tropical ${leaf.id}`}
                        width={leaf.size}
                        height={leaf.size}
                        className="block w-full h-auto"
                        priority={true}
                    />
                </div>
            ))}
        </div>
    );
}