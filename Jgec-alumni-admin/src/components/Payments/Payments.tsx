/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
	Upload,
	Users,
	TrendingUp,
	Calendar,
	ChevronDown,
	Check,
	ArrowLeft,
	ArrowRight,
	Download,
	LayoutGrid,
	List,
	Eye,
	Receipt as ReceiptIcon,
	IndianRupee,
	Search,
	Loader2
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
	const [createContribution, { isLoading: isUploadLoading }] =
		useAddContributionsMutation({});
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedRow, setSelectedRow] = useState<ContributionRow | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedYear, setSelectedYear] = useState<string>("all");
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	useEffect(() => {
		if (typeof window !== "undefined" && window.innerWidth < 1024) {
			setViewMode("grid");
		}
	}, []);

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

	const contris = data?.data || [];
	const stats = data?.stats || {
		totalAmount: 0,
		totalContributions: 0,
		uniqueBatches: 0,
		monthlyContributions: 0,
	};

	useEffect(() => {
		if (data) {
			setTotalPages(data?.totalPages || 1);
		}
	}, [data]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setPage(1);
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
					toast.success("Contributions ledger uploaded successfully");
				}
			};

			reader.readAsArrayBuffer(file);
		} catch (err: any) {
			toast.error(err?.message || "Error parsing Excel file");
		} finally {
			e.target.value = "";
		}
	};

	const handleDownloadAll = async () => {
		try {
			if (!data?.pdfLinksAndNames || (data.pdfLinksAndNames as any[]).length === 0) {
				toast.error("No receipts available to download");
				return;
			}

			toast.loading("Packaging receipts archive... Please wait", { id: "download" });

			const zip = new JSZip();
			let count = 0;
			const fileNameMap: Record<string, number> = {};

			for (const row of data.pdfLinksAndNames) {
				if (row.pdf) {
					try {
						const response = await fetch(row.pdf);
						if (!response.ok) throw new Error(`Failed to fetch ${row.pdf}`);
						const blob = await response.blob();

						let baseName = `${row.name || "receipt"}_${row.graduationYear || ""}`
							.trim()
							.replace(/\s+/g, "_")
							.replace(/[^\w\-()_]/g, "");

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

			const zipBlob = await zip.generateAsync({ type: "blob" });
			const today = new Date().toISOString().split("T")[0];
			saveAs(zipBlob, `Alumni_Receipts_${today}.zip`);

			toast.success(`Downloaded ${count} receipts in zip package`, { id: "download" });
		} catch {
			toast.error("Failed to compile receipt bundle", { id: "download" });
		}
	};

	if (isdataLoading) {
		return <Loading />;
	}

	return (
		<div className="w-full space-y-6">
			{/* Command Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
							<IndianRupee className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
								Contributions & Ledger
							</h1>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Audit incoming alumni donations, import bank records, and issue tax receipts.
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
					<button
						onClick={handleDownloadAll}
						className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
					>
						<Download className="h-4 w-4 text-slate-500" />
						<span>Download Archive</span>
					</button>

					<button
						onClick={handleUploadClick}
						disabled={isUploadLoading}
						className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm disabled:opacity-60 active:scale-95"
					>
						{isUploadLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
						<span>{isUploadLoading ? "Ingesting..." : "Import Ledger (.xlsx)"}</span>
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

			{/* Financial Stats Ribbon */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Donated</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
							₹{stats.totalAmount.toLocaleString("en-IN")}
						</p>
					</div>
					<div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
						<IndianRupee className="h-5 w-5" />
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Donors</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
							{stats.totalContributions}
						</p>
					</div>
					<div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
						<Users className="h-5 w-5" />
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Batches</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
							{stats.uniqueBatches} Batches
						</p>
					</div>
					<div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
						<TrendingUp className="h-5 w-5" />
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
					<div>
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current Month</p>
						<p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
							{stats.monthlyContributions} Entries
						</p>
					</div>
					<div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
						<Calendar className="h-5 w-5" />
					</div>
				</div>
			</div>

			{/* Main Card */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
				{/* Toolbar */}
				<div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
							<input
								type="text"
								value={searchTerm}
								onChange={handleSearch}
								placeholder="Search alumnus name, email, or mobile..."
								className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
							/>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="justify-between bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs h-9 font-medium"
								>
									<span>
										{selectedYear === "all" ? "All Graduation Years" : `Batch ${selectedYear}`}
									</span>
									<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-50" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuPortal>
								<DropdownMenuContent
									align="start"
									className="min-w-[200px] p-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800"
								>
									<div className="max-h-[240px] overflow-y-auto no-scrollbar">
										<DropdownMenuItem
											onClick={() => {
												setSelectedYear("all");
												setPage(1);
											}}
											className="cursor-pointer text-xs rounded-lg py-2 font-medium"
										>
											<Check
												className={`mr-2 h-3.5 w-3.5 ${
													selectedYear === "all" ? "opacity-100 text-primary" : "opacity-0"
												}`}
											/>
											All Graduation Years
										</DropdownMenuItem>

										{graduationYears.map((year: any) => (
											<DropdownMenuItem
												key={year}
												onClick={() => {
													setSelectedYear(year.toString());
													setPage(1);
												}}
												className="cursor-pointer text-xs rounded-lg py-2 font-medium"
											>
												<Check
													className={`mr-2 h-3.5 w-3.5 ${
														selectedYear === year.toString() ? "opacity-100 text-primary" : "opacity-0"
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
							Entries: <strong className="text-slate-900 dark:text-slate-100">{contris.length}</strong>
						</span>
					</div>
				</div>

				{/* Table View */}
				{viewMode === "table" && (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="bg-slate-50 dark:bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
								<tr>
									<th className="py-3.5 px-5">Sl No.</th>
									<th className="py-3.5 px-5">Alumnus Name</th>
									<th className="py-3.5 px-5">Graduation</th>
									<th className="py-3.5 px-5">Amount (INR)</th>
									<th className="py-3.5 px-5">Date Deposited</th>
									<th className="py-3.5 px-5">Contact</th>
									<th className="py-3.5 px-5 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
								{contris.length > 0 ? (
									contris.map((row: any, index: number) => (
										<tr
											key={row.id || index}
											onClick={() => handleRowClick(row)}
											className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
										>
											<td className="py-4 px-5 text-slate-400 text-xs font-mono">
												{row.slNo || index + 1}
											</td>

											<td className="py-4 px-5">
												<div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
													{row.nameOfAluminus}
												</div>
												{row.email && (
													<div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
														{row.email}
													</div>
												)}
											</td>

											<td className="py-4 px-5">
												<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
													Batch &apos;{String(row.graduationYear).slice(-2)}
												</span>
											</td>

											<td className="py-4 px-5">
												<span className="font-bold text-emerald-600 dark:text-emerald-400">
													₹{parseFloat(row.amount || 0).toLocaleString("en-IN")}
												</span>
											</td>

											<td className="py-4 px-5 text-xs text-slate-600 dark:text-slate-400">
												{row.depositedOn || "—"}
											</td>

											<td className="py-4 px-5 text-xs text-slate-500 font-mono">
												{row.mobileNo || "—"}
											</td>

											<td className="py-4 px-5 text-right">
												<div className="flex items-center justify-end gap-1.5">
													<button
														type="button"
														title="View Record"
														onClick={(e) => {
															e.stopPropagation();
															handleRowClick(row);
														}}
														className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
													>
														<Eye className="h-3.5 w-3.5" />
														<span>View</span>
													</button>

													{row.pdfLink && (
														<Link
															href={row.pdfLink}
															target="_blank"
															onClick={(e) => e.stopPropagation()}
															title="Download Official Receipt"
															className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
														>
															<ReceiptIcon className="h-3.5 w-3.5" />
															<span>Receipt</span>
														</Link>
													)}
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={7} className="py-14 text-center text-slate-500">
											<div className="flex flex-col items-center justify-center max-w-sm mx-auto">
												<div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
													<IndianRupee className="h-6 w-6" />
												</div>
												<p className="font-semibold text-slate-900 dark:text-slate-100">No contribution records</p>
												<p className="text-xs text-slate-500 mt-1">
													Upload an Excel sheet or clear active filters to inspect records.
												</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}

				{/* Grid View */}
				{viewMode === "grid" && (
					<div className="p-4 sm:p-5">
						{contris.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{contris.map((row: any, index: number) => (
									<div
										key={row.id || index}
										onClick={() => handleRowClick(row)}
										className="border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 bg-white dark:bg-slate-900 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
									>
										<div>
											<div className="flex items-start justify-between gap-3">
												<div className="flex-1 min-w-0">
													<span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
														Class of {row.graduationYear}
													</span>
													<h3 className="font-bold text-slate-900 dark:text-slate-100 text-base truncate">
														{row.nameOfAluminus}
													</h3>
													<p className="text-xs text-slate-500 mt-0.5 truncate">
														{row.email || "No email registered"}
													</p>
												</div>

												<span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md shrink-0">
													#{row.slNo || index + 1}
												</span>
											</div>

											<div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
												<span className="text-slate-500">Contribution</span>
												<span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
													₹{parseFloat(row.amount || 0).toLocaleString("en-IN")}
												</span>
											</div>
										</div>

										<div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
											<span className="text-slate-400">{row.depositedOn || "—"}</span>
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														handleRowClick(row);
													}}
													className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-semibold"
												>
													Details
												</button>
												{row.pdfLink && (
													<Link
														href={row.pdfLink}
														target="_blank"
														onClick={(e) => e.stopPropagation()}
														className="text-primary hover:underline font-semibold"
													>
														Receipt
													</Link>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="py-14 text-center text-slate-500">
								<p className="font-semibold text-slate-900 dark:text-slate-100">No records found</p>
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
							}}
							className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							<span>Next</span>
							<ArrowRight className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>

			{/* Payment Details Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
					<DialogHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
						<DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
							<IndianRupee className="h-5 w-5 text-primary" />
							<span>Contribution Ledger Entry</span>
						</DialogTitle>
					</DialogHeader>

					{selectedRow && (
						<div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
							<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
								<p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Alumnus Information</p>
								<div className="flex justify-between items-center pt-1">
									<span className="text-sm text-slate-500">Name</span>
									<span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
										{selectedRow.NameOfAlumnus}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-slate-500">Graduation Year</span>
									<span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
										Class of {selectedRow.GraduationYear}
									</span>
								</div>
							</div>

							<div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
								<p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">Payment Breakdown</p>
								<div className="flex justify-between items-center pt-1">
									<span className="text-sm text-emerald-800 dark:text-emerald-300">Amount Contributed</span>
									<span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
										₹{parseFloat(selectedRow.AmountINR?.toString() || "0").toLocaleString("en-IN")}
									</span>
								</div>
								<div className="flex justify-between items-center text-xs text-emerald-800 dark:text-emerald-300">
									<span>Date Deposited</span>
									<span className="font-medium">{selectedRow.DepositedOn}</span>
								</div>
								<div className="flex justify-between items-center text-xs text-emerald-800 dark:text-emerald-300">
									<span>Ledger Serial No</span>
									<span className="font-mono">{selectedRow.SlNo}</span>
								</div>
							</div>

							<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
								<p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Contact Details</p>
								<div className="flex justify-between items-center pt-1">
									<span className="text-sm text-slate-500">Mobile Phone</span>
									<span className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">
										{selectedRow.MobileNo || "Not provided"}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-slate-500">Email Address</span>
									<span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[260px]">
										{selectedRow.Email || "Not provided"}
									</span>
								</div>
							</div>

							<div className="pt-2 flex justify-end">
								<button
									onClick={handleCloseModal}
									className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
								>
									Dismiss
								</button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Payments;
