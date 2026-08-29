"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useGetEventByIdQuery } from "@/store/feature/event-feature";
import dynamic from "next/dynamic";
import Loading from "@/app/Loader";
import toast from "react-hot-toast";
import { motion, Variants } from "framer-motion";
import { Calendar, MapPin, Clock, User, Info, CalendarDays } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EventParams {
	params: Promise<{ id: string }>;
}

const Page = ({ params }: EventParams) => {
	const { id } = React.use(params);
	const { data, isLoading, isError, error } = useGetEventByIdQuery(id);

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch event");
		}
	}, [isError, error]);

	if (isLoading) {
		return <Loading />;
	}

	const event = data?.data;

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.1 }
		}
	};
	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
	};

	return (
		<div className="bg-[#edf1f4] min-h-screen pb-16 md:pb-24 relative overflow-hidden">
			
			{/* Cinematic Hero Banner */}
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
				className="lg:mt-[5.5em] mt-[5em] h-[45vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden relative z-10"
			>
				<Image
					layout="fill"
					objectFit="cover"
					src={event?.event_thumbnail || "/assets/placeholder.jpg"}
					alt={event?.name || "Event Banner"}
					className="object-cover blur-xl opacity-50 scale-110"
				/>
				{/* Sleek Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/60 to-transparent"></div>
				
				<div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto w-full pb-8 sm:pb-12 lg:pb-16">
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="flex flex-col gap-3 relative z-20"
					>
						<h1 className="text-xl sm:text-3xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg max-w-4xl leading-tight">
							{event?.name}
						</h1>
						
						<div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm md:text-base font-bold tracking-wide mt-1">
							<div className="flex items-center gap-1.5 sm:gap-2 bg-primary px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-[#c4eb80] shadow-md border border-[#c4eb80]/20">
								<Calendar size={14} className="sm:w-[18px] sm:h-[18px]" />
								<span className="line-clamp-1">{event?.date}</span>
							</div>
							<div className="flex items-center gap-1.5 sm:gap-2 bg-primary px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-[#c4eb80] shadow-md border border-[#c4eb80]/20">
								<MapPin size={14} className="sm:w-[18px] sm:h-[18px] shrink-0" />
								<span className="line-clamp-1">{event?.location}</span>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.div>

			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-2rem] sm:mt-[-3rem] relative z-20">
				<motion.div 
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8"
				>
					{/* Mobile: Poster first, then content. Desktop: left=content, right=poster+convenor */}

					{/* Poster — shows first on mobile via order */}
					<div className="lg:hidden order-first">
						<motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-2 flex items-center justify-center">
							<div className="relative w-full rounded-xl overflow-hidden flex justify-center bg-primary">
								<img
									src={event?.event_thumbnail || "/assets/placeholder.jpg"}
									alt={event?.name || "Event Poster"}
									className="w-auto h-auto max-w-full max-h-[55vw] object-contain shadow-2xl"
								/>
							</div>
						</motion.div>
					</div>

					{/* Left Column: Details & Schedule */}
					<div className="lg:col-span-2 flex flex-col gap-5 sm:gap-8">
						
						{/* Combined Main Card */}
						<motion.div variants={itemVariants} className="bg-white rounded-2xl sm:rounded-[2rem] shadow-sm border border-neutral-200 overflow-hidden">
							
							{/* About Section */}
							<div className="p-5 sm:p-8 lg:p-10">
								<div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center text-[#c4eb80] shadow-md shrink-0">
										<Info size={20} />
									</div>
									<h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary">
										About the Event
									</h2>
								</div>
								
								<div className="prose prose-sm sm:prose-lg max-w-none text-neutral-700 pl-3 sm:pl-4 lg:pl-16 border-l-2 border-slate-100">
									<ReactQuill
										theme="bubble"
										value={event?.details}
										readOnly={true}
										className="view_editor -ml-3"
									/>
								</div>
							</div>

							{/* Divider */}
							<div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

							{/* Schedule Section */}
							<div className="p-5 sm:p-8 lg:p-10 bg-slate-50/50">
								<div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center text-[#c4eb80] shadow-md shrink-0">
										<CalendarDays size={20} />
									</div>
									<h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary">
										Event Schedule
									</h2>
								</div>
								
								<div className="pl-2 sm:pl-4 lg:pl-16">
									<div className="relative border-l-2 border-slate-200 space-y-5 sm:space-y-8 pb-4">
										{event?.schedule?.map((schedule: any, index: number) => (
											<motion.div 
												initial={{ opacity: 0, x: -10 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true, margin: "-20px" }}
												transition={{ delay: index * 0.1, duration: 0.4 }}
												key={index} 
												className="relative pl-5 sm:pl-8 md:pl-10 group"
											>
												{/* Timeline Dot */}
												<div className="absolute -left-[9px] sm:-left-[11px] top-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white border-4 border-slate-300 group-hover:border-[#c4eb80] transition-colors duration-300 z-10 shadow-sm" />
												
												{/* Content */}
												<div className="bg-white hover:bg-primary border border-slate-100 group-hover:border-primary shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl p-4 sm:p-5 group-hover:-translate-y-1 cursor-default">
													<div className="flex items-center gap-2 mb-2">
														<Clock size={14} className="text-slate-400 group-hover:text-[#c4eb80] transition-colors duration-300 shrink-0" />
														<span className="text-xs sm:text-sm font-bold text-primary group-hover:text-white transition-colors duration-300">{schedule.startTime} - {schedule.endTime}</span>
													</div>
													<div className="text-sm sm:text-base text-slate-700 font-medium group-hover:text-slate-200 transition-colors duration-300">
														{schedule.activity}
													</div>
												</div>
											</motion.div>
										))}

										{!event?.schedule?.length && (
											<div className="text-primary font-medium italic p-6 sm:p-8 text-center bg-white rounded-2xl border border-neutral-100 shadow-sm ml-5 sm:ml-8">
												Schedule not available yet.
											</div>
										)}
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Right Column: Poster & Convenor — hidden on mobile (poster shown above) */}
					<div className="lg:col-span-1 flex flex-col gap-5 sm:gap-8">
						
						{/* Event Poster — only on desktop */}
						<motion.div variants={itemVariants} className="hidden lg:flex bg-white rounded-[2rem] shadow-sm border border-neutral-200 p-2 items-center justify-center">
							<div className="relative w-full rounded-[1.5rem] overflow-hidden flex justify-center bg-primary">
								<img
									src={event?.event_thumbnail || "/assets/placeholder.jpg"}
									alt={event?.name || "Event Poster"}
									className="w-auto h-auto max-w-full max-h-[60vh] lg:max-h-[75vh] object-contain shadow-2xl"
								/>
							</div>
						</motion.div>

						{/* Convenor Card */}
						<motion.div variants={itemVariants} className="bg-white rounded-2xl sm:rounded-[2rem] shadow-sm border border-neutral-200 p-5 sm:p-8 lg:p-10 relative overflow-hidden lg:sticky lg:top-32">
							<h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-primary mb-4 sm:mb-6 flex items-center gap-3 relative z-10">
								<div className="bg-slate-100 p-2.5 sm:p-3 rounded-xl text-primary shadow-sm shrink-0">
									<User size={20} />
								</div>
								Convenor
							</h3>
							
							<div className="relative z-10 pl-1 sm:pl-2">
								<div className="text-base sm:text-lg font-bold text-slate-800 mb-2">
									{event?.hostName}
								</div>
								<div className="prose prose-sm text-neutral-600">
									<ReactQuill
										theme="bubble" 
										value={event?.hostDetails}
										readOnly={true}
										className="view_editor -ml-3"
									/>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Page;
