"use client";

import React, { useState } from "react";
import { PlusIcon, ScrollText, Search } from "lucide-react";
import DocumentCard from "../Documents/DocumentCard";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import {
	useDeleteAgmMomDocsMutation,
	useGetAllAgmMomDocsQuery,
} from "@/store/feature/document-feature";
import { ModalDocumentsAgmMom } from "../Modals/ModalDocuments";

const AgmMom = () => {
	const [openModal, setOpenModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { data, isLoading, refetch } = useGetAllAgmMomDocsQuery({});
	const [
		deleteAgmMom,
		{ isLoading: deleteLoading },
	] = useDeleteAgmMomDocsMutation();
	const [editAgmMomDocs, setEditAgmMomDocs] = useState<any>();

	if (isLoading) {
		return <Loading />;
	}

	const handelDelete = async (id: string) => {
		if (!window.confirm("Permanently delete this AGM Minutes of Meeting record?")) return;
		const res = await deleteAgmMom(id);
		if (res?.data?.success) {
			toast.success("Document deleted successfully");
			refetch();
		}
	};

	const docs = (data?.response || []).filter((item: any) =>
		item.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="w-full space-y-6">
			{/* Command Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
							<ScrollText className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
								AGM Minutes of Meeting (MOM)
							</h1>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Annual General Meeting proceedings, resolutions, committee appointments, and transcripts.
							</p>
						</div>
					</div>
				</div>

				<button
					onClick={() => {
						setEditAgmMomDocs(null);
						setOpenModal(true);
					}}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm active:scale-95"
				>
					<PlusIcon className="h-4 w-4" />
					<span>Upload AGM Minutes</span>
				</button>
			</div>

			{/* Main Card */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
				{/* Toolbar */}
				<div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search AGM minutes by year or agenda..."
							className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
						/>
					</div>

					<div className="text-xs text-slate-500 dark:text-slate-400">
						Total Records: <strong className="text-slate-900 dark:text-slate-100">{docs.length}</strong>
					</div>
				</div>

				{/* Grid */}
				<div className="p-4 sm:p-6">
					{docs.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{docs.map((item: any) => (
								<DocumentCard
									key={item.id || item.title}
									item={item}
									onEdit={setEditAgmMomDocs}
									onDelete={handelDelete}
									isDeleting={deleteLoading}
								/>
							))}
						</div>
					) : (
						<div className="py-16 text-center text-slate-500">
							<div className="flex flex-col items-center justify-center max-w-sm mx-auto">
								<div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
									<ScrollText className="h-6 w-6" />
								</div>
								<p className="font-semibold text-slate-900 dark:text-slate-100">No AGM minutes filed</p>
								<p className="text-xs text-slate-500 mt-1">
									Upload ratified annual general meeting minutes or secretarial reports.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{(openModal || !!editAgmMomDocs) && (
				<ModalDocumentsAgmMom
					open={openModal || !!editAgmMomDocs}
					closed={() => {
						setOpenModal(false);
						setEditAgmMomDocs(null);
						refetch();
					}}
					data={editAgmMomDocs}
				/>
			)}
		</div>
	);
};

export default AgmMom;
