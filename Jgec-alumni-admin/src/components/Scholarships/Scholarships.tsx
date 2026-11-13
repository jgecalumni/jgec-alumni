"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
	ArrowLeft,
	ArrowRight,
	PlusIcon,
	Pencil,
	Trash2,
	Users,
	LayoutGrid,
	List,
	Settings2,
	Search,
	GraduationCap,
	IndianRupee,
	Building2,
	ExternalLink,
	UserCheck,
	Award
} from "lucide-react";
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

const parseGrantDetails = (text: string) => {
	if (!text) return { amount: null, description: "Criteria upon application" };
	const clean = text.trim();
	const isNumeric = /^\s*(?:INR|Rs\.?|₹)?\s*[\d,]+\s*$/i.test(clean);
	if (isNumeric) {
		const num = clean.replace(/[^0-9]/g, "");
		return {
			amount: num ? `₹${Number(num).toLocaleString("en-IN")}` : clean,
			description: "Annual Scholarship Award"
		};
	}
	const match = clean.match(/(?:INR|Rs\.?|₹)\s*([\d,]+)/i);
	if (match) {
		return {
			amount: `₹${Number(match[1].replace(/,/g, "")).toLocaleString("en-IN")}`,
			description: clean
		};
	}
	return { amount: null, description: clean };
};

