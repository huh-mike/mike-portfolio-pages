// components/ClientExperienceWrapper.tsx
'use client';

import { useEffect, useRef } from 'react';
import CulinaryHero from "@/components/heros/culinary-hero";
import CulinaryForestOverlay from "@/components/animations/culinary-forest";
// No Preloader component import needed here as it's static in layout.tsx

interface ClientExperienceWrapperProps {
    children?: React.ReactNode;
}

export default function ClientExperienceWrapper({ children }: ClientExperienceWrapperProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const timers = useRef<{ setup?: NodeJS.Timeout, reveal?: NodeJS.Timeout }>({});

    useEffect(() => {
        // This timeout is for GSAP setups in CulinaryHero and CulinaryForestOverlay.
        // These components mount within the initially hidden contentRef div.
        // Their useGSAP hooks run and set initial states (opacity 0, off-screen positions).
        timers.current.setup = setTimeout(() => {
            // GSAP setups are assumed complete. Now manage preloader and content visibility.
            const preloaderElement = document.getElementById('page-preloader');
            if (preloaderElement) {
                preloaderElement.classList.remove('opacity-100'); // Or might not be needed if default is 1
                preloaderElement.classList.add('opacity-0');

                const handlePreloaderTransitionEnd = () => {
                    preloaderElement.classList.add('invisible', 'pointer-events-none');
                    preloaderElement.removeEventListener('transitionend', handlePreloaderTransitionEnd);
                };
                preloaderElement.addEventListener('transitionend', handlePreloaderTransitionEnd);
            }

            if (contentRef.current) {
                contentRef.current.classList.remove('opacity-0', 'invisible');
                contentRef.current.classList.add('opacity-100', 'visible');
            }
        }, 300); // Adjust timing: allow GSAP in children to initialize

        return () => {
            clearTimeout(timers.current.setup);
            clearTimeout(timers.current.reveal); // Though reveal timer isn't explicitly separate now
        };
    }, []); // Runs once after ClientExperienceWrapper mounts

    return (
        <div ref={contentRef} className="content-to-reveal" style={{ width: '100%' }}>
            {/* Client components with animations */}
            <CulinaryHero />
            <CulinaryForestOverlay />

            {/* Server-rendered children */}
            {children}
        </div>
    );
}