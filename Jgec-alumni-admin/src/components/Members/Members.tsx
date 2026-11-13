"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
	Search,
	List,
	LayoutGrid,
	Eye,
	ArrowLeft,
	ArrowRight,
	Users,
	GraduationCap,
	Building2,
	Mail,
	IdCard,
	Filter,
	X,
} from "lucide-react";

import Loading from "@/app/loading";
import { useGetAllMembersQuery } from "@/store/feature/member-feature";
import { debounce } from "@/utils";
import { ModalMemberDetails } from "../Modals/ModalDetails";

const Members: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [editMembers, setEditMembers] = useState<any>(null);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	useEffect(() => {
		if (typeof window !== "undefined" && window.innerWidth < 1024) {
			setViewMode("grid");
		}
	}, []);

	// Notice: passed dynamic page state so pagination operates correctly
	const { data, error, isLoading, isError, refetch } = useGetAllMembersQuery({
		page: page,
		search: searchQuery,
	});

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch members");
		}
		if (data) {
			setTotalPages(data?.totalPages || 1);
		}
	}, [isError, error, data]);

	const handleSearch = debounce(async (e: any) => {
		const searchValue = e.target.value;
		setSearchQuery(searchValue);
		setPage(1);
	}, 600);

	if (isLoading) {
		return <Loading />;
	}

	const membersList = data?.members || [];
	const totalCount = data?.totalMembers || membersList.length;

	return (
		<div className="w-full space-y-6 animate-in fade-in duration-200">
			
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
				<div>
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
						<Users className="w-3.5 h-3.5" />
						<span>Alumni Community Registry</span>
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
						Alumni Directory
					</h1>
					<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
						Manage, inspect, and verify registered alumni graduates and faculty members.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
						Total Members: <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span>
					</div>
				</div>
			</div>

			{/* Search & Layout Controls */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
				
				{/* Search Input */}
				<div className="relative w-full sm:max-w-md">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
					<input
						type="text"
						id="table-search"
						onChange={handleSearch}
						placeholder="Search by name, email, student ID, department..."
						className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
					/>
				</div>

				{/* View Mode Toggle */}
				<div className="flex items-center gap-2 w-full sm:w-auto justify-end">
					<div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
						<button
							onClick={() => setViewMode("table")}
							className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
								viewMode === "table"
									? "bg-white dark:bg-slate-900 text-primary shadow-sm"
									: "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
							}`}
							title="Table View"
						>
							<List className="w-4 h-4" />
							<span className="hidden sm:inline">Table</span>
						</button>
						<button
							onClick={() => setViewMode("grid")}
							className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
								viewMode === "grid"
									? "bg-white dark:bg-slate-900 text-primary shadow-sm"
									: "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
							}`}
							title="Grid View"
						>
							<LayoutGrid className="w-4 h-4" />
							<span className="hidden sm:inline">Cards</span>
						</button>
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm overflow-hidden">
				
				{/* 1. Table View */}
				{viewMode === "table" && (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
								<tr>
									<th className="px-5 py-3.5">Alumnus Name</th>
									<th className="px-5 py-3.5">Email Address</th>
									<th className="px-5 py-3.5">Student ID</th>
									<th className="px-5 py-3.5">Department</th>
									<th className="px-5 py-3.5">Graduation</th>
									<th className="px-5 py-3.5 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
								{membersList.length > 0 ? (
									membersList.map((item: any) => (
										<tr
											key={item.id || item._id}
											className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
										>
											{/* Name & Photo */}
											<td className="px-5 py-3.5">
												<div className="flex items-center gap-3">
													<div className="relative w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
														{item.photo ? (
															<Image
																src={item.photo}
																alt={item.name || "Member"}
																fill
																className="object-cover"
															/>
														) : (
															<span>{item.name ? item.name.charAt(0).toUpperCase() : "U"}</span>
														)}
													</div>
													<div className="min-w-0">
														<p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm">
															{item.name}
														</p>
														<span className="text-[11px] text-slate-400">
															Verified Alumni
														</span>
													</div>
												</div>
											</td>

											{/* Email */}
											<td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 text-xs">
												{item.email || "—"}
											</td>

											{/* Student ID */}
											<td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-xs font-mono">
												{item.studentId || "—"}
											</td>

											{/* Department */}
											<td className="px-5 py-3.5">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
													{item.department || "General"}
												</span>
											</td>

											{/* Passing Year */}
											<td className="px-5 py-3.5">
												<span className="text-xs font-semibold text-primary">
													{item.passingYear ? `Batch '${String(item.passingYear).slice(-2)}` : "—"}
												</span>
											</td>

											{/* Actions */}
											<td className="px-5 py-3.5 text-right">
												<button
													onClick={() => setEditMembers(item)}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
													title="Inspect Full Profile"
												>
													<Eye className="w-3.5 h-3.5" />
													<span>View Details</span>
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
											No members match the query.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{/* 2. Grid / Card View */}
				{viewMode === "grid" && (
					<div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{membersList.length > 0 ? (
							membersList.map((item: any) => (
								<div
									key={item.id || item._id}
									onClick={() => setEditMembers(item)}
									className="group p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
								>
									<div>
										<div className="flex items-start gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-800">
											<div className="relative w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-sm">
												{item.photo ? (
													<Image
														src={item.photo}
														alt={item.name || "Member"}
														fill
														className="object-cover"
													/>
												) : (
													<span>{item.name ? item.name.charAt(0).toUpperCase() : "U"}</span>
												)}
											</div>
											<div className="min-w-0 flex-1">
												<h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
													{item.name}
												</h3>
												<p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
													{item.email}
												</p>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-2.5 py-3 text-xs">
											<div>
												<span className="text-[11px] text-slate-400">Department</span>
												<p className="font-medium text-slate-800 dark:text-slate-200 truncate mt-0.5">
													{item.department || "General"}
												</p>
											</div>
											<div>
												<span className="text-[11px] text-slate-400">Graduation</span>
												<p className="font-semibold text-primary mt-0.5">
													{item.passingYear ? `Batch '${String(item.passingYear).slice(-2)}` : "—"}
												</p>
											</div>
											<div className="col-span-2">
												<span className="text-[11px] text-slate-400">Student ID</span>
												<p className="font-mono text-slate-700 dark:text-slate-300 truncate mt-0.5">
													{item.studentId || "—"}
												</p>
											</div>
										</div>
									</div>

									<div className="pt-3 border-t border-slate-100 dark:border-slate-800">
										<button
											onClick={(e) => {
												e.stopPropagation();
												setEditMembers(item);
											}}
											className="w-full py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 transition-colors flex items-center justify-center gap-1.5"
										>
											<Eye className="w-3.5 h-3.5" />
											<span>Inspect Member Record</span>
										</button>
									</div>
								</div>
							))
						) : (
							<div className="col-span-full py-12 text-center text-slate-400 text-sm">
								No registered alumni members found.
							</div>
						)}
					</div>
				)}

				{/* Pagination Footer */}
				{totalPages > 1 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50/60 dark:bg-slate-900/60 text-xs text-slate-500">
						<div>
							Showing Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of{" "}
							<span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => {
									setPage((prev) => Math.max(prev - 1, 1));
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								disabled={page === 1}
								className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
							>
								<ArrowLeft className="w-3.5 h-3.5" />
								<span>Prev</span>
							</button>
							<button
								onClick={() => {
									setPage((prev) => Math.min(prev + 1, totalPages));
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								disabled={page === totalPages}
								className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
							>
								<span>Next</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Member Details Modal */}
			{editMembers && (
				<ModalMemberDetails
					open={!openModal}
					closed={() => {
						setOpenModal(false);
						setEditMembers(null);
						refetch();
					}}
					details={editMembers}
				/>
			)}
		</div>
	);
};

export default Members;
