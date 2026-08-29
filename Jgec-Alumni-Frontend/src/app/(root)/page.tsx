"use client";

import React from 'react'
import HomePage from "@/components/Home/Home"
import GoverningBody from '@/components/Home/GoverningBody'
import Image from 'next/image'
import { FaCheckCircle } from 'react-icons/fa'

const Home = () => {
  return (
    <>
      <section className="w-full h-[40vh] xs:h-[50vh] md:h-[60vh] lg:h-[80vh] lg:mt-[8em] mt-[6em] relative overflow-hidden">
        <Image
          src="/assets/Welcome.jpeg"
          alt="JGEC Main Gate — Jalpaiguri Government Engineering College"
          fill
          className="object-cover object-center aspect-[4/3] md:aspect-auto"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        {/* Centered text on the image */}
        <div className="absolute md:bottom-10 bottom-5 inset-0 flex flex-col items-center justify-end px-4 text-center">
          <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-blue-300 mb-1 sm:mb-2 drop-shadow">
            Est. 1961 · West Bengal, India
          </p>
          <h1 className="text-base xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl leading-tight max-w-70 xs:max-w-sm sm:max-w-lg md:max-w-3xl">
            Welcome to the <span className="text-blue-300">The JGEC Alumni Association</span>
          </h1>
          <p className=" xs:block text-[10px] sm:text-sm md:text-base lg:text-lg text-white/80 mt-1.5 sm:mt-3 max-w-xs sm:max-w-xl font-medium drop-shadow">
            Jalpaiguri Government Engineering College &mdash; Connecting generations of excellence.
          </p>
          
          {/* Animated Scroll Indicator (PC Only) */}
          <a 
            href="#about" 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden md:flex flex-col items-center mt-8 lg:mt-12 opacity-75 hover:opacity-100 transition-all duration-300 group"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 mb-2 group-hover:text-white transition-colors">
              Scroll
            </span>
            <div className="w-6 h-10 border-2 border-white/50 group-hover:border-white/80 rounded-full flex justify-center pt-1.5 transition-colors">
              <div className="w-1 h-2.5 bg-blue-300 rounded-full animate-[bounce_1.5s_infinite]" />
            </div>
          </a>
        </div>
      </section>

      {/* About + Opportunities section below the banner */}
      <section id="about" className="w-full bg-[#ecf0f4] px-4 md:px-10 py-8 md:py-20 scroll-mt-24">
        <div className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

          {/* Left — About text */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <span className="inline-block w-fit px-4 py-1 text-xs font-bold tracking-widest uppercase text-blue-700 bg-blue-100 rounded-full">
              About Us
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-800 leading-snug">
              Jalpaiguri Government Engineering College
            </h2>
            <div className="w-12 h-1 bg-blue-500 rounded-full" />
            <p className="font-medium text-neutral-600 text-sm md:text-base leading-relaxed text-justify">
              It was a vision to establish a centre of professional learning where
              pursuit of knowledge and excellence was not to be barred by
              nationality, language, cultural plurality and religion that drove
              the founders of Jalpaiguri Government Engineering College (JGEC) to
              establish a world class centre of technical excellence. Established
              in 1961, JGEC is the second oldest of all technical institutions in
              the state of West Bengal, India. From the time of its inception,
              JGEC has gone from strength to strength providing essential manpower
              to harness the flood of opportunities in the fields of engineering
              and technology in the country and beyond. The Alumni Association
              works closely with the institution to involve ex-students and
              present students through various activities. JGEC has a number of
              alumni chapters around the globe.
            </p>
          </div>

          {/* Right — Opportunities */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <span className="inline-block w-fit px-4 py-1 text-xs font-bold tracking-widest uppercase text-green-700 bg-green-100 rounded-full">
              Opportunities
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-800 leading-snug">
              What We Provide
            </h2>
            <div className="w-12 h-1 bg-green-500 rounded-full" />
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <FaCheckCircle className="text-green-500 text-xl mt-0.5 shrink-0" />
                <p className="font-semibold text-neutral-700 text-sm md:text-base leading-snug">
                  Promote JGEC pride and tradition at campus and across the globe.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <FaCheckCircle className="text-green-500 text-xl mt-0.5 shrink-0" />
                <p className="font-semibold text-neutral-700 text-sm md:text-base leading-snug">
                  Promote relationships between alumni, students and administration.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <FaCheckCircle className="text-green-500 text-xl mt-0.5 shrink-0" />
                <p className="font-semibold text-neutral-700 text-sm md:text-base leading-snug">
                  Enhance the college experience through fun, memorable events and value addition.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
      <HomePage />
      {/* Hero Banner — landscape image full width */}
      <GoverningBody />
    </>
  )
}

export default Home
