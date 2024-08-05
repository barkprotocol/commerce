"use client";

import { Hero } from "@/components/Hero";
import { LandingPage } from "@/components/LandingPage";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar Section */}
      <header className="py-4 bg-neutral-900 shadow-md">
        <NavBar />
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Hero />
      </section>

      {/* Separator */}
      <hr className="w-full border-t-2 border-sol-gray my-4" />

      {/* Landing Page Section */}
      <section className="flex-grow flex justify-center px-4">
        <div className="w-full max-w-7xl">
          <LandingPage />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-4 bg-neutral-900 border-t border-neutral-700">
        <Footer />
      </footer>
    </main>
  );
}
