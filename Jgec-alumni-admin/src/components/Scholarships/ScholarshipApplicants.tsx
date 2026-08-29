"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, ChevronLeft, Trash2, Download, Loader2, RefreshCw, Search } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useGetScholarshipApplicationsQuery, useLazyGetScholarshipApplicationsQuery, useDeleteScholarshipApplicationMutation } from "@/store/feature/scholarship-feature";
import { ModalApplicantDetails } from "../Modals/ModalApplicantDetails";
import { Button } from "../ui/button";
import * as XLSX from "xlsx";

interface ScholarshipApplicantsProps {
	id: string;
}

const ScholarshipApplicants: React.FC<ScholarshipApplicantsProps> = ({ id }) => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
	const [isExporting, setIsExporting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
			setPage(1); // Reset page on new search
		}, 500);
		return () => clearTimeout(timer);
	}, [searchTerm]);

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

			const formattedData = allData.map((applicant: any, index: number) => ({
				"Sl No.": index + 1,
				"Name": applicant.name,
				"Email": applicant.email,
				"Contact Number": applicant.contact,
				"Home Contact": applicant.contactHome,
				"DOB": applicant.dob,
				"Student ID": applicant.studentId,
				"Department": applicant.department,
				"Intake Year": applicant.jgecIntakeYear,
				"Passing Year": applicant.jgecPassingYear,
				"Residential Address": applicant.residentialAddress,
				"Father's Occupation": applicant.fatherOccupation,
				"Total Family Members": applicant.numberofdirectfamilyMembers,
				"Earning Members": applicant.totalEarningMembers,
				"Total Family Income": applicant.totalFamilyIncome,
				"Each Member Income": applicant.eachFamilyIncome,
				"12th Percentage": applicant.percentHigherSecondary,
				"1st Sem": applicant.sem_1st,
				"2nd Sem": applicant.sem_2nd,
				"3rd Sem": applicant.sem_3rd,
				"4th Sem": applicant.sem_4th,
				"5th Sem": applicant.sem_5th,
				"Average (SGPA/CGPA)": applicant.average,
				"Extracurricular Activities": applicant.extraCurricularActivities,
				"Special Achievement": applicant.specialAchievement,
				"Job Campusing": applicant.jobCampusing,
				"Document URL": getDocumentUrl(applicant.document),
			}));

			const worksheet = XLSX.utils.json_to_sheet(formattedData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
			XLSX.writeFile(workbook, `Scholarship_Applicants_${id}.xlsx`);
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
						onClick={() => router.push("/scholarship")}
						className="h-10 w-10 rounded-full border-border/50 bg-card hover:bg-muted shadow-sm transition-all hover:-translate-x-1"
					>
						<ChevronLeft size={20} className="text-foreground" />
					</Button>
					<div className="flex flex-col">
						<h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-foreground">Scholarship Applicants</h1>
						<p className="text-muted-foreground mt-1 text-sm lg:text-base">Review the applications for this scholarship.</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => refetch()}
						variant="outline"
						className="gap-2 transition-all shadow-sm hover:shadow"
					>
						<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
						Refresh
					</Button>
					<Button
						onClick={handleExportToExcel}
						disabled={isExporting || (data?.docCount || 0) === 0}
						className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 transition-all shadow hover:shadow-md"
					>
						{isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
						Export to Excel
					</Button>
				</div>
			</div>

			<div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl overflow-hidden mb-8">
				<div className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border/50 bg-muted/10">
					<div className="flex items-center gap-4">
						<div className="text-lg font-semibold text-foreground">
							Total Applicants: {data?.docCount || 0}
						</div>
						<div className="text-sm text-muted-foreground font-medium whitespace-nowrap px-4 py-1.5 bg-muted/40 rounded-full border border-border/50 shadow-inner">
							Showing <span className="text-foreground font-bold">{applicants.length}</span> results
						</div>
					</div>
					
					<div className="relative w-full md:w-72">
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
				
				<div className={`flex items-center justify-between p-6 border-t border-border/50 bg-muted/10 ${applicants.length > 0 ? "block" : "hidden"}`}>
					<div className="text-sm text-muted-foreground">
						Showing Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => {setPage(page - 1),window.scrollTo(0, 0)}}
							disabled={page === 1}
							className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-95">
							<ArrowLeft size={16} />
							Prev
						</button>
						<button
							onClick={() => {setPage(page + 1),window.scrollTo(0, 0)}}
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
