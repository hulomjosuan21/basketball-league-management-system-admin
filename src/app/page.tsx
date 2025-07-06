"use client"
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { PublicNavbar } from "@/components/public-navbar";

export default function Home() {
    return (
        <main>
            <PublicNavbar />
            <section className="flex flex-col items-center justify-center">
                <HeroSection /></section>
            <Footer />
        </main>
    )
}