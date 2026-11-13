"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/app/loading";
import {
	useGetAllReceiptQuery,
	useApproveReceiptMutation,
	useDenyReceiptMutation,
	useDeleteReceiptMutation,
} from "@/store/feature/receipt-feature";
import { debounce } from "@/utils";
import {
	ArrowLeft,
	ArrowRight,
	Eye,
	Loader2,
	PlusIcon,
	Trash2,
	Receipt as ReceiptIcon,
	Search,
	CheckCircle2,
	XCircle,
	Clock,
	Check,
	X
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ModalReceiptDetails } from "../Modals/ModalDetails";
import { ModalReceipt } from "../Modals/ModalReceipt";

const Receipt: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [receiptDetails, setReceiptDetails] = useState<any>();

	const { data, error, isError, isLoading, refetch } = useGetAllReceiptQuery({
		page: page,
		search: searchQuery,
	});

	const [approveReceipt, { isLoading: isApproveLoading }] = useApproveReceiptMutation();
	const [denyReceipt, { isLoading: isDenyLoading }] = useDenyReceiptMutation();
	const [deleteReceipt, { isLoading: isDeleteLoading }] = useDeleteReceiptMutation();

	const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

	const handleSearch = debounce(async (e: any) => {
		setSearchQuery(e.target.value);
		setPage(1);
	}, 600);

	const handleStatusChange = async (id: string, newStatus: string) => {
		setLoadingActionId(id);
		try {
			if (newStatus === "APPROVED") {
				await approveReceipt({ formData: {}, id }).unwrap();
			} else if (newStatus === "DENIED") {
				await denyReceipt({ formData: {}, id }).unwrap();
			}
			toast.success(`Receipt ${newStatus.toLowerCase()} successfully`);
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to update receipt status");
		} finally {
			setLoadingActionId(null);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to permanently delete this receipt record?")) {
			return;
		}
		setLoadingActionId(id);
		try {
			await deleteReceipt(id).unwrap();
			toast.success("Receipt deleted successfully");
			refetch();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to delete receipt");
		} finally {
			setLoadingActionId(null);
		}
	};

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch receipts");
		}
		if (data) {
			setTotalPages(data?.totalPages || 1);
		}
	}, [isError, error, data]);

	if (isLoading) {
		return <Loading />;
	}

	const receiptsList = data?.data || [];

	return (
		<div className="w-full space-y-6">
			{/* Command Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
							<ReceiptIcon className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
								Money Receipts & Approvals
							</h1>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Review transaction claims, verify payments, and generate official stamped receipts.
							</p>
						</div>
					</div>
				</div>

				<button
					onClick={() => setIsOpen(true)}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm active:scale-95"
				>
					<PlusIcon className="h-4 w-4" />
					<span>Issue Manual Receipt</span>
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
							onChange={handleSearch}
							placeholder="Search by alumnus name, txn id, phone or email..."
							className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
						/>
					</div>

					<div className="text-xs text-slate-500 dark:text-slate-400">
						Total Receipts: <strong className="text-slate-900 dark:text-slate-100">{receiptsList.length}</strong>
					</div>
				</div>

				{/* Table View */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="bg-slate-50 dark:bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
							<tr>
								<th className="py-3.5 px-5">Donor Name</th>
								<th className="py-3.5 px-5">Contact Info</th>
								<th className="py-3.5 px-5">Transaction ID</th>
								<th className="py-3.5 px-5">Purpose</th>
								<th className="py-3.5 px-5 text-center">Status</th>
								<th className="py-3.5 px-5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
							{receiptsList.length > 0 ? (
								receiptsList.map((item: any) => {
									const isPending = item.paymentStatus === "Pending" || item.paymentStatus === "PENDING";
									const isApproved = item.paymentStatus === "APPROVED";
									const isBusy = loadingActionId === item.id;

									return (
										<tr
											key={item.id}
											onClick={() => setReceiptDetails(item)}
											className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
										>
											<td className="py-4 px-5">
												<div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
													{item.name}
												</div>
											</td>

											<td className="py-4 px-5 text-xs text-slate-600 dark:text-slate-400">
												<div>{item.email}</div>
												<div className="text-slate-400 font-mono mt-0.5">{item.phone}</div>
											</td>

											<td className="py-4 px-5 font-mono text-xs text-slate-700 dark:text-slate-300">
												{item.transactionId || "—"}
											</td>

											<td className="py-4 px-5 text-xs text-slate-700 dark:text-slate-300">
												<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800">
													{item.donationFor || "General Alumni Fund"}
												</span>
											</td>

											<td className="py-4 px-5 text-center">
												{isPending ? (
													<div className="inline-flex items-center gap-1.5">
														<button
															type="button"
															disabled={isBusy}
															onClick={(e) => {
																e.stopPropagation();
																handleStatusChange(item.id, "APPROVED");
															}}
															className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
														>
															{isBusy && isApproveLoading ? (
																<Loader2 className="h-3 w-3 animate-spin" />
															) : (
																<Check className="h-3 w-3" />
															)}
															<span>Approve</span>
														</button>
														<button
															type="button"
															disabled={isBusy}
															onClick={(e) => {
																e.stopPropagation();
																handleStatusChange(item.id, "DENIED");
															}}
															className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 dark:border-rose-800"
														>
															{isBusy && isDenyLoading ? (
																<Loader2 className="h-3 w-3 animate-spin" />
															) : (
																<X className="h-3 w-3" />
															)}
															<span>Deny</span>
														</button>
													</div>
												) : (
													<span
														className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
															isApproved
																? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
																: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400"
														}`}
													>
														{isApproved ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
														<span>{item.paymentStatus}</span>
													</span>
												)}
											</td>

											<td className="py-4 px-5 text-right">
												<div className="flex items-center justify-end gap-1.5">
													{item.generatedReceipt && (
														<Link
															href={item.generatedReceipt}
															target="_blank"
															onClick={(e) => e.stopPropagation()}
															title="View Generated PDF"
															className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
														>
															<Eye className="h-4 w-4" />
														</Link>
													)}

													<button
														type="button"
														title="Delete receipt"
														disabled={isBusy && isDeleteLoading}
														onClick={(e) => {
															e.stopPropagation();
															handleDelete(item.id);
														}}
														className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
													>
														{isBusy && isDeleteLoading ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<Trash2 className="h-4 w-4" />
														)}
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
												<ReceiptIcon className="h-6 w-6" />
											</div>
											<p className="font-semibold text-slate-900 dark:text-slate-100">No receipt records</p>
											<p className="text-xs text-slate-500 mt-1">
												Receipt submissions will populate here when donors submit contribution slips.
											</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
					<span>
						Page <strong className="text-slate-900 dark:text-slate-100">{page}</strong> of{" "}
						<strong className="text-slate-900 dark:text-slate-100">{totalPages}</strong>
					</span>
					<div className="flex items-center gap-2">
						<button
							disabled={page <= 1}
							onClick={() => setPage(Math.max(1, page - 1))}
							className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							<ArrowLeft className="h-3.5 w-3.5" />
							<span>Prev</span>
						</button>
						<button
							disabled={page >= totalPages}
							onClick={() => setPage(page + 1)}
							className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							<span>Next</span>
							<ArrowRight className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>

			{/* Dialogs */}
			{receiptDetails && (
				<ModalReceiptDetails
					open={!!receiptDetails}
					closed={() => setReceiptDetails(undefined)}
					details={receiptDetails}
				/>
			)}

			<ModalReceipt
				open={isOpen}
				closed={() => {
					setIsOpen(false);
					refetch();
				}}
			/>
		</div>
	);
};

export default Receipt;
