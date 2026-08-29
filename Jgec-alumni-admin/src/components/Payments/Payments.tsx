/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
	Upload,
	X,
	DollarSign,
	Users,
	TrendingUp,
	Calendar,
	ChevronDown,
	Check,
	ArrowLeft,
	ArrowRight,
	Loader,
	Download,
} from "lucide-react";
import {
	useAddContributionsMutation,
	useGetAllContributionsQuery,
} from "@/store/feature/contribution-feature";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import Loading from "@/app/loading";

interface ContributionRow {
	SlNo?: string | number;
	NameOfAlumnus?: string;
	GraduationYear?: string | number;
	AmountINR?: number | string;
	DepositedOn?: string | number;
	MobileNo?: string | number;
	Email?: string;
}

const Payments: React.FC = () => {
	const [createContribution, { error, isError, isLoading: isUploadLoading }] =
		useAddContributionsMutation({});
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [excelData, setExcelData] = useState<ContributionRow[]>([]);
	const [selectedRow, setSelectedRow] = useState<ContributionRow | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedYear, setSelectedYear] = useState<string>("all");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const {
		data,
		refetch,
		isLoading: isdataLoading,
	} = useGetAllContributionsQuery({
		search: searchTerm || "",
		page: page,
		limit: 10,
		graduationYear: selectedYear !== "all" ? selectedYear : "",
	});
	console.log(data);

	const contris = data?.data || [];
	const stats = data?.stats || {
		totalAmount: 0,
		totalContributions: 0,
		uniqueBatches: 0,
		monthlyContributions: 0,
	};
	useEffect(() => {
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [data]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const graduationYears = [...(data?.allGraduationYears || [])].sort((a, b) => a - b);


	const handleUploadClick = () => fileInputRef.current?.click();

	const handleRowClick = (row: any) => {
		const contributionRow: ContributionRow = {
			SlNo: row.slNo,
			NameOfAlumnus: row.nameOfAluminus,
			GraduationYear: row.graduationYear,
			AmountINR: row.amount,
			DepositedOn: row.depositedOn,
			MobileNo: row.mobileNo,
			Email: row.email,
		};
		setSelectedRow(contributionRow);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedRow(null);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const reader = new FileReader();
			reader.onload = async (evt) => {
				const bstr = evt.target?.result as ArrayBuffer;
				const workbook = XLSX.read(bstr, { type: "array" });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];

				const sheetData = XLSX.utils.sheet_to_json(worksheet, {
					header: 1,
				}) as any[][];

				const rows = sheetData.slice(1);

				function excelDateToJSDate(serial: number) {
					if (typeof serial !== "number") return serial;
					const utc_days = Math.floor(serial - 25569);
					const utc_value = utc_days * 86400;
					const date_info = new Date(utc_value * 1000);
					const day = date_info.getDate().toString().padStart(2, "0");
					const month = (date_info.getMonth() + 1).toString().padStart(2, "0");
					const year = date_info.getFullYear();
					return `${day}-${month}-${year}`;
				}

				const formattedData = rows.map((r) => ({
					SlNo: r[0] || "null",
					NameOfAlumnus: r[1] || "null",
					GraduationYear: r[2] || "null",
					AmountINR: r[3] || "null",
					DepositedOn:
						typeof r[4] === "number" ? excelDateToJSDate(r[4]) : r[4] || "null",
					MobileNo: r[5] || "null",
					Email: r[6] || "null",
				}));

				const res = await createContribution(formattedData).unwrap();

				if (res.success) {
					refetch();
					toast.success("File Uploaded Successfully");
				}
			};

			reader.readAsArrayBuffer(file);
		} catch (err) {
			console.error("Error parsing Excel file:", err);
		} finally {
			e.target.value = "";
		}
	};

	const handleDownloadAll = async () => {
		try {
			if (!data?.pdfLinksAndNames) {
				toast.error("No receipts available to download");
				return;
			}

			toast.loading("Downloading receipts... Please wait", { id: "download" });

			const zip = new JSZip();
			let count = 0;
			const fileNameMap: Record<string, number> = {};

			for (const row of data.pdfLinksAndNames) {
				if (row.pdf) {
					try {
						const response = await fetch(row.pdf);
						if (!response.ok) throw new Error(`Failed to fetch ${row.pdf}`);
						const blob = await response.blob();

						// Create safe filename
						let baseName = `${row.name || "receipt"}_${row.graduationYear || ""
							}`
							.trim()
							.replace(/\s+/g, "_")
							.replace(/[^\w\-()_]/g, "");

						// Handle duplicates properly (allow duplicates but make them unique)
						if (fileNameMap[baseName]) {
							fileNameMap[baseName]++;
							baseName = `${baseName}(${fileNameMap[baseName]})`;
						} else {
							fileNameMap[baseName] = 1;
						}

						const fileName = `${baseName}.pdf`;
						zip.file(fileName, blob);
						count++;
					} catch (err) {
						console.error("Error downloading:", row.pdf, err);
					}
				}
			}

			if (count === 0) {
				toast.error("No valid receipt links found", { id: "download" });
				return;
			}

			// Generate and save ZIP
			const zipBlob = await zip.generateAsync({ type: "blob" });
			const today = new Date().toISOString().split("T")[0];
			saveAs(zipBlob, `Receipts_${today}.zip`);

			toast.success(`Downloaded ${count} receipts successfully`, {
				id: "download",
			});
		} catch (error) {
			console.error("Error in handleDownloadAll:", error);
			toast.error("Failed to download receipts", { id: "download" });
		}
	};

	if (isdataLoading) {
		return <Loading />;
	}

	return (
		<div className="w-full">
			{/* Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
				<div className="flex flex-col">
					<h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-foreground">Payments Dashboard</h1>
					<p className="text-muted-foreground mt-1 text-sm lg:text-base">Manage contributions and receipts.</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<button
						onClick={handleUploadClick}
						disabled={isUploadLoading}
						className={`bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white ${isUploadLoading ? "cursor-wait opacity-80" : "cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-95"} flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md duration-300`}>
						{isUploadLoading ? (
							<Loader
								className="animate-spin"
								size={18}
							/>
						) : (
							<Upload size={18} />
						)}

						<span>{isUploadLoading ? "Uploading..." : "Upload File"}</span>
					</button>
					<button
						onClick={handleDownloadAll}
						className="bg-card hover:bg-muted text-foreground border border-border/50 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 duration-300">
						<Download size={18} />
						<span>Download All</span>
					</button>

					<input
						ref={fileInputRef}
						type="file"
						accept=".xlsx, .xls"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{/* Total Amount Card */}
				<div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-3.5 rounded-xl group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
							<DollarSign
								size={26}
								className="text-emerald-600 dark:text-emerald-400"
							/>
						</div>
						<div className="text-xs font-bold bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full uppercase tracking-wider">
							Total
						</div>
					</div>
					<div className="space-y-1.5">
						<div className="text-sm font-medium text-muted-foreground">Total Amount</div>
						<div className="text-3xl font-extrabold text-foreground tracking-tight">
							₹ {stats.totalAmount.toLocaleString("en-IN")}
						</div>
					</div>
				</div>

				{/* Total Contributors Card */}
				<div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-blue-500/10 dark:bg-blue-500/20 p-3.5 rounded-xl group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
							<Users
								size={26}
								className="text-blue-600 dark:text-blue-400"
							/>
						</div>
						<div className="text-xs font-bold bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full uppercase tracking-wider">
							Count
						</div>
					</div>
					<div className="space-y-1.5">
						<div className="text-sm font-medium text-muted-foreground">
							Total Contributors
						</div>
						<div className="text-3xl font-extrabold text-foreground tracking-tight">{stats.totalContributions}</div>
					</div>
				</div>

				{/* Graduation Years Card */}
				<div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-purple-500/10 dark:bg-purple-500/20 p-3.5 rounded-xl group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
							<TrendingUp
								size={26}
								className="text-purple-600 dark:text-purple-400"
							/>
						</div>
						<div className="text-xs font-bold bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full uppercase tracking-wider">
							Years
						</div>
					</div>
					<div className="space-y-1.5">
						<div className="text-sm font-medium text-muted-foreground">Unique Batches</div>
						<div className="text-3xl font-extrabold text-foreground tracking-tight">{stats.uniqueBatches}</div>
					</div>
				</div>

				{/* This Month Card */}
				<div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-orange-500/10 dark:bg-orange-500/20 p-3.5 rounded-xl group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
							<Calendar
								size={26}
								className="text-orange-600 dark:text-orange-400"
							/>
						</div>
						<div className="text-xs font-bold bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full uppercase tracking-wider">
							Monthly
						</div>
					</div>
					<div className="space-y-1.5">
						<div className="text-sm font-medium text-muted-foreground">This Month</div>
						<div className="text-3xl font-extrabold text-foreground tracking-tight">
							{stats.monthlyContributions}
						</div>
					</div>
				</div>
			</div>

			{/* Table Section */}
			<div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl overflow-hidden mb-8">
				{/* Search Bar */}
				<div className="p-6 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between border-b border-border/50 bg-muted/10">
					<div className="flex flex-wrap items-center gap-4 flex-1">
						<div className="relative flex-1 max-w-md group">
							<svg
								className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-500 transition-colors"
								width="18"
								height="18"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								type="text"
								value={searchTerm}
								onChange={handleSearch}
								className="w-full pl-10 pr-4 py-2.5 text-sm text-foreground bg-background border border-border rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm outline-none"
								placeholder="Search by name, email or mobile..."
							/>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="min-w-[200px] justify-between bg-background border-border text-foreground font-medium rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all duration-300">
									{selectedYear === "all"
										? "All Graduation Years"
										: `Class of ${selectedYear}`}
									<ChevronDown className="ml-2 h-4 w-4 opacity-50" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuPortal>
								<DropdownMenuContent
									align="end"
									sideOffset={8}
									className="min-w-[220px] p-1.5 bg-popover rounded-xl shadow-xl border border-border/50 backdrop-blur-xl">
									<div className="max-h-[260px] overflow-y-auto no-scrollbar">
										<DropdownMenuItem
											onClick={() => setSelectedYear("all")}
											className="cursor-pointer text-popover-foreground hover:bg-muted focus:bg-muted rounded-lg py-2.5 font-medium transition-colors">
											<Check
												className={`mr-2 h-4 w-4 ${selectedYear === "all" ? "opacity-100 text-indigo-500" : "opacity-0"
													}`}
											/>
											All Graduation Years
										</DropdownMenuItem>

										{graduationYears.map((year: any) => (
											<DropdownMenuItem
												key={year}
												onClick={() => {
													setSelectedYear(year.toString());
												}}
												className="cursor-pointer text-popover-foreground hover:bg-muted focus:bg-muted rounded-lg py-2.5 font-medium transition-colors">
												<Check
													className={`mr-2 h-4 w-4 ${selectedYear === year.toString()
															? "opacity-100 text-indigo-500"
															: "opacity-0"
														}`}
												/>
												Class of {year}
											</DropdownMenuItem>
										))}
									</div>
								</DropdownMenuContent>
							</DropdownMenuPortal>
						</DropdownMenu>
					</div>

					<div className="text-sm text-muted-foreground font-medium whitespace-nowrap px-4 py-1.5 bg-muted/40 rounded-full border border-border/50 shadow-inner">
						Showing <span className="text-foreground font-bold">{contris.length}</span> of <span className="text-foreground font-bold">{stats.totalContributions}</span>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto no-scrollbar">
					<table className="w-full text-sm text-left text-muted-foreground">
						<thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50 backdrop-blur-md sticky top-0">
							<tr>
								<th className="px-6 py-4 font-bold tracking-wider">Sl. No</th>
								<th className="px-6 py-4 font-bold tracking-wider">Name of Alumnus</th>
								<th className="px-6 py-4 font-bold tracking-wider">Graduation Year</th>
								<th className="px-6 py-4 font-bold tracking-wider">Amount (INR)</th>
								<th className="px-6 py-4 font-bold tracking-wider">Deposited On</th>
								<th className="px-6 py-4 font-bold tracking-wider">Mobile No.</th>
								<th className="px-6 py-4 font-bold tracking-wider">Receipt</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/50">
							{contris.length > 0 ? (
								contris.map((row: any, index: number) => (
									<tr
										key={index}
										onClick={(e) => {
											e.stopPropagation();
											handleRowClick(row);
										}}
										className="bg-transparent text-foreground cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors duration-200 group">
										<td className="px-6 py-4 font-medium">
											{row.slNo}
										</td>
										<td className="px-6 py-4 font-medium text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
											{row.nameOfAluminus}
										</td>
										<td className="px-6 py-4">
											{row.graduationYear}
										</td>
										<td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
											₹ {parseFloat(row.amount || 0).toLocaleString("en-IN")}
										</td>
										<td className="px-6 py-4">
											{row.depositedOn}
										</td>
										<td className="px-6 py-4">{row.mobileNo}</td>
										<td className="px-6 py-4">
											<Link
												href={row.pdfLink || "#"}
												onClick={(e) => e.stopPropagation()}
												target="_blank">
												<Button size="sm" className="h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 rounded-lg">
													View
												</Button>
											</Link>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="text-center py-12 bg-card">
										<div className="flex flex-col items-center gap-3">
											<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
												<DollarSign
													className="text-muted-foreground"
													size={32}
												/>
											</div>
											<div className="text-muted-foreground font-medium">
												{searchTerm
													? "No matching contributions found"
													: "No data uploaded yet"}
											</div>
											<div className="text-muted-foreground/70 text-sm">
												{searchTerm
													? "Try adjusting your search"
													: "Upload an Excel file to get started"}
											</div>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div
					className={`flex items-center justify-between p-6 border-t border-border/50 bg-muted/10 ${contris.length > 0 ? "block" : "hidden"
						} `}>
					<div className="text-sm text-muted-foreground">
						Showing Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => {
								setPage(page - 1), window.scrollTo(0, 0);
							}}
							disabled={page === 1}
							className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-95">
							<ArrowLeft size={16} />
							Prev
						</button>
						<button
							onClick={() => {
								setPage(page + 1), window.scrollTo(0, 0);
							}}
							disabled={page === totalPages}
							className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-95">
							Next
							<ArrowRight size={16} />
						</button>
					</div>
				</div>
			</div>

			{/* Payment Details Modal */}
			<Dialog
				open={isModalOpen}
				onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-border/50 bg-card rounded-2xl shadow-2xl backdrop-blur-xl">
					<div className="bg-muted/30 px-6 py-5 border-b border-border/50">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
								<div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-sm"></div>
								Payment Details
							</DialogTitle>
						</DialogHeader>
					</div>

					<div className="px-6 py-6 max-h-[75vh] overflow-y-auto no-scrollbar">
						{selectedRow && (
							<div className="space-y-6">
							{/* Alumnus Info Section */}
							<div className="bg-muted/30 rounded-xl p-6 border border-border shadow-sm">
								<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
									Alumnus Information
								</h3>
								<div className="space-y-3">
									<div className="flex justify-between items-start">
										<span className="text-sm text-muted-foreground font-medium">
											Name:
										</span>
										<span className="text-sm text-foreground font-medium text-right max-w-[400px]">
											{selectedRow.NameOfAlumnus}
										</span>
									</div>
									<div className="flex justify-between items-start">
										<span className="text-sm text-muted-foreground font-medium">
											Graduation Year:
										</span>
										<span className="text-sm text-foreground font-medium">
											{selectedRow.GraduationYear}
										</span>
									</div>
								</div>
							</div>

							{/* Payment Info Section */}
							<div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20 shadow-sm">
								<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
									Payment Information
								</h3>
								<div className="space-y-4">
									<div className="flex justify-between items-center bg-background/50 p-4 rounded-lg border border-border">
										<span className="text-sm text-muted-foreground font-medium">
											Amount:
										</span>
										<span className="text-2xl text-emerald-600 dark:text-emerald-400 font-bold">
											₹{" "}
											{parseFloat(
												selectedRow.AmountINR?.toString() || "0"
											).toLocaleString("en-IN")}
										</span>
									</div>
									<div className="space-y-3 px-1">
										<div className="flex justify-between items-start">
											<span className="text-sm text-muted-foreground font-medium">
												Deposited On:
											</span>
											<span className="text-sm text-foreground font-medium">
												{selectedRow.DepositedOn}
											</span>
										</div>
										<div className="flex justify-between items-start">
											<span className="text-sm text-muted-foreground font-medium">
												Serial No:
											</span>
											<span className="text-sm text-foreground font-medium">
												{selectedRow.SlNo}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Contact Info Section */}
							<div className="bg-muted/30 rounded-xl p-6 border border-border shadow-sm">
								<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
									Contact Information
								</h3>
								<div className="space-y-3">
									<div className="flex justify-between items-start">
										<span className="text-sm text-muted-foreground font-medium">
											Mobile No:
										</span>
										<span className="text-sm text-foreground font-medium">
											{selectedRow.MobileNo}
										</span>
									</div>
									<div className="flex justify-between items-start">
										<span className="text-sm text-muted-foreground font-medium">
											Email:
										</span>
										<span className="text-sm text-foreground font-medium text-right break-words max-w-[400px]">
											{selectedRow.Email}
										</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4">
								<button
									onClick={handleCloseModal}
									className="flex-1 px-5 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/50 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
									Close
								</button>
							</div>
						</div>
					)}
				</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Payments;
