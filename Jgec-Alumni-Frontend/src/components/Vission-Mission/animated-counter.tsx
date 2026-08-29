"use client"

import { GoPeople } from "react-icons/go";
import { IoMedalOutline, IoSchoolSharp } from "react-icons/io5";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React, { useState, useEffect } from "react";

const AnimatedCounter = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
    const controlsActiveMembers = useAnimation();
    const controlsTotalMedals = useAnimation();
    const controlsScholarships = useAnimation();
    const [counters, setCounters] = useState({ activeMembers: 0, medals: 0, scholarships: 0 });

    useEffect(() => {
        if (inView) {
            controlsActiveMembers.start({
                // @ts-ignore
                value: 500,
                transition: { duration: 2, ease: "easeOut" },
            });
            controlsTotalMedals.start({
                // @ts-ignore
                value: 17,
                transition: { duration: 2, ease: "easeOut" },
            });
            controlsScholarships.start({
                // @ts-ignore
                value: 100,
                transition: { duration: 2, ease: "easeOut" },
            });
        }
    }, [inView, controlsActiveMembers, controlsTotalMedals, controlsScholarships]);

    return (
        <div
            ref={ref}
            className="h-fit sm:h-40 bg-[#171f36] text-white w-full flex justify-center sm:justify-evenly items-center max-sm:flex-col py-12 max-sm:gap-12"
        >
            {/* Active Members */}
            <div className="flex items-center justify-center gap-4">
                <GoPeople color="white" className="w-16 h-16" />
                <div className="flex lg:text-base text-[10px] flex-col justify-center">
                    <motion.h1
                        className="text-4xl font-semibold mb-1"
                        animate={controlsActiveMembers}
                        // @ts-ignore
                        initial={{ value: 0 }}
                        onUpdate={(latest:any) =>
                            setCounters((prev) => ({ ...prev, activeMembers: Math.round(latest.value) }))
                        }
                    >
                        {counters.activeMembers}+
                    </motion.h1>
                    <p className="text-sm text-neutral-200">Active Members</p>
                </div>
            </div>

            {/* Total Medals */}
            <div className="flex items-center justify-center gap-4">
                <IoMedalOutline color="white" className="w-14 h-14" />
                <div className="flex text-[10px] lg:text-base flex-col justify-center">
                    <motion.h1
                        className="text-4xl font-semibold mb-1"
                        animate={controlsTotalMedals}
                        // @ts-ignore
                        initial={{ value: 0 }}
                        onUpdate={(latest:any) =>
                            setCounters((prev) => ({ ...prev, medals: Math.round(latest.value) }))
                        }
                    >
                        {counters.medals}+
                    </motion.h1>
                    <p className="text-sm text-neutral-200">Total Medals</p>
                </div>
            </div>

            {/* Scholarships */}
            <div className="flex items-center justify-center gap-4">
                {/* <Image
                    height={50}
                    width={50}
                    loading="lazy"
                    src="/assets/scholarship_icon.png"
                    className="w-8 h-8 md:w-14 lg:h-14"
                    alt="scholarship"
                /> */}
                <IoSchoolSharp color="white" className="w-16 h-16" />
                <div className="flex lg:text-base text-[10px] flex-col">
                    <motion.h1
                        className="text-4xl font-semibold mb-1"
                        animate={controlsScholarships}
                        // @ts-ignore
                        initial={{ value: 0 }}
                        onUpdate={(latest:any) =>
                            setCounters((prev) => ({ ...prev, scholarships: Math.round(latest.value) }))
                        }
                    >
                        {counters.scholarships}+
                    </motion.h1>
                    <p className="text-sm text-neutral-200">Scholarships</p>
                </div>
            </div>
        </div>
    );
};

export default AnimatedCounter;
