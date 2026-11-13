"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGetEventByIdQuery } from "@/store/feature/event-feature";
import dynamic from "next/dynamic";
import Loading from "@/app/Loader";
import toast from "react-hot-toast";
import { motion, Variants } from "framer-motion";
import {
	Calendar,
	MapPin,
	Clock,
	User,
	Info,
	CalendarDays,
	ArrowLeft,
	Sparkles,
} from "lucide-react";
import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EventParams {
	params: Promise<{ id: string }>;
}

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 28 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 260, damping: 22 },
	},
};

const stagger: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.11 } },
};

/* ── Poster sub-component ─────────────────────────────────────── */
function PosterCard({ src, alt }: { src?: string; alt?: string }) {
	const [loaded, setLoaded] = useState(false);
	const fallback = "/assets/placeholder.jpg";

	return (
		<div className="relative bg-white rounded-3xl shadow-sm border border-white/80 overflow-hidden p-2">
			{!loaded && (
				<div className="absolute inset-2 rounded-2xl bg-slate-100 animate-pulse" />
			)}
			<div className="relative w-full rounded-2xl overflow-hidden bg-primary flex items-center justify-center">
				<img
					src={src || fallback}
					alt={alt || "Event Poster"}
					onLoad={() => setLoaded(true)}
					className={`w-auto h-auto max-w-full object-contain shadow-xl transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
						}`}
					style={{ display: "block" }}
				/>
			</div>
		</div>
	);
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

	return (
		<div className="min-h-screen bg-[#f0f4fb]">

			{/* ── Standard Professional Header ──────────────────────────────────────────────────── */}
			<div className="w-full lg:mt-[5.5em] mt-[5em] bg-primary overflow-hidden border-b border-slate-200">

				{/* ── Back button ── */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-14">
					<Link href="/upcoming-events">
						<button className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
							<ArrowLeft size={16} />
							<span>Back to Events</span>
						</button>
					</Link>
				</div>

				{/* ── Hero content ── */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-16 sm:pb-20 lg:pb-24">
					<div className="max-w-4xl">
						{/* Badge */}
						<div className="mb-4">
							<span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded">
								Alumni Event
							</span>
						</div>

						{/* Title */}
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
							{event?.name}
						</h1>

						{/* Meta row */}
						<div className="mt-8 flex flex-wrap gap-4">
							{event?.date && (
								<div className="flex items-center gap-2 text-white/90 text-sm sm:text-base font-medium">
									<Calendar size={18} className="text-[#c4eb80]" />
									<span>{event.date}</span>
								</div>
							)}
							{event?.location && (
								<div className="flex items-center gap-2 text-white/90 text-sm sm:text-base font-medium">
									<MapPin size={18} className="text-[#c4eb80]" />
									<span>{event.location}</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* ── Body ──────────────────────────────────────────────────── */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-10 sm:-mt-14 lg:-mt-16 pb-20 relative z-10">
				<motion.div
					initial="hidden"
					animate="show"
					variants={stagger}
					className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-6 lg:gap-8"
				>

					{/* ══ LEFT COLUMN ═══════════════════════════════════════ */}
					<div className="flex flex-col gap-6">

						{/* Poster — mobile only */}
						<motion.div variants={fadeUp} className="lg:hidden">
							<PosterCard src={event?.event_thumbnail} alt={event?.name} />
						</motion.div>

						{/* About the Event */}
						<motion.section
							variants={fadeUp}
							className="bg-white rounded-3xl shadow-sm border border-white/80 overflow-hidden"
						>
							<div className="flex items-center gap-3 px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100">
								<span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary shrink-0">
									<Info size={18} />
								</span>
								<h2 className="text-lg sm:text-xl font-extrabold text-primary">
									About the Event
								</h2>
							</div>
							<div className="px-6 sm:px-8 py-6 prose prose-sm sm:prose-base max-w-none text-slate-700">
								<ReactQuill
									theme="bubble"
									value={event?.details}
									readOnly={true}
									className="view_editor -ml-3"
								/>
							</div>
						</motion.section>

						{/* Schedule */}
						<motion.section
							variants={fadeUp}
							className="bg-white rounded-3xl shadow-sm border border-white/80 overflow-hidden"
						>
							<div className="flex items-center gap-3 px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100">
								<span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary shrink-0">
									<CalendarDays size={18} />
								</span>
								<h2 className="text-lg sm:text-xl font-extrabold text-primary">
									Event Schedule
								</h2>
							</div>

							<div className="px-6 sm:px-8 py-7">
								{event?.schedule?.length ? (
									<ol className="relative border-l-2 border-slate-100 space-y-0">
										{event.schedule.map((s: any, i: number) => (
											<motion.li
												key={i}
												initial={{ opacity: 0, x: -14 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: true, margin: "-30px" }}
												transition={{ delay: i * 0.08, duration: 0.4 }}
												className="relative pl-7 pb-7 last:pb-0 group"
											>
												{/* dot */}
												<span className="absolute -left-[9px] top-1 flex items-center justify-center w-4 h-4 rounded-full bg-white border-[3px] border-slate-300 group-hover:border-primary transition-colors duration-300 shadow-sm z-10" />

												{/* time chip */}
												<div className="flex items-center gap-1.5 mb-1.5">
													<Clock size={12} className="text-primary/60 shrink-0" />
													<span className="text-[11px] sm:text-xs font-bold text-primary/70 uppercase tracking-wide">
														{s.startTime} – {s.endTime}
													</span>
												</div>

												{/* activity */}
												<div className="bg-slate-50 group-hover:bg-primary border border-slate-100 group-hover:border-primary rounded-2xl px-4 py-3 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5">
													<p className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-white transition-colors duration-300">
														{s.activity}
													</p>
												</div>
											</motion.li>
										))}
									</ol>
								) : (
									<div className="text-center py-10 text-slate-400 font-medium italic">
										Schedule not available yet.
									</div>
								)}
							</div>
						</motion.section>

						{/* Convenor — mobile (below schedule) */}
						{(event?.hostName || event?.hostDetails) && (
							<motion.div
								variants={fadeUp}
								className="lg:hidden bg-white rounded-3xl shadow-sm border border-white/80 overflow-hidden"
							>
								<div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-slate-100">
									<span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
										<User size={16} />
									</span>
									<h3 className="text-base font-extrabold text-primary">Convenor</h3>
								</div>
								<div className="px-6 py-5">
									{/* Host Image Space */}
									<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm mb-4">
										<img
											src={event?.hostImage || "/assets/placeholder.jpg"}
											alt={event?.hostName || "Host"}
											className="w-full h-full object-cover"
										/>
									</div>

									{event?.hostName && (
										<p className="text-base font-bold text-slate-800 mb-2">{event.hostName}</p>
									)}
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
						)}
					</div>

					{/* ══ RIGHT SIDEBAR ═════════════════════════════════════ */}
					<div className="hidden lg:block">
						<div className="lg:sticky lg:top-28 flex flex-col gap-6">

							{/* Poster — desktop */}
							<motion.div variants={fadeUp}>
								<PosterCard src={event?.event_thumbnail} alt={event?.name} />
							</motion.div>

							{/* Convenor — desktop */}
							{(event?.hostName || event?.hostDetails) && (
								<motion.div
									variants={fadeUp}
									className="bg-white rounded-3xl shadow-sm border border-white/80 overflow-hidden"
								>
									<div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-slate-100">
										<span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
											<User size={16} />
										</span>
										<h3 className="text-base font-extrabold text-primary">Convenor</h3>
									</div>
									<div className="px-6 py-5">
										{/* Host Image Space */}
										<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm mb-4">
											<img
												src={event?.hostImage || "/assets/placeholder.jpg"}
												alt={event?.hostName || "Host"}
												className="w-full h-full object-cover"
											/>
										</div>

										{event?.hostName && (
											<p className="text-base font-bold text-slate-800 mb-2">{event.hostName}</p>
										)}
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
							)}
						</div>
					</div>

				</motion.div>
			</div>
		</div>
	);
};

export default Page;

