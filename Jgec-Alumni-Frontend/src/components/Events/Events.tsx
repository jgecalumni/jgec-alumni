"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import SectionHeader from "../section-header";
import { useAllEventsQuery } from "@/store/feature/event-feature";
import toast from "react-hot-toast";
import Loading from "@/app/Loader";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

const Events: React.FC = () => {
	const [page, setPage] = useState<number>(1);

	const { data, error, isError, isLoading } = useAllEventsQuery({
		page: page,
		search: "",
	});
	const [timeRemaining, setTimeRemaining] = useState<Record<number, any>>({});
	const [totalPages, setTotalPages] = useState<number>(1);

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch events");
		}
		if (!data?.events) return;

		const updateTimes = () => {
			const updatedTimes: Record<number, any> = {};

			data.events.forEach((event) => {
				const eventDate = new Date(`${event.date}T${event.time}:00`).getTime();
				const currentTime = new Date().getTime();
				const difference = eventDate - currentTime;

				if (difference > 0) {
					updatedTimes[event.id] = {
						days: String(
							Math.floor(difference / (1000 * 60 * 60 * 24))
						).padStart(2, "0"),
						hours: String(
							Math.floor(
								(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
							)
						).padStart(2, "0"),
						minutes: String(
							Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
						).padStart(2, "0"),
						seconds: String(
							Math.floor((difference % (1000 * 60)) / 1000)
						).padStart(2, "0"),
					};
				} else {
					updatedTimes[event.id] = {
						days: "00",
						hours: "00",
						minutes: "00",
						seconds: "00",
					};
				}
			});

			setTimeRemaining(updatedTimes);
		};

		// Run initially and then update every second
		updateTimes();
		const timer = setInterval(updateTimes, 1000);

		return () => clearInterval(timer);
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [data, isError, error]); // Runs whenever `data` updates

	if (isLoading) {
		return <Loading />;
	}

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
		<div className="bg-[#edf1f4] min-h-screen pb-24">
			<SectionHeader
				highlightTitle="All Events"
				normalTitle="Archive"
				description="Discover and join our amazing upcoming events"
			/>
			
			{data?.events.length !== 0 ? (
				<div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mt-12">
					<motion.div 
						variants={containerVariants}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
					>
						{data?.events.map((event) => (
							<motion.div
								variants={itemVariants}
								key={event.id}
								className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col border border-neutral-100"
							>
								{/* Image Section */}
								<div className="relative h-64 overflow-hidden bg-neutral-200">
									<Image
										layout="fill"
										objectFit="cover"
										src={event.event_thumbnail || "/assets/placeholder.jpg"}
										alt={event.name}
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									{/* Gradient Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
									
									{/* Glassmorphic Countdown Timer */}
									<div className="absolute bottom-4 left-0 right-0 px-4">
										<div className="flex gap-2 justify-between items-center bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30 shadow-lg">
											{["Days", "Hrs", "Min", "Sec"].map((unit, index) => {
												const values = ["days", "hours", "minutes", "seconds"];
												return (
													<div
														key={unit}
														className="flex flex-col items-center flex-1">
														<div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
															{unit}
														</div>
														<div className="text-white text-xl lg:text-2xl font-bold font-mono tracking-tighter bg-black/40 w-full rounded-xl py-1 text-center shadow-inner">
															{timeRemaining[event.id]?.[values[index]] || "00"}
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>

								{/* Content Section */}
								<div className="p-6 flex flex-col flex-grow">
									<div className="flex gap-4 mb-4 text-sm font-medium text-blue-600/80">
										<div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full">
											<Calendar size={14} />
											<span>{event.date}</span>
										</div>
										<div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full">
											<Clock size={14} />
											<span>{event.time}</span>
										</div>
									</div>

									<Link
										href={`/upcoming-events/${event.id}`}
										className="text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors mb-3 line-clamp-2 leading-tight">
										{event.name}
									</Link>
									
									<p className="text-neutral-500 line-clamp-3 text-sm leading-relaxed mb-8 flex-grow">
										{event.shortDescription}
									</p>

									<Link href={`/upcoming-events/${event.id}`} className="w-full">
										<Button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-semibold py-6 rounded-2xl shadow-md transition-all hover:shadow-xl">
											<span className="relative z-10 flex items-center justify-center gap-2 text-[16px]">
												JOIN WITH US
												<ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
											</span>
										</Button>
									</Link>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			) : (
				<div className="h-[50vh] flex flex-col justify-center items-center">
					<div className="font-bold text-slate-800 text-2xl mb-2">No events found</div>
					<p className="text-neutral-500 font-medium">Check back later for upcoming events.</p>
				</div>
			)}
		</div>
	);
};

export default Events;
