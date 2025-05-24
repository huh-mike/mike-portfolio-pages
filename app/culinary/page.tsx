"use client";

import {motion} from "motion/react";
import ClientExperienceWrapper from "@/components/wrappers/client-experience-wrapper";
import DraggableCarousel from "@/components/contents/culinary-content";

export default function Home() {
    return (
        <main className="relative flex flex-col items-center justify-center min-h-screen">
            {/* Hero */}
            <ClientExperienceWrapper>
                <section className="flex flex-col justify-center items-center w-full h-full min-h-screen px-8 bg-[url('/culinary-page/bg.png')] bg-[#283035] bg-blend-screen bg-center bg-cover">
                    <motion.h1
                        initial={{opacity: 0, y: 40}}
                        whileInView={{ opacity: 1, y: 0,transition: { delay: 0, duration: 1.2 }}}
                        className="md:mt-12 md:mb-8 font-bodoni tracking--tight-4 text-white text-[10vw] lg:text-[5vw]">
                        Our Specialty
                    </motion.h1>
                    <DraggableCarousel />
                </section>
                <section>

                </section>
            </ClientExperienceWrapper>
        </main>
    );
}
