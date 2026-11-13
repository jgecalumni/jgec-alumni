"use client";

import React, { useEffect, useState } from "react";
import {
	ArrowLeft,
	ArrowRight,
	Eye,
	ChevronLeft,
	Trash2,
	Download,
	Loader2,
	RefreshCw,
	Search,
	LayoutGrid,
	List,
	Mail,
	GraduationCap,
	IndianRupee,
	Award
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
	useGetScholarshipApplicationsQuery,
	useLazyGetScholarshipApplicationsQuery,
	useDeleteScholarshipApplicationMutation
} from "@/store/feature/scholarship-feature";
import { ModalApplicantDetails } from "../Modals/ModalApplicantDetails";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ScholarshipApplicantsProps {
	id: string;
}

const getInitials = (name: string) => {
	if (!name) return "ST";
	const parts = name.trim().split(" ");
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ScholarshipApplicants: React.FC<ScholarshipApplicantsProps> = ({ id }: { id: string }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const initialPage = Number(searchParams.get("page")) || 1;
	const initialSearch = searchParams.get("search") || "";

	const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

	const [page, setPage] = useState<number>(initialPage);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
	const [isExporting, setIsExporting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState(initialSearch);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (debouncedSearchTerm !== searchTerm) {
				setDebouncedSearchTerm(searchTerm);
				setPage(1);
				const params = new URLSearchParams(searchParams.toString());
				if (searchTerm) {
					params.set("search", searchTerm);
				} else {
					params.delete("search");
				}
				params.set("page", "1");
				router.replace(`${pathname}?${params.toString()}`);
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [searchTerm, debouncedSearchTerm, pathname, router, searchParams]);

	const { data, isLoading, refetch } = useGetScholarshipApplicationsQuery({
		id,
		page,
		limit: 10,
		search: debouncedSearchTerm,
	});

	const [triggerGetAll] = useLazyGetScholarshipApplicationsQuery();
	const [deleteApplication] = useDeleteScholarshipApplicationMutation();

	useEffect(() => {
		if (data) {
			setTotalPages(data?.totalPages || 1);
		}
	}, [data]);

	const handleExportToExcel = async () => {
		try {
			setIsExporting(true);
			const response = await triggerGetAll({ id, limit: 1000, page: 1, search: debouncedSearchTerm }).unwrap();
			const allData = response?.data || [];

			if (allData.length === 0) {
				toast.error("No data available to export");
				return;
			}

			const getDocumentUrl = (docPath: string | undefined | null) => {
				if (!docPath) return "N/A";
				if (docPath.startsWith("http://") || docPath.startsWith("https://")) {
					return docPath;
				}
				const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
				const normalizedDocPath = docPath.startsWith("/") ? docPath : `/${docPath}`;
				return `${baseUrl}${normalizedDocPath}`;
			};

			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("Applicants", {
				views: [{ showGridLines: false }],
			});

			worksheet.columns = [
				{ header: "Sl No.", key: "slNo", width: 8 },
				{ header: "Name", key: "name", width: 30 },
				{ header: "Email", key: "email", width: 35 },
				{ header: "Contact Number", key: "contact", width: 18 },
				{ header: "Home Contact", key: "contactHome", width: 18 },
				{ header: "DOB", key: "dob", width: 15 },
				{ header: "Student ID", key: "studentId", width: 20 },
				{ header: "Department", key: "department", width: 15 },
				{ header: "Intake Year", key: "intakeYear", width: 12 },
				{ header: "Passing Year", key: "passingYear", width: 12 },
				{ header: "Residential Address", key: "address", width: 50 },
				{ header: "Father's Occupation", key: "fatherOccupation", width: 20 },
				{ header: "Total Family Members", key: "familyMembers", width: 20 },
				{ header: "Earning Members", key: "earningMembers", width: 18 },
				{ header: "Total Family Income", key: "familyIncome", width: 20 },
				{ header: "Each Member Income", key: "memberIncome", width: 20 },
				{ header: "12th Percentage", key: "percentage12th", width: 15 },
				{ header: "1st Sem", key: "sem1", width: 10 },
				{ header: "2nd Sem", key: "sem2", width: 10 },
				{ header: "3rd Sem", key: "sem3", width: 10 },
				{ header: "4th Sem", key: "sem4", width: 10 },
				{ header: "5th Sem", key: "sem5", width: 10 },
				{ header: "Average (SGPA)", key: "average", width: 15 },
				{ header: "Extracurriculars", key: "extraCurricular", width: 50 },
				{ header: "Special Achievement", key: "achievement", width: 50 },
				{ header: "Job Campusing", key: "jobCampusing", width: 15 },
				{ header: "Document URL", key: "documentUrl", width: 40 },
			];

			const headerRow = worksheet.getRow(1);
			headerRow.height = 35;
			headerRow.eachCell((cell) => {
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FF2E5B94" },
				};
				cell.font = {
					color: { argb: "FFFFFFFF" },
					bold: true,
					size: 11,
					name: "Calibri"
				};
				cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
				cell.border = {
					top: { style: "thin", color: { argb: "FF1A385E" } },
					left: { style: "thin", color: { argb: "FF1A385E" } },
					bottom: { style: "thin", color: { argb: "FF1A385E" } },
					right: { style: "thin", color: { argb: "FF1A385E" } },
				};
			});

			const num = (val: any) => {
				if (val === null || val === undefined || val === "") return "";
				const parsed = Number(val);
				return isNaN(parsed) ? val : parsed;
			};

			allData.forEach((applicant: any, index: number) => {
				const row = worksheet.addRow({
					slNo: index + 1,
					name: applicant.name || "",
					email: applicant.email || "",
					contact: applicant.contactNumber || "",
					contactHome: applicant.contactNumberHome || "",
					dob: applicant.dob ? new Date(applicant.dob).toLocaleDateString() : "",
					studentId: applicant.studentId || "",
					department: applicant.department || "",
					intakeYear: applicant.intakeYear || "",
					passingYear: applicant.passingYear || "",
					address: applicant.address || "",
					fatherOccupation: applicant.fatherOccupation || "",
					familyMembers: num(applicant.totalFamilyMembers),
					earningMembers: num(applicant.earningMembers),
					familyIncome: num(applicant.totalFamilyIncome),
					memberIncome: num(applicant.eachMemberIncome),
					percentage12th: num(applicant.percentage12th),
					sem1: num(applicant.sem1SGPA),
					sem2: num(applicant.sem2SGPA),
					sem3: num(applicant.sem3SGPA),
					sem4: num(applicant.sem4SGPA),
					sem5: num(applicant.sem5SGPA),
					average: num(applicant.average),
					extraCurricular: applicant.extraCurricular || "",
					achievement: applicant.achievement || "",
					jobCampusing: applicant.jobCampusing ? "Yes" : "No",
					documentUrl: getDocumentUrl(applicant.document),
				});

				row.height = 24;
				const isEven = index % 2 === 0;
				row.eachCell((cell, colNumber) => {
					cell.font = { name: "Calibri", size: 10 };
					cell.alignment = { vertical: "middle" };
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: isEven ? "FFFFFFFF" : "FFF8FAFC" }
					};
					cell.border = {
						top: { style: "thin", color: { argb: "FFE2E8F0" } },
						left: { style: "thin", color: { argb: "FFE2E8F0" } },
						bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
						right: { style: "thin", color: { argb: "FFE2E8F0" } }
					};

					if (colNumber === 1 || (colNumber >= 17 && colNumber <= 23)) {
						cell.alignment = { vertical: "middle", horizontal: "center" };
					}
				});
			});

			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
			saveAs(blob, `scholarship_applicants_${id}_${new Date().toISOString().split("T")[0]}.xlsx`);
			toast.success("Excel exported successfully");
		} catch (err: any) {
			toast.error(err?.message || "Failed to export Excel");
		} finally {
			setIsExporting(false);
		}
	};

	const handleDelete = async (applicantId: string, applicantName: string) => {
		if (!window.confirm(`Delete application for "${applicantName}"? This cannot be undone.`)) {
			return;
		}
		setDeletingId(applicantId);
		try {
			await deleteApplication(applicantId).unwrap();
			toast.success("Applicant deleted successfully");
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to delete applicant");
		} finally {
			setDeletingId(null);
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	const applicants = data?.data || [];

	return (
		<div className="w-full space-y-6">
			{/* Command Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center gap-3">
					<button
						onClick={() => router.push("/scholarship")}
						className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs shrink-0"
						title="Back to Scholarships"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
							Applicant Review
						</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							Candidate submissions for Fund #{id}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2.5 w-full sm:w-auto">
					<button
						onClick={() => refetch()}
						className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
					>
						<RefreshCw className="h-4 w-4 text-slate-500" />
						<span>Sync Records</span>
					</button>

					<button
						onClick={handleExportToExcel}
						disabled={isExporting || applicants.length === 0}
						className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs disabled:opacity-50"
					>
						{isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
						<span>Export Excel</span>
					</button>
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
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search by student name, email, roll number..."
							className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
						/>
					</div>

					<div className="flex items-center justify-between sm:justify-end gap-3">
						<div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
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
						</div>

						<span className="text-xs text-slate-500 dark:text-slate-400">
							Applicants: <strong className="text-slate-900 dark:text-slate-100">{data?.totalCount || applicants.length}</strong>
						</span>
					</div>
				</div>

				{/* Grid View (High-End Redesign) */}
				{viewMode === "grid" && (
					<div className="p-4 sm:p-6">
						{applicants.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
								{applicants.map((applicant: any, index: number) => {
									const applicantId = applicant._id || applicant.id;
									const initials = getInitials(applicant.name);
									const incomeFormatted = applicant.totalFamilyIncome
										? `₹${Number(applicant.totalFamilyIncome).toLocaleString("en-IN")}`
										: "Not Disclosed";

									return (
										<div
											key={applicantId || index}
											onClick={() => setSelectedApplicant(applicant)}
											className="border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 bg-white dark:bg-slate-900 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group relative"
										>
											<div className="space-y-4">
												{/* Header: Dept Badge & High-Contrast Roll Number */}
												<div className="flex items-center justify-between gap-2">
													<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
														{applicant.department || "Engineering"}
														{applicant.passingYear ? ` · Class of '${String(applicant.passingYear).slice(-2)}` : ""}
													</span>

													<span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 shrink-0">
														{applicant.studentId || `#${index + 1}`}
													</span>
												</div>

												{/* Student Identity Row */}
												<div className="flex items-center gap-3">
													<div className="h-11 w-11 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20 shadow-2xs">
														{initials}
													</div>
													<div className="min-w-0 flex-1">
														<h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight truncate group-hover:text-primary transition-colors">
															{applicant.name}
														</h3>
														<p className="text-xs text-slate-400 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
															<Mail className="h-3 w-3 shrink-0 opacity-70" />
															<span className="truncate">{applicant.email}</span>
														</p>
													</div>
												</div>

												{/* Academic & Financial Stats Box */}
												<div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
													<div className="space-y-0.5">
														<span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
															<IndianRupee className="h-3 w-3" />
															<span>Family Income</span>
														</span>
														<p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
															{incomeFormatted}
														</p>
													</div>
													<div className="space-y-0.5 text-right">
														<span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-end gap-1">
															<Award className="h-3 w-3" />
															<span>Performance</span>
														</span>
														<p className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
															{applicant.average ? `${applicant.average} SGPA` : "Under Review"}
														</p>
													</div>
												</div>
											</div>

											{/* Footer Action Bar */}
											<div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														setSelectedApplicant(applicant);
													}}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
												>
													<Eye className="h-3.5 w-3.5" />
													<span>Review Dossier</span>
												</button>

												<button
													type="button"
													disabled={deletingId === applicantId}
													onClick={(e) => {
														e.stopPropagation();
														handleDelete(applicantId, applicant.name);
													}}
													className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
													title="Delete Application"
												>
													<Trash2 className="h-4 w-4" />
												</button>
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
									<p className="font-semibold text-slate-900 dark:text-slate-100">No applicants submitted yet</p>
									<p className="text-xs text-slate-500 mt-1">
										Candidate applications will appear here once submitted.
									</p>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Table View */}
				{viewMode === "table" && (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
								<tr>
									<th className="py-4 px-5">#</th>
									<th className="py-4 px-5">Applicant Details</th>
									<th className="py-4 px-5">Roll / Student ID</th>
									<th className="py-4 px-5">Department & Batch</th>
									<th className="py-4 px-5">Family Income</th>
									<th className="py-4 px-5 text-center">Score / CGPA</th>
									<th className="py-4 px-5 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{applicants.length > 0 ? (
									applicants.map((applicant: any, index: number) => {
										const applicantId = applicant._id || applicant.id;
										const initials = getInitials(applicant.name);
										const incomeFormatted = applicant.totalFamilyIncome
											? `₹${Number(applicant.totalFamilyIncome).toLocaleString("en-IN")}`
											: "—";

										return (
											<tr
												key={applicantId || index}
												onClick={() => setSelectedApplicant(applicant)}
												className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
											>
												<td className="py-4 px-5 text-slate-400 text-xs font-mono">
													{(page - 1) * 10 + index + 1}
												</td>

												<td className="py-4 px-5">
													<div className="flex items-center gap-3">
														<div className="h-8 w-8 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
															{initials}
														</div>
														<div className="min-w-0">
															<div className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-primary transition-colors">
																{applicant.name}
															</div>
															<div className="text-xs text-slate-400 truncate mt-0.5">
																{applicant.email}
															</div>
														</div>
													</div>
												</td>

												<td className="py-4 px-5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
													{applicant.studentId || "—"}
												</td>

												<td className="py-4 px-5">
													<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
														{applicant.department || "Engineering"}
														{applicant.passingYear ? ` · '${String(applicant.passingYear).slice(-2)}` : ""}
													</span>
												</td>

												<td className="py-4 px-5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
													{incomeFormatted}
												</td>

												<td className="py-4 px-5 text-center">
													<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 font-mono">
														{applicant.average ? `${applicant.average} SGPA` : "Review"}
													</span>
												</td>

												<td className="py-4 px-5 text-right">
													<div className="flex items-center justify-end gap-1.5">
														<button
															type="button"
															title="View Dossier"
															onClick={(e) => {
																e.stopPropagation();
																setSelectedApplicant(applicant);
															}}
															className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
														>
															<Eye className="h-3.5 w-3.5" />
															<span>Review</span>
														</button>
														<button
															type="button"
															title="Delete Application"
															disabled={deletingId === applicantId}
															onClick={(e) => {
																e.stopPropagation();
																handleDelete(applicantId, applicant.name);
															}}
															className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
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
										<td colSpan={7} className="py-14 text-center text-slate-500">
											<div className="flex flex-col items-center justify-center max-w-sm mx-auto">
												<div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
													<GraduationCap className="h-6 w-6" />
												</div>
												<p className="font-semibold text-slate-900 dark:text-slate-100">No applicants submitted yet</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
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

			{/* Modal Applicant Details */}
			{selectedApplicant && (
				<ModalApplicantDetails
					open={!!selectedApplicant}
					closed={() => setSelectedApplicant(null)}
					applicant={selectedApplicant}
				/>
			)}
		</div>
	);
};

export default ScholarshipApplicants;
