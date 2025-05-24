"use client";

import ClientExperienceWrapper from "@/components/wrappers/client-experience-wrapper";

export default function Home() {
    return (
        <main className="relative flex flex-col items-center justify-center min-h-screen">
            {/* Hero */}
            <ClientExperienceWrapper>
                <section className="relative w-full h-full min-h-screen p-24 px-8 bg-center bg-cover"
                         style={{backgroundImage: "url('/culinary-page/bg.svg')"}}>
                    <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-normal tracking--tight-4 text-white text-[10vw] lg:text-[5vw]">
                        Something
                        <sup className="relative -top-[20px] left-[10px] text-[4vw] lg:text-[1.5vw]">
                            ™
                        </sup>
                    </h1>
                </section>
            </ClientExperienceWrapper>
        </main>
    );
}
