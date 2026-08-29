"use client";

import Loading from "@/app/loading";
import {
	useAllEventsQuery,
	useDeleteEventMutation,
} from "@/store/feature/event-feature";
import { debounce } from "@/utils";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin, Plus, Search, Trash2, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { format, parse } from "date-fns";
import { ModalEventDetails } from "../Modals/ModalDetails";
import Image from "next/image";

const ModalEventEdit = dynamic(() => import("../Modals/ModalEventEdit"), { ssr: false });

const Events: React.FC = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [editEvent, setEditEvent] = useState<any>();
	const [eventDetails, setEventDetails] = useState<any>();
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
			toast.error((error as any)?.data?.message || "Failed to fetch Events");
		}
		if (isDeleteError) {
			toast.error((deleteError as any)?.data?.message || "Failed to delete Event");
		}
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [isError, error, data, isDeleteError, deleteError]);

	if (isLoading || isDeleting) {
		return <Loading />;
	}

	const handleSearch = debounce(async (e: any) => {
		const searchValue = e.target.value;
		setSearchQuery(searchValue);
	}, 1000);

	const handleDelete = async (id: any) => {
		const res = await deleteEvent(id);
		if (res?.data?.success) {
			toast.success("Event deleted successfully");
			refetch();
		}
	};

	return (
		<>
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground">Events</h1>
					<p className="text-muted-foreground mt-1 text-sm">Manage and schedule platform events.</p>
				</div>
				<button
					onClick={() => setOpenModal(true)}
					className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-5 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 self-start sm:self-auto"
				>
					<Plus size={16} strokeWidth={2.5} />
					Add Event
				</button>
			</div>

			{/* Search */}
			<div className="mb-6">
				<div className="relative max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
					<input
						type="text"
						onChange={handleSearch}
						className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
						placeholder="Search events..."
					/>
				</div>
			</div>

			{/* Events Grid */}
			{data?.events?.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{data.events.map((item: any) => (
						<div
							key={item.id}
							onClick={() => setEventDetails(item)}
							className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
						>
							{/* Thumbnail */}
							<div className="relative w-full h-44 bg-muted overflow-hidden">
								{item.event_thumbnail ? (
									<Image
										src={item.event_thumbnail}
										alt={item.name}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
										<CalendarDays size={40} className="text-indigo-400/50" />
									</div>
								)}
								{/* Date badge */}
								<div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-sm">
									{format(new Date(item.date), 'dd MMM, yyyy')}
								</div>
							</div>

							{/* Content */}
							<div className="p-4">
								<h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2 mb-2">
									{item.name}
								</h3>
								<p className="text-xs text-muted-foreground line-clamp-2 mb-4">
									{item.shortDescription}
								</p>

								<div className="flex flex-col gap-1.5 mb-4">
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<MapPin size={12} className="shrink-0 text-indigo-500" />
										<span className="truncate">{item.location}</span>
									</div>
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<Clock size={12} className="shrink-0 text-indigo-500" />
										<span>{format(parse(item.time, "HH:mm", new Date()), "h:mm a")}</span>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-2 pt-3 border-t border-border">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setEditEvent(item);
										}}
										className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-lg bg-muted/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
									>
										<Pencil size={12} />
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(item.id);
										}}
										className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-lg bg-muted/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
									>
										<Trash2 size={12} />
										Delete
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-2xl text-center">
					<div className="bg-indigo-100 dark:bg-indigo-900/20 p-5 rounded-full mb-4 text-indigo-500">
						<CalendarDays size={32} />
					</div>
					<p className="font-semibold text-foreground text-lg">No events found</p>
					<p className="text-muted-foreground text-sm mt-1">Create your first event to get started.</p>
					<button
						onClick={() => setOpenModal(true)}
						className="mt-5 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all"
					>
						<Plus size={15} />
						Add Event
					</button>
				</div>
			)}

			{/* Pagination */}
			{data?.events?.length > 0 && (
				<div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
					<div className="text-sm text-muted-foreground">
						Page <span className="font-semibold text-foreground">{page}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}
							disabled={page === 1}
							className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							<ArrowLeft size={14} /> Prev
						</button>
						<button
							onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
							disabled={page === totalPages}
							className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							Next <ArrowRight size={14} />
						</button>
					</div>
				</div>
			)}

			{(openModal || !!editEvent) && (
				<ModalEventEdit
					open={openModal || !!editEvent}
					data={editEvent}
					closed={() => {
						setOpenModal(false); refetch(); setEditEvent(null);
					}}
				/>
			)}

			{!!eventDetails && (
				<ModalEventDetails
					open={!!eventDetails}
					details={eventDetails}
					closed={() => setEventDetails(null)}
				/>
			)}
		</>
	);
};

export default Events;
