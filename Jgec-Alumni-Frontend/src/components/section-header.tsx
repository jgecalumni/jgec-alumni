"use client";

import Image from 'next/image'
import React, { FC } from 'react'
import { motion } from "framer-motion";

interface IProps {
    highlightTitle: string
    normalTitle: string
    description: string,
    image?: string
}

const SectionHeader: FC<IProps> = ({ highlightTitle, normalTitle, description, image }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:mt-[5.5em] mt-[5em] h-[40vh] lg:h-[50vh] overflow-hidden relative z-10"
        >
            <Image
                loading="lazy"
                layout="fill"
                objectFit="cover"
                src={image || "/assets/membership.jpg"}
                alt={`${highlightTitle} ${normalTitle}`}
                className="object-cover blur-[2px] opacity-70 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/70 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 lg:px-20 max-w-5xl mx-auto w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex flex-col items-center gap-4"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-400 tracking-tight drop-shadow-2xl">
                        {highlightTitle} <span className="text-white">{normalTitle}</span>
                    </h1>
                    {description && (
                        <p className="text-base md:text-lg lg:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed drop-shadow-md">
                            {description}
                        </p>
                    )}
                </motion.div>
            </div>
        </motion.div>
    )
}

export default SectionHeader
