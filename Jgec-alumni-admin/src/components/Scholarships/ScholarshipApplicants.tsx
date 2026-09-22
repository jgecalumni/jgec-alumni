"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, ChevronLeft, Trash2, Download, Loader2, RefreshCw, Search, LayoutGrid, List } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useGetScholarshipApplicationsQuery, useLazyGetScholarshipApplicationsQuery, useDeleteScholarshipApplicationMutation } from "@/store/feature/scholarship-feature";
import { ModalApplicantDetails } from "../Modals/ModalApplicantDetails";
import { Button } from "../ui/button";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ScholarshipApplicantsProps {
	id: string;
}

const ScholarshipApplicants: React.FC<ScholarshipApplicantsProps> = ({ id }: { id: string }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const initialPage = Number(searchParams.get("page")) || 1;
	const initialSearch = searchParams.get("search") || "";

	const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

	useEffect(() => {
		if (typeof window !== "undefined" && window.innerWidth >= 1024) {
			setViewMode("table");
		}
	}, []);

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
				setPage(1); // Reset page on new search
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
	const { data, error, isLoading, isError, refetch } = useGetScholarshipApplicationsQuery({
		id,
		page,
		limit: 10,
		search: debouncedSearchTerm,
	});

	const [triggerGetAll] = useLazyGetScholarshipApplicationsQuery();
	const [deleteApplication] = useDeleteScholarshipApplicationMutation();

	const handleExportToExcel = async () => {
		try {
			setIsExporting(true);
			const response = await triggerGetAll({ id, limit: 1000, page: 1, search: debouncedSearchTerm }).unwrap();
			const allData = response?.data || [];

			if (allData.length === 0) {
				toast.error("No data available to export");
				return;
			}

			// Format data for Excel
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
				views: [{ showGridLines: false }], // Hide default gridlines for cleaner look
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
					fgColor: { argb: "FF2E5B94" }, // Deeper professional blue
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
				const n = Number(val);
				return isNaN(n) ? val : n;
			};

			allData.forEach((applicant: any, index: number) => {
				const row = worksheet.addRow({
					slNo: index + 1,
					name: applicant.name,
					email: applicant.email,
					contact: applicant.contact?.toString(), // Keep as string to preserve leading zeros
					contactHome: applicant.contactHome?.toString(), // Keep as string
					dob: applicant.dob,
					studentId: applicant.studentId?.toString(), // Keep as string to prevent scientific notation
					department: applicant.department,
					intakeYear: num(applicant.jgecIntakeYear),
					passingYear: num(applicant.jgecPassingYear),
					// Clean up any weird newlines in the address that cause massive row heights
					address: (applicant.residentialAddress || "").toString().replace(/[\r\n]+/g, ", "),
					fatherOccupation: applicant.fatherOccupation,
					familyMembers: num(applicant.numberofdirectfamilyMembers),
					earningMembers: num(applicant.totalEarningMembers),
					familyIncome: num(applicant.totalFamilyIncome),
					memberIncome: num(applicant.eachFamilyIncome),
					percentage12th: num(applicant.percentHigherSecondary),
					sem1: num(applicant.sem_1st),
					sem2: num(applicant.sem_2nd),
					sem3: num(applicant.sem_3rd),
					sem4: num(applicant.sem_4th),
					sem5: num(applicant.sem_5th),
					average: num(applicant.average),
					extraCurricular: (applicant.extraCurricularActivities || "").toString().replace(/[\r\n]+/g, ", "),
					achievement: (applicant.specialAchievement || "").toString().replace(/[\r\n]+/g, ", "),
					jobCampusing: applicant.jobCampusing,
					documentUrl: getDocumentUrl(applicant.document),
				});

				const isEven = index % 2 === 0;

				row.eachCell((cell, colNumber) => {
					// Zebra striping
					cell.fill = {
						type: "pattern",
						pattern: "solid",
						fgColor: { argb: isEven ? "FFF8FAFC" : "FFFFFFFF" }, // Very subtle slate-50 for even rows
					};

					// Borders
					cell.border = {
						top: { style: "thin", color: { argb: "FFE2E8F0" } },
						left: { style: "thin", color: { argb: "FFE2E8F0" } },
						bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
						right: { style: "thin", color: { argb: "FFE2E8F0" } },
					};

					// Basic font styling
					cell.font = {
						size: 11,
						name: "Calibri",
						color: { argb: "FF333333" }
					};

					// Smart alignment: Center numbers/small fields, Left align longer text
					// Columns like Sl No(1), DOB(6), Intake(9), Passing(10), Semesters(18-23)
					const centerCols = [1, 4, 5, 6, 8, 9, 10, 13, 14, 17, 18, 19, 20, 21, 22, 23, 26];

					// Do not wrap text for Extracurricular (24), Special Achievement (25), and URL (27)
					const noWrapCols = [24, 25, 27];

					cell.alignment = {
						vertical: "top", // Align top so long addresses don't push other fields down weirdly
						horizontal: centerCols.includes(colNumber) ? "center" : "left",
						wrapText: !noWrapCols.includes(colNumber)
					};
				});
			});

			// Optional: Auto-freeze the top header row so it stays visible while scrolling
			worksheet.views = [
				{ state: 'frozen', ySplit: 1, showGridLines: false }
			];

			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
			const scholarshipName = response?.ScholarshipName || `Scholarship_Applicants_${id}`;
			const safeName = scholarshipName.toString().replace(/[^a-zA-Z0-9_\- ]/g, "_");
			saveAs(blob, `${safeName}.xlsx`);
			toast.success("Exported successfully!");
		} catch (err) {
			console.error(err);
			toast.error("Failed to export to Excel");
		} finally {
			setIsExporting(false);
		}
	};

	const handleDelete = async (applicantId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (!window.confirm("Are you sure you want to delete this application?")) return;

		try {
			setDeletingId(applicantId);
			await deleteApplication(applicantId).unwrap();
			toast.success("Application deleted successfully");
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to delete application");
		} finally {
			setDeletingId(null);
		}
	};

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch applicants");
		}
		if (data) {
			setTotalPages(data?.totalPages || 1);
		}
	}, [isError, error, data]);
	console.log("DATA:", data);


	if (isLoading) {
		return <Loading />;
	}

	const applicants = data?.data || [];

	return (
		<>
			{/* Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="icon"
						onClick={() => router.back()}
						className="h-10 w-10 rounded-full border-border/50 bg-card hover:bg-muted shadow-sm transition-all hover:-translate-x-1"
					>
						<ChevronLeft size={20} className="text-foreground" />
					</Button>
					<div className="flex flex-col">
						<h1 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground">Scholarship Applicants</h1>
						<p className="text-muted-foreground mt-1 text-sm lg:text-base">Review the applications for this scholarship.</p>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto mt-4 lg:mt-0">
					<Button
						onClick={() => refetch()}
						variant="outline"
						className="w-full sm:w-auto gap-2 transition-all shadow-sm hover:shadow"
					>
						<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
						Refresh
					</Button>
					<Button
						onClick={handleExportToExcel}
						disabled={isExporting || applicants.length === 0}
						className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2 transition-all shadow hover:shadow-md"
					>
						{isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
						Export to Excel
					</Button>
				</div>
			</div>

			<div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl overflow-hidden mb-8">
				<div className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border/50 bg-muted/10">
					<div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full md:w-auto">
						<div className="text-sm sm:text-lg font-semibold text-foreground flex-1 min-w-[120px]">
							Total Applicants: {data?.docCount || 0}
						</div>
						<div className="flex items-center bg-muted/40 rounded-lg p-1 border border-border/50">
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
						<div className="text-xs sm:text-sm text-muted-foreground font-medium whitespace-nowrap px-3 py-1.5 bg-muted/40 rounded-full border border-border/50 shadow-inner">
							Showing <span className="text-foreground font-bold">{applicants.length}</span> results
						</div>
					</div>

					<div className="relative w-full flex-1">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-4 w-4 text-muted-foreground" />
						</div>
						<input
							type="text"
							placeholder="Search by name..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
						/>
					</div>
				</div>

				{/* Table View */}
				{viewMode === "table" && (
					<div className="overflow-x-auto no-scrollbar">
						<table className="w-full text-sm text-left text-muted-foreground">
							<thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50 backdrop-blur-md sticky top-0">
								<tr>
									<th scope="col" className="px-6 py-4 font-bold tracking-wider">Sl No.</th>
									<th scope="col" className="px-6 py-4 font-bold tracking-wider">Applicant Name</th>
									<th scope="col" className="px-6 py-4 font-bold tracking-wider">Email Address</th>
									<th scope="col" className="px-6 py-4 font-bold tracking-wider">Student ID</th>
									<th scope="col" className="px-6 py-4 font-bold tracking-wider">Department</th>
									<th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/50">
								{applicants.length > 0 ? (
									applicants.map((applicant: any, index: number) => (
										<tr
											key={applicant.id || index}
											onClick={() => setSelectedApplicant(applicant)}
											className="bg-transparent text-foreground cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors duration-200 group"
										>
											<td className="px-6 py-4 font-medium">
												{(page - 1) * 10 + index + 1}
											</td>
											<td className="px-6 py-4 font-medium max-w-xs truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
												{applicant.name}
											</td>
											<td className="px-6 py-4 truncate max-w-xs">{applicant.email}</td>
											<td className="px-6 py-4 font-medium">{applicant.studentId}</td>
											<td className="px-6 py-4">{applicant.department}</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-end gap-2">
													<button
														title="View Full Details"
														className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 rounded-lg transition-all"
														onClick={(e) => {
															e.stopPropagation();
															setSelectedApplicant(applicant);
														}}
													>
														<Eye size={16} />
														<span>View</span>
													</button>
													<button
														title="Delete Application"
														disabled={deletingId === (applicant._id || applicant.id)}
														className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-lg transition-all disabled:opacity-50"
														onClick={(e) => handleDelete(applicant._id || applicant.id, e)}
													>
														{deletingId === (applicant._id || applicant.id) ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
														<span>Delete</span>
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6} className="px-6 py-12 text-center text-muted-foreground bg-transparent">
											<div className="flex flex-col items-center justify-center space-y-3">
												<svg className="w-12 h-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
												</svg>
												<span>No applications found for this scholarship.</span>
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
						{applicants.length > 0 ? (
							applicants.map((applicant: any, index: number) => (
								<div
									key={applicant.id || index}
									onClick={() => setSelectedApplicant(applicant)}
									className="flex flex-col gap-3 p-5 rounded-2xl border bg-background border-border/50 cursor-pointer hover:border-indigo-500/30 hover:shadow-md transition-all duration-200 shadow-sm"
								>
									<div className="flex items-start justify-between gap-3 border-b border-border/30 pb-3">
										<div className="flex flex-col min-w-0">
											<h3 className="font-semibold text-base text-foreground truncate">{applicant.name}</h3>
											<p className="text-sm text-muted-foreground mt-0.5 truncate">{applicant.email}</p>
										</div>
										<div className="shrink-0 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50 text-xs font-medium text-foreground">
											#{(page - 1) * 10 + index + 1}
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3 text-sm">
										<div className="flex flex-col">
											<span className="text-xs text-muted-foreground">Student ID</span>
											<span className="font-medium text-foreground truncate">{applicant.studentId}</span>
										</div>
										<div className="flex flex-col">
											<span className="text-xs text-muted-foreground">Department</span>
											<span className="font-medium text-foreground truncate">{applicant.department}</span>
										</div>
									</div>

									<div className="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-border/30">
										<button
											className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 rounded-lg transition-all flex-1 flex justify-center items-center gap-2 text-sm font-medium"
											onClick={(e) => {
												e.stopPropagation();
												setSelectedApplicant(applicant);
											}}>
											<Eye size={16} />
											<span>View</span>
										</button>
										<button
											disabled={deletingId === (applicant._id || applicant.id)}
											className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-lg transition-all flex-1 flex justify-center items-center gap-2 text-sm font-medium disabled:opacity-50"
											onClick={(e) => handleDelete(applicant._id || applicant.id, e)}>
											{deletingId === (applicant._id || applicant.id) ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
											<span>Delete</span>
										</button>
									</div>
								</div>
							))
						) : (
							<div className="py-12 text-center text-muted-foreground bg-transparent">
								<div className="flex flex-col items-center justify-center space-y-3">
									<svg className="w-12 h-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
									<span>No applications found for this scholarship.</span>
								</div>
							</div>
						)}
					</div>
				)}

				<div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-border/50 bg-muted/10 ${applicants.length > 0 ? "flex" : "hidden"}`}>
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

			<ModalApplicantDetails
				open={!!selectedApplicant}
				applicant={selectedApplicant}
				closed={() => setSelectedApplicant(null)}
			/>
		</>
	);
};

export default ScholarshipApplicants;
