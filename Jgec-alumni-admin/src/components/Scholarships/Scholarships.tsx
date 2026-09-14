"use client";

import React, { useEffect, useState } from "react";
import { ScholarshipDetails } from "@/lib/ScholarshipData";
import Image from "next/image";
import { ArrowLeft, ArrowRight, PlusIcon, Pencil, Trash2, Users, LayoutGrid, List } from "lucide-react";
import dynamic from "next/dynamic";
import {
	useAllScholarshipsQuery,
	useDeleteScholarshipsMutation,
} from "@/store/feature/scholarship-feature";
import { useGetCountQuery } from "@/store/feature/dashboard-feature";
import toast from "react-hot-toast";
import { debounce } from "@/utils";
import Loading from "@/app/loading";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ModalScholarshipDetails } from "../Modals/ModalDetails";
const ModalScholarshipEdit = dynamic(
	() => import("../Modals/ModalScholarshipEdit"),
	{ ssr: false }
);
const ModalGlobalSettings = dynamic(
	() => import("../Modals/ModalGlobalSettings"),
	{ ssr: false }
);

const Scholarships: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	
	const initialPage = Number(searchParams.get("page")) || 1;
	const initialSearch = searchParams.get("search") || "";

	const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
	const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

	useEffect(() => {
		if (typeof window !== "undefined" && window.innerWidth >= 1024) {
			setViewMode("table");
		}
	}, []);

	const [openModal, setOpenModal] = useState(false);
	const [openSettingsModal, setOpenSettingsModal] = useState(false);
	const [openScholarshipModal, setOpenScholarshipModal] = useState(false);
	const [editScholarship, setEditScholarship] = useState<any>();
	const [scholarshipDetails, setScholarshipDetails] = useState<any>();
	const [page, setPage] = useState<number>(initialPage);
	const [totalPages, setTotalPages] = useState<number>(1);
	const { data, error, isLoading, isError, refetch } = useAllScholarshipsQuery({
		page: page,
		search: searchQuery,
	});
	const { data: countData } = useGetCountQuery();
	
	const [
		deleteScholarship,
		{ isLoading: isDeleting, error: deleteError, isError: isDeleteError },
	] = useDeleteScholarshipsMutation();

	useEffect(() => {
		if (isError) {
			toast.error(
				(error as any)?.data?.message || "Failed to fetch scholarships"
			);
		}
		if (isDeleteError) {
			toast.error(
				(deleteError as any)?.data?.message || "Failed to delete Scholarship"
			);
		}
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [isError, error, data, isDeleteError, deleteError]);

	if (isLoading || isDeleteError) {
		return <Loading />;
	}

	const handleSearch = debounce(async (e: any) => {
		const searchValue = e.target.value;
		setSearchQuery(searchValue);
		setPage(1);
		
		const params = new URLSearchParams(searchParams.toString());
		if (searchValue) {
			params.set("search", searchValue);
		} else {
			params.delete("search");
		}
		params.set("page", "1");
		router.replace(`${pathname}?${params.toString()}`);
	}, 1000);

	const handleDelete = async (id: string) => {
		const res = await deleteScholarship(id);
		if (res?.data?.success) {
			toast.success("Scholarship deleted successfully");
			refetch();
		}
	};

	return (
		<>
			{/* Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
				<div className="flex flex-col">
					<h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-foreground">Scholarships</h1>
					<p className="text-muted-foreground mt-1 text-sm lg:text-base">Manage and view scholarship programs.</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
					<button
						className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:shadow active:scale-95 text-sm flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all duration-300 font-medium"
						onClick={() => setOpenSettingsModal(true)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
						<span>Global Settings</span>
					</button>
					<button
						className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 text-sm flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl transition-all duration-300 font-medium"
						onClick={() => setOpenModal(true)}>
						<PlusIcon className="font-bold" size={18} />
						<span>Add Scholarship</span>
					</button>
				</div>
			</div>
			
			<div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl overflow-hidden mb-8">
				<div className="p-4 sm:p-6 flex flex-col lg:flex-row space-y-4 lg:space-y-0 items-center justify-between border-b border-border/50 bg-muted/10">
					<label
						htmlFor="table-search"
						className="sr-only">
						Search
					</label>
					<div className="relative group w-full flex-1 mr-0 lg:mr-4">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
							<svg
								className="w-5 h-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors"
								aria-hidden="true"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>
						<input
							type="text"
							id="table-search"
							defaultValue={searchQuery}
							onChange={handleSearch}
							className="block w-full py-2.5 pl-10 pr-4 text-sm text-foreground bg-background border border-border rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm outline-none"
							placeholder="Search for scholarships..."
						/>
					</div>
					<div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 w-full lg:w-auto mt-2 lg:mt-0">
						<div className="flex items-center bg-muted/40 rounded-lg p-1 border border-border/50 mr-1 sm:mr-2">
							<button
								onClick={() => setViewMode("table")}
								className={`p-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
								title="Table View">
								<List size={16} />
							</button>
							<button
								onClick={() => setViewMode("grid")}
								className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
								title="Grid View">
								<LayoutGrid size={16} />
							</button>
						</div>
						<div className="text-xs sm:text-sm text-muted-foreground font-medium whitespace-nowrap px-3 sm:px-4 py-1.5 bg-muted/40 rounded-full border border-border/50 shadow-inner flex-1 text-center">
							Total Applicants: <span className="text-foreground font-bold">{countData?.data?.scholarshipApplications || 0}</span>
						</div>
						<div className="text-xs sm:text-sm text-muted-foreground font-medium whitespace-nowrap px-3 sm:px-4 py-1.5 bg-muted/40 rounded-full border border-border/50 shadow-inner flex-1 text-center">
							Showing <span className="text-foreground font-bold">{data?.scholarships?.length || 0}</span> results
						</div>
					</div>
				</div>
				
				{/* Table View */}
				{viewMode === "table" && (
				<div className="overflow-x-auto no-scrollbar">
					<table className="w-full text-sm text-left text-muted-foreground">
						<thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50 backdrop-blur-md sticky top-0">
							<tr>
								<th
									scope="col"
									className="px-6 py-4 font-bold tracking-wider">
									Scholarship name
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-bold tracking-wider">
									Amount Details
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-bold tracking-wider">
									Provider Name
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-bold tracking-wider">
									Provider Image
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-bold tracking-wider text-center">
									Applicants
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-bold tracking-wider text-right">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/50">
							{data?.scholarships?.length > 0 ? (
								data.scholarships.map((item: any) => (
									<tr
										onClick={() => {
											setOpenScholarshipModal(!openScholarshipModal),
												setScholarshipDetails(item);
										}}
										key={item.id}
										className={`cursor-pointer transition-colors duration-200 group ${item.isActive === false ? "bg-muted/20 text-muted-foreground cursor-not-allowed" : "bg-transparent text-foreground hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"}`}>
										<th
											scope="row"
											className="px-6 py-4 truncate lg:whitespace-normal font-medium max-w-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
											title={item.name}>
											{item.name}
										</th>
										<td className="px-6 py-4 truncate max-w-xs">
											{item.amountDetails}
										</td>
										<td className="px-6 py-4">{item.providerName}</td>
										<td className="px-6 py-4">
											<div className="relative h-12 w-24 bg-white/10 rounded-md overflow-hidden flex items-center justify-center p-1 border border-border/50">
												<Image
													src={item.providerImage}
													alt={item.provideName || item.providerName || "Provider"}
													fill
													className="object-contain"
												/>
											</div>
										</td>
										<td className="px-6 py-4 text-center font-semibold text-indigo-600 dark:text-indigo-400">
											{item._count?.scholarshipApplicants || 0}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-end gap-2">
												<button
													title="View Applicants"
													className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 rounded-lg transition-all"
													onClick={(e) => {
														e.stopPropagation();
														router.push(`/scholarship/applications/${item.id}`);
													}}>
													<Users size={18} />
												</button>
												<button
													title="Edit Scholarship"
													className="p-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-lg transition-all"
													onClick={(e) => {
														e.stopPropagation();
														setEditScholarship(item);
													}}>
													<Pencil size={18} />
												</button>
												<button
													title="Delete Scholarship"
													className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-lg transition-all"
													onClick={(e) => {
														e.stopPropagation(), handleDelete(item.id);
													}}>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-12 text-center text-muted-foreground bg-transparent">
										<div className="flex flex-col items-center justify-center space-y-3">
											<svg className="w-12 h-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
											</svg>
											<span>No scholarships found.</span>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				)}

				{/* Card View */}
				{viewMode === "grid" && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/5">
					{data?.scholarships?.length > 0 ? (
						data.scholarships.map((item: any) => (
							<div
								key={item.id}
								onClick={() => {
									setOpenScholarshipModal(!openScholarshipModal);
									setScholarshipDetails(item);
								}}
								className={`flex flex-col gap-3 p-5 rounded-2xl border cursor-pointer transition-all duration-200 shadow-sm ${
									item.isActive === false
										? "bg-muted/20 border-border/40 opacity-70"
										: "bg-background border-border/50 hover:border-indigo-500/30 hover:shadow-md"
								}`}>
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-base text-foreground truncate">{item.name}</h3>
										<p className="text-sm text-muted-foreground mt-0.5">{item.providerName}</p>
									</div>
									<div className="relative h-10 w-20 bg-muted/10 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-border/30 shrink-0">
										<Image
											src={item.providerImage}
											alt={item.provideName || item.providerName || "Provider"}
											fill
											className="object-contain"
										/>
									</div>
								</div>
								
								<div className="flex items-start justify-between gap-4 mt-2 pt-3 border-t border-border/30">
									<div className="flex flex-col flex-1 min-w-0">
										<span className="text-xs text-muted-foreground">Amount</span>
										<span className="text-sm font-medium text-foreground mt-0.5">{item.amountDetails}</span>
									</div>
									<div className="flex flex-col items-center justify-center shrink-0 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20 min-w-[72px]">
										<span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-500 dark:text-indigo-400 mb-0.5">Applicants</span>
										<span className="text-xl font-black text-indigo-600 dark:text-indigo-300 leading-none">
											{item._count?.scholarshipApplicants || 0}
										</span>
									</div>
								</div>

								<div className="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-border/30">
									<button
										className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 rounded-lg transition-all flex-1 flex justify-center items-center"
										onClick={(e) => {
											e.stopPropagation();
											router.push(`/scholarship/applications/${item.id}`);
										}}>
										<Users size={18} />
									</button>
									<button
										className="p-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-lg transition-all flex-1 flex justify-center items-center"
										onClick={(e) => {
											e.stopPropagation();
											setEditScholarship(item);
										}}>
										<Pencil size={18} />
									</button>
									<button
										className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-lg transition-all flex-1 flex justify-center items-center"
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(item.id);
										}}>
										<Trash2 size={18} />
									</button>
								</div>
							</div>
						))
					) : (
						<div className="py-12 text-center text-muted-foreground bg-transparent">
							<div className="flex flex-col items-center justify-center space-y-3">
								<svg className="w-12 h-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
								<span>No scholarships found.</span>
							</div>
						</div>
					)}
				</div>
				)}
				
				<div
					className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-border/50 bg-muted/10 ${
						data?.scholarships?.length > 0 ? "flex" : "hidden"
					}`}>
					<div className="text-sm text-muted-foreground">
						Showing Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => {
								const newPage = page - 1;
								setPage(newPage);
								const params = new URLSearchParams(searchParams.toString());
								params.set("page", newPage.toString());
								router.replace(`${pathname}?${params.toString()}`);
								window.scrollTo(0, 0);
							}}
							disabled={page === 1}
							className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-95">
							<ArrowLeft size={16} />
							Prev
						</button>
						<button
							onClick={() => {
								const newPage = page + 1;
								setPage(newPage);
								const params = new URLSearchParams(searchParams.toString());
								params.set("page", newPage.toString());
								router.replace(`${pathname}?${params.toString()}`);
								window.scrollTo(0, 0);
							}}
							disabled={page === totalPages}
							className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-95">
							Next
							<ArrowRight size={16} />
						</button>
					</div>
				</div>
			</div>
			
			{openScholarshipModal && (
				<ModalScholarshipDetails
					details={scholarshipDetails}
					open={openScholarshipModal || !!scholarshipDetails}
					closed={() => {
						setOpenScholarshipModal(false), setScholarshipDetails(null);
					}}
				/>
			)}
			{(openModal || !!editScholarship) && (
				<ModalScholarshipEdit
					open={openModal || !!editScholarship}
					closed={() => {
						setOpenModal(false);
						setEditScholarship(null);
						refetch();
					}}
					details={editScholarship}
				/>
			)}
			{openSettingsModal && (
				<ModalGlobalSettings
					open={openSettingsModal}
					closed={() => {
						setOpenSettingsModal(false);
						refetch();
					}}
				/>
			)}
		</>
	);
};

export default Scholarships;
