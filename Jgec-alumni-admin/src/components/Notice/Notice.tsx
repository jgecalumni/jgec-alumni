"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MdDeleteForever } from "react-icons/md";
import dynamic from "next/dynamic";
import { useDeleteNoticeMutation, useGetAllNoticesQuery } from "@/store/feature/notice-feature";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import { format } from "date-fns"
import { FaEdit } from "react-icons/fa";
const ModalNoticeEdit = dynamic(() => import('../Modals/ModalNoticeEdit'), { ssr: false });
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Notice: React.FC = () => {
	const [openModal, setOpenModal] = useState(false);
	const [editNotice, setEditNotice] = useState<INoticeType | null>(null);
	const { data, isLoading, isError, error, refetch } = useGetAllNoticesQuery({});
	const [deleteNotice, { isLoading: deleteLoading, isError: deleteIsError, error: deleteError }] = useDeleteNoticeMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data.message || "Failed to fetch data");
		}
		if (deleteIsError) {
			toast.error((deleteError as any)?.data.message || "Failed to delete notice");
		}
	}, [isError, error, deleteIsError, deleteError]);

	if (isLoading || deleteLoading) {
		return <Loading />
	}

	const handelDelete = async (id: string) => {
		const res = await deleteNotice(id);
		if (res?.data?.success) {
			toast.success("Notice deleted successfully");
			refetch();
		}
	}

	const notices = data?.notices;

	return (
		<>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/40 dark:via-background dark:to-purple-950/40 border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm relative overflow-hidden group">
				{/* Decorative shapes */}
				<div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>
				<div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>
				
				<div className="flex flex-col mb-4 sm:mb-0 relative z-10">
					<h1 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground flex items-center gap-3">
						<span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Notice Board</span>
					</h1>
					<p className="text-muted-foreground mt-1.5 font-medium">Create, manage and view all platform announcements.</p>
				</div>
				<button 
					className="relative z-10 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-background" 
					onClick={() => setOpenModal(true)} 
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
					Publish Notice
				</button>
			</div>
			
			<div className="w-full">
				{notices && notices.length > 0 ? (
					<div className="relative border-l border-border ml-4 lg:ml-8 space-y-8 pb-8">
						{notices.map((notice, index) => (
							<div key={index} className="relative pl-8 lg:pl-10">
								{/* Timeline Dot */}
								<div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background shadow-sm"></div>
								
								{/* Content Card */}
								<div className="rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
									<div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
										<div className="font-medium text-sm text-muted-foreground">
											{format(new Date(notice.date), 'dd MMM, yyyy')}
										</div>
										<div className="flex items-center gap-3 mt-3 sm:mt-0">
											<button
												className="p-2 text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
												onClick={() => setEditNotice(notice)}
												title="Edit Notice"
											>
												<FaEdit size={16} />
											</button>
											<button
												className="p-2 text-rose-600 bg-rose-100 dark:bg-rose-500/20 dark:text-rose-400 rounded-md hover:bg-rose-200 dark:hover:bg-rose-500/30 transition-colors"
												onClick={() => handelDelete(notice.id)}
												title="Delete Notice"
											>
												<MdDeleteForever size={18} />
											</button>
										</div>
									</div>
									<div className="px-6 py-5">
										<Link
											href={notice?.link || "#"}
											target="_blank"
											rel="noreferrer"
											className="inline-block text-xl font-bold text-foreground hover:text-primary transition-colors mb-4"
										>
											{notice.title}
										</Link>
										<div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
											<ReactQuill
												theme="bubble"
												value={notice.description}
												readOnly={true}
												className="view_editor"
											/>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="w-full h-[40vh] flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-card/50">
						<h3 className="text-xl font-medium text-foreground">No notices found</h3>
						<p className="text-muted-foreground mt-2">Create a notice to see it here.</p>
					</div>
				)}
			</div>
			
			<ModalNoticeEdit
				open={openModal || !!editNotice}
				closed={() => {
					setOpenModal(false);
					setEditNotice(null);
					refetch();
				}}
				data={editNotice}
			/>
		</>
	);
};

export default Notice;
