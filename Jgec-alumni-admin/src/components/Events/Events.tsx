"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { format, parse } from "date-fns";
import {
	CalendarDays,
	Clock,
	MapPin,
	Plus,
	Search,
	Trash2,
	Pencil,
	ArrowLeft,
	ArrowRight,
	ExternalLink,
	Eye,
	Building2,
} from "lucide-react";

import Loading from "@/app/loading";
import {
	useAllEventsQuery,
	useDeleteEventMutation,
} from "@/store/feature/event-feature";
import { debounce } from "@/utils";
import { ModalEventDetails } from "../Modals/ModalDetails";

const ModalEventEdit = dynamic(() => import("../Modals/ModalEventEdit"), { ssr: false });

const Events: React.FC = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [editEvent, setEditEvent] = useState<any>(null);
	const [eventDetails, setEventDetails] = useState<any>(null);
	const [totalPages, setTotalPages] = useState<number>(1);

	const { data, error, isError, isLoading, refetch } = useAllEventsQuery({
		page: page,
		search: searchQuery,
	});

	const [
		deleteEvent,
		{ isLoading: isDeleting, error: deleteError, isError: isDeleteError },
	] = useDeleteEventMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch events");
		}
		if (isDeleteError) {
			toast.error((deleteError as any)?.data?.message || "Failed to delete event");
		}
		if (data) {
			setTotalPages(data?.totalPages || 1);
		}
	}, [isError, error, data, isDeleteError, deleteError]);

	if (isLoading || isDeleting) {
		return <Loading />;
	}

	const handleSearch = debounce(async (e: any) => {
		setSearchQuery(e.target.value);
		setPage(1);
	}, 600);

	const handleDelete = async (id: any) => {
		if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
			return;
		}
		const res = await deleteEvent(id);
		if (res?.data?.success) {
			toast.success("Event deleted successfully");
			refetch();
		}
	};

	const eventsList = data?.events || [];

	return (
		<div className="w-full space-y-6 animate-in fade-in duration-200">
			
			{/* Command Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
				<div>
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
						<CalendarDays className="w-3.5 h-3.5" />
						<span>Campus & Alumni Gatherings</span>
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
						Events & Reunions
					</h1>
					<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
						Schedule reunions, seminars, annual general meetings, and webinars.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => setOpenModal(true)}
						className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200"
					>
						<Plus className="w-4 h-4" />
						<span>Schedule Event</span>
					</button>
				</div>
			</div>

			{/* Search Filter Bar */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
				<div className="relative w-full sm:max-w-md">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
					<input
						type="text"
						onChange={handleSearch}
						placeholder="Search events by title or venue..."
						className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
					/>
				</div>

				<div className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
					Scheduled Events: <span className="font-bold text-slate-900 dark:text-white">{eventsList.length}</span>
				</div>
			</div>

			{/* Events Grid */}
			{eventsList.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{eventsList.map((item: any) => {
						let formattedTime = item.time || "";
						try {
							if (item.time && item.time.includes(":")) {
								formattedTime = format(parse(item.time, "HH:mm", new Date()), "h:mm a");
							}
						} catch {
							formattedTime = item.time;
						}

						let formattedDate = "";
						try {
							formattedDate = format(new Date(item.date || Date.now()), "dd MMM, yyyy");
						} catch {
							formattedDate = item.date;
						}

						return (
							<div
								key={item.id || item._id}
								onClick={() => setEventDetails(item)}
								className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between cursor-pointer"
							>
								<div>
									{/* Event Thumbnail */}
									<div className="relative w-full h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
										{item.event_thumbnail ? (
											<Image
												src={item.event_thumbnail}
												alt={item.name || "Event Image"}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										) : (
											<div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950">
												<CalendarDays className="w-10 h-10 mb-1 opacity-50" />
												<span className="text-xs">No Cover Image</span>
											</div>
										)}
										
										{/* Date Badge */}
										<div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm">
											{formattedDate}
										</div>
									</div>

									{/* Event Content */}
									<div className="p-5">
										<h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
											{item.name}
										</h3>
										<p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
											{item.shortDescription || "No description provided."}
										</p>

										<div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
											<div className="flex items-center gap-2">
												<MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
												<span className="truncate">{item.location || "Campus Venue"}</span>
											</div>
											{formattedTime && (
												<div className="flex items-center gap-2">
													<Clock className="w-3.5 h-3.5 text-primary shrink-0" />
													<span>{formattedTime}</span>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setEditEvent(item);
										}}
										className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
									>
										<Pencil className="w-3.5 h-3.5 text-slate-500" />
										<span>Edit</span>
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(item.id);
										}}
										className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 transition-colors flex items-center justify-center gap-1.5"
									>
										<Trash2 className="w-3.5 h-3.5" />
										<span>Delete</span>
									</button>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="py-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center">
					<div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
						<CalendarDays className="w-8 h-8" />
					</div>
					<h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
						No events scheduled
					</h3>
					<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
						Create your first alumni reunion or symposium using the button below.
					</p>
					<button
						onClick={() => setOpenModal(true)}
						className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-sm transition-colors"
					>
						<Plus className="w-4 h-4" />
						<span>Schedule First Event</span>
					</button>
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
					<div>
						Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of{" "}
						<span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => {
								setPage((prev) => Math.max(prev - 1, 1));
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
							disabled={page === 1}
							className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
						>
							<ArrowLeft className="w-3.5 h-3.5" /> Prev
						</button>
						<button
							onClick={() => {
								setPage((prev) => Math.min(prev + 1, totalPages));
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
							disabled={page === totalPages}
							className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
						>
							Next <ArrowRight className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			)}

			{/* Edit / Create Event Modal */}
			{(openModal || !!editEvent) && (
				<ModalEventEdit
					open={openModal || !!editEvent}
					data={editEvent}
					closed={() => {
						setOpenModal(false);
						refetch();
						setEditEvent(null);
					}}
				/>
			)}

			{/* Event Details Preview Modal */}
			{!!eventDetails && (
				<ModalEventDetails
					open={!!eventDetails}
					details={eventDetails}
					closed={() => setEventDetails(null)}
				/>
			)}
		</div>
	);
};

export default Events;
