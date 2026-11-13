"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
	Bell,
	Plus,
	Pencil,
	Trash2,
	ExternalLink,
	Calendar,
	FileText,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";

import { useDeleteNoticeMutation, useGetAllNoticesQuery } from "@/store/feature/notice-feature";
import Loading from "@/app/loading";

const ModalNoticeEdit = dynamic(() => import("../Modals/ModalNoticeEdit"), { ssr: false });
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Notice: React.FC = () => {
	const [openModal, setOpenModal] = useState(false);
	const [editNotice, setEditNotice] = useState<INoticeType | null>(null);
	const { data, isLoading, isError, error, refetch } = useGetAllNoticesQuery({});
	const [deleteNotice, { isLoading: deleteLoading, isError: deleteIsError, error: deleteError }] = useDeleteNoticeMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch notices");
		}
		if (deleteIsError) {
			toast.error((deleteError as any)?.data?.message || "Failed to delete notice");
		}
	}, [isError, error, deleteIsError, deleteError]);

	if (isLoading || deleteLoading) {
		return <Loading />;
	}

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this notice? This action is irreversible.")) {
			return;
		}
		const res = await deleteNotice(id);
		if (res?.data?.success) {
			toast.success("Notice deleted successfully");
			refetch();
		}
	};

	const notices = data?.notices || [];

	return (
		<div className="w-full space-y-6 animate-in fade-in duration-200">
			
			{/* Command Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
				<div>
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
						<Bell className="w-3.5 h-3.5" />
						<span>Official Circulars & Bulletins</span>
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
						Notice Board
					</h1>
					<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
						Publish, archive, and manage institutional announcements and official notices.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => setOpenModal(true)}
						className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200"
					>
						<Plus className="w-4 h-4" />
						<span>Publish Notice</span>
					</button>
				</div>
			</div>

			{/* Notice List */}
			<div className="w-full">
				{notices.length > 0 ? (
					<div className="space-y-4">
						{notices.map((notice: any) => {
							let formattedDate = "";
							try {
								formattedDate = format(new Date(notice.date || Date.now()), "dd MMM, yyyy");
							} catch {
								formattedDate = notice.date;
							}

							return (
								<div
									key={notice.id || notice._id}
									className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm hover:border-primary/40 hover:shadow-md transition-all overflow-hidden"
								>
									{/* Top Meta Bar */}
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
										<div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
											<Calendar className="w-3.5 h-3.5 text-primary" />
											<span className="font-semibold text-slate-700 dark:text-slate-300">
												Published: {formattedDate}
											</span>
											<span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
											<span className="text-emerald-600 dark:text-emerald-400 font-medium">
												Live Circular
											</span>
										</div>

										<div className="flex items-center gap-2">
											<button
												onClick={() => setEditNotice(notice)}
												className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
												title="Edit Notice"
											>
												<Pencil className="w-3.5 h-3.5 text-slate-500" />
												<span>Edit</span>
											</button>
											<button
												onClick={() => handleDelete(notice.id)}
												className="p-1.5 rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 text-xs font-medium flex items-center gap-1.5 transition-colors"
												title="Delete Notice"
											>
												<Trash2 className="w-3.5 h-3.5" />
												<span>Delete</span>
											</button>
										</div>
									</div>

									{/* Notice Body */}
									<div className="p-6">
										<div className="flex items-start justify-between gap-4 mb-3">
											<h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
												{notice.title}
											</h3>
											{notice.link && (
												<Link
													href={notice.link}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0 pt-1"
												>
													<span>Attachment</span>
													<ExternalLink className="w-3.5 h-3.5" />
												</Link>
											)}
										</div>

										<div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
											<ReactQuill
												theme="bubble"
												value={notice.description}
												readOnly={true}
												className="view_editor"
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="py-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center">
						<div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
							<Bell className="w-8 h-8" />
						</div>
						<h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
							No notices published
						</h3>
						<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
							Publish an official notification or circular to display on the portal.
						</p>
						<button
							onClick={() => setOpenModal(true)}
							className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-sm transition-colors"
						>
							<Plus className="w-4 h-4" />
							<span>Publish First Notice</span>
						</button>
					</div>
				)}
			</div>

			{/* Edit/Create Notice Modal */}
			<ModalNoticeEdit
				open={openModal || !!editNotice}
				closed={() => {
					setOpenModal(false);
					setEditNotice(null);
					refetch();
				}}
				data={editNotice}
			/>
		</div>
	);
};

export default Notice;