const Scholarships: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const initialPage = Number(searchParams.get("page")) || 1;
	const initialSearch = searchParams.get("search") || "";

	const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");

	const [openModal, setOpenModal] = useState(false);
	const [openSettingsModal, setOpenSettingsModal] = useState(false);
	const [openScholarshipModal, setOpenScholarshipModal] = useState(false);
	const [editScholarship, setEditScholarship] = useState<any>();
	const [scholarshipDetails, setScholarshipDetails] = useState<any>();
	const [page, setPage] = useState<number>(initialPage);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const { data, error, isLoading, isError, refetch } = useAllScholarshipsQuery({
		page: page,
		search: searchQuery,
	});
	const { data: countData } = useGetCountQuery();

	const [
		deleteScholarship,
		{ isError: isDeleteError, error: deleteError },
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
			setTotalPages(data?.totalPages || 1);
		}
	}, [isError, error, data, isDeleteError, deleteError]);

	if (isLoading) {
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
	}, 600);

	const handleDelete = async (id: string, name: string) => {
		if (!window.confirm(`Are you sure you want to delete scholarship "${name}"? This cannot be undone.`)) {
			return;
		}
		setDeletingId(id);
		try {
			const res = await deleteScholarship(id);
			if (res?.data?.success) {
				toast.success("Scholarship deleted successfully");
				refetch();
			}
		} finally {
			setDeletingId(null);
		}
	};

	const scholarshipsList = data?.scholarships || [];

	return (
		<div className="w-full space-y-6">
			{/* Command Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
							<GraduationCap className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
								Scholarships Program
							</h1>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Manage alumni-endowed student funds, grant policies, and applicant reviews.
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2.5 w-full lg:w-auto">
					<button
						onClick={() => setOpenSettingsModal(true)}
						className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
					>
						<Settings2 className="h-4 w-4 text-slate-500" />
						<span>Global Rules</span>
					</button>

					<button
						onClick={() => setOpenModal(true)}
						className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-xs active:scale-95"
					>
						<PlusIcon className="h-4 w-4" />
						<span>Add Scholarship</span>
					</button>
				</div>
			</div>

			{/* Filter & Metric Ribbon */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Funds</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{scholarshipsList.length}</p>
					</div>
					<div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
						<GraduationCap className="h-4 w-4" />
					</div>
				</div>
				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Applicants</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{countData?.data?.scholarshipApplications || 0}</p>
					</div>
					<div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
						<Users className="h-4 w-4" />
					</div>
				</div>
				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Endowment Tier</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">Merit & Need</p>
					</div>
					<div className="h-9 w-9 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
						<IndianRupee className="h-4 w-4" />
					</div>
				</div>
				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Benefactors</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">Alumni Batches</p>
					</div>
					<div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
						<Building2 className="h-4 w-4" />
					</div>
				</div>
			</div>

			{/* Main Card */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
				{/* Toolbar */}
				<div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
						<input
							type="text"
							defaultValue={searchQuery}
							onChange={handleSearch}
							placeholder="Search scholarship by fund name or provider..."
							className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
						/>
					</div>

					<div className="flex items-center justify-between sm:justify-end gap-2.5">
						<div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
							<button
								onClick={() => setViewMode("table")}
								className={`p-1.5 rounded-md text-xs font-medium transition-all ${
									viewMode === "table"
										? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
										: "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
								}`}
								title="Table View"
							>
								<List className="h-4 w-4" />
							</button>
							<button
								onClick={() => setViewMode("grid")}
								className={`p-1.5 rounded-md text-xs font-medium transition-all ${
									viewMode === "grid"
										? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
										: "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
								}`}
								title="Grid View"
							>
								<LayoutGrid className="h-4 w-4" />
							</button>
						</div>

						<span className="text-xs text-slate-500 dark:text-slate-400">
							Total: <strong className="text-slate-900 dark:text-slate-100">{scholarshipsList.length}</strong>
						</span>
					</div>
				</div>

				{/* Table View (World-Class Redesign) */}
				{viewMode === "table" && (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
								<tr>
									<th className="py-4 px-6 w-[28%]">Scholarship Fund</th>
									<th className="py-4 px-6 w-[24%]">Benefactor / Sponsor</th>
									<th className="py-4 px-6 w-[26%]">Grant Specifications</th>
									<th className="py-4 px-6 text-center w-[12%]">Applicants</th>
									<th className="py-4 px-4 text-center w-[10%]">Status</th>
									<th className="py-4 px-6 text-right w-[10%]">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{scholarshipsList.length > 0 ? (
									scholarshipsList.map((item: any) => {
										const applicantCount = item._count?.scholarshipApplicants || 0;
										const isActive = item.isActive !== false;
										const grant = parseGrantDetails(item.amountDetails);

										return (
											<tr
												key={item.id}
												onClick={() => {
													setScholarshipDetails(item);
													setOpenScholarshipModal(true);
												}}
												className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
											>
												{/* Scholarship Fund Name */}
												<td className="py-4 px-6 align-top">
													<div className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
														{item.name}
													</div>
													<div className="mt-1">
														<span className="inline-block text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
															#{String(item.id).padStart(2, "0")}
														</span>
													</div>
												</td>

												{/* Benefactor Identity */}
												<td className="py-4 px-6 align-top">
													<div className="flex items-center gap-3">
														<div className="relative h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 shadow-2xs">
															{item.providerImage ? (
																<Image
																	src={item.providerImage}
																	alt={item.providerName || "Benefactor"}
																	fill
																	className="object-cover"
																/>
															) : (
																<div className="w-full h-full flex items-center justify-center text-slate-400">
																	<Building2 className="h-4 w-4" />
																</div>
															)}
														</div>
														<div className="min-w-0">
															<p className="font-medium text-slate-900 dark:text-slate-100 text-xs leading-snug line-clamp-2" title={item.providerName}>
																{item.providerName || "General Alumni Fund"}
															</p>
															<p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
																Alumni Benefactor
															</p>
														</div>
													</div>
												</td>

												{/* Grant Specifications (Clean & Formatted) */}
												<td className="py-4 px-6 align-top">
													<div className="space-y-1">
														{grant.amount && (
															<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 font-mono">
																{grant.amount}
															</span>
														)}
														<p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2" title={grant.description}>
															{grant.description}
														</p>
													</div>
												</td>

												{/* Applicants Chip */}
												<td className="py-4 px-6 align-top text-center">
													<button
														onClick={(e) => {
															e.stopPropagation();
															router.push(`/scholarship/applications/${item.id}`);
														}}
														className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-blue-300 dark:hover:bg-primary/30 transition-colors border border-primary/20"
														title="Review Candidates"
													>
														<Users className="h-3.5 w-3.5 shrink-0" />
														<span>{applicantCount} applied</span>
														<ExternalLink className="h-3 w-3 opacity-60 shrink-0" />
													</button>
												</td>

												{/* Status Badge */}
												<td className="py-4 px-4 align-top text-center">
													<span
														className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
															isActive
																? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
																: "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
														}`}
													>
														<span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
														<span>{isActive ? "Active" : "Archived"}</span>
													</span>
												</td>

												{/* Action Controls */}
												<td className="py-4 px-6 align-top text-right">
													<div className="flex items-center justify-end gap-1">
														<button
															type="button"
															title="Edit details"
															onClick={(e) => {
																e.stopPropagation();
																setEditScholarship(item);
															}}
															className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
														>
															<Pencil className="h-4 w-4" />
														</button>
														<button
															type="button"
															title="Delete scholarship"
															disabled={deletingId === item.id}
															onClick={(e) => {
																e.stopPropagation();
																handleDelete(item.id, item.name);
															}}
															className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
														>
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={6} className="py-14 text-center text-slate-500">
											<div className="flex flex-col items-center justify-center max-w-sm mx-auto">
												<div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
													<GraduationCap className="h-6 w-6" />
												</div>
												<p className="font-semibold text-slate-900 dark:text-slate-100">No scholarships found</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{/* Grid View (Enhanced) */}
				{viewMode === "grid" && (
					<div className="p-4 sm:p-6">
						{scholarshipsList.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
								{scholarshipsList.map((item: any) => {
									const applicantCount = item._count?.scholarshipApplicants || 0;
									const isActive = item.isActive !== false;
									const grant = parseGrantDetails(item.amountDetails);

									return (
										<div
											key={item.id}
											onClick={() => {
												setScholarshipDetails(item);
												setOpenScholarshipModal(true);
											}}
											className="border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 bg-white dark:bg-slate-900 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group relative"
										>
											<div className="space-y-4">
												{/* Card Header: Status & Applicant Chip */}
												<div className="flex items-center justify-between gap-2">
													<span
														className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
															isActive
																? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50"
																: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
														}`}
													>
														<span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
														<span>{isActive ? "Active Endowment" : "Archived Fund"}</span>
													</span>

													<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-700">
														<Users className="h-3 w-3 text-slate-400" />
														<span>{applicantCount} applied</span>
													</span>
												</div>

												{/* Title */}
												<div>
													<h3
														className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]"
														title={item.name}
													>
														{item.name}
													</h3>
												</div>

												{/* Benefactor Identity */}
												<div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
													<div className="relative h-11 w-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 shadow-2xs">
														{item.providerImage ? (
															<Image
																src={item.providerImage}
																alt={item.providerName || "Benefactor"}
																fill
																className="object-cover"
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center text-slate-400">
																<Building2 className="h-5 w-5" />
															</div>
														)}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sponsored By</p>
														<p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
															{item.providerName || "JGEC Alumni Association"}
														</p>
													</div>
												</div>

												{/* Grant Specifications Box */}
												<div className="rounded-xl p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/40 space-y-1">
													<div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
														<Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
														<span>Grant Specification</span>
													</div>
													{grant.amount ? (
														<div>
															<p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
																{grant.amount}
															</p>
															{grant.description !== "Annual Scholarship Award" && (
																<p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed mt-1">
																	{grant.description}
																</p>
															)}
														</div>
													) : (
														<p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
															{grant.description}
														</p>
													)}
												</div>
											</div>

											{/* Footer Action Bar */}
											<div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														router.push(`/scholarship/applications/${item.id}`);
													}}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
												>
													<UserCheck className="h-3.5 w-3.5" />
													<span>Review Applications ({applicantCount})</span>
												</button>

												<div className="flex items-center gap-1">
													<button
														type="button"
														title="Edit details"
														onClick={(e) => {
															e.stopPropagation();
															setEditScholarship(item);
														}}
														className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
													>
														<Pencil className="h-4 w-4" />
													</button>
													<button
														type="button"
														title="Delete scholarship"
														disabled={deletingId === item.id}
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(item.id, item.name);
														}}
														className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="py-16 text-center text-slate-500">
								<div className="flex flex-col items-center justify-center max-w-sm mx-auto">
									<div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
										<GraduationCap className="h-6 w-6" />
									</div>
									<p className="font-semibold text-slate-900 dark:text-slate-100">No scholarships found</p>
									<p className="text-xs text-slate-500 mt-1">
										Try clearing your search query or create a new scholarship fund.
									</p>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Pagination */}
				<div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
					<span>
						Page <strong className="text-slate-900 dark:text-slate-100">{page}</strong> of{" "}
						<strong className="text-slate-900 dark:text-slate-100">{totalPages}</strong>
					</span>
					<div className="flex items-center gap-2">
						<button
							disabled={page <= 1}
							onClick={() => {
								const prev = Math.max(1, page - 1);
								setPage(prev);
								const params = new URLSearchParams(searchParams.toString());
								params.set("page", String(prev));
								router.replace(`${pathname}?${params.toString()}`);
							}}
							className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							<ArrowLeft className="h-3.5 w-3.5" />
							<span>Prev</span>
						</button>
						<button
							disabled={page >= totalPages}
							onClick={() => {
								const next = page + 1;
								setPage(next);
								const params = new URLSearchParams(searchParams.toString());
								params.set("page", String(next));
								router.replace(`${pathname}?${params.toString()}`);
							}}
							className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							<span>Next</span>
							<ArrowRight className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>

			{/* Dialogs */}
			{openScholarshipModal && (
				<ModalScholarshipDetails
					details={scholarshipDetails}
					open={openScholarshipModal || !!scholarshipDetails}
					closed={() => {
						setOpenScholarshipModal(false);
						setScholarshipDetails(null);
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
		</div>
	);
};

export default Scholarships;
