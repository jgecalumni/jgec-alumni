"use client";
import Loading from "@/app/loading";
import {
	useGetAllReceiptQuery,
	useApproveReceiptMutation,
	useDenyReceiptMutation,
	useDeleteReceiptMutation,
	useAddReceiptMutation,
} from "@/store/feature/receipt-feature";
import { debounce } from "@/utils";
import { ArrowLeft, ArrowRight, Eye, Loader2, PlusIcon, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ModalReceiptDetails } from "../Modals/ModalDetails";
import { Button } from "../ui/button";
import { ref } from "yup";
import { ModalReceipt } from "../Modals/ModalReceipt";
import { add, set } from "date-fns";

const Receipt: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [receiptDetails, setReceiptDetails] = useState<IReceiptType>();
	const { data, error, isError, isLoading, refetch } = useGetAllReceiptQuery({
		page: page,
		search: searchQuery,
	});

	const [approveReceipt, { isLoading: isApproveLoading }] =
		useApproveReceiptMutation();
	const [denyReceipt, { isLoading: isDenyLoading }] = useDenyReceiptMutation();
	const [deleteReceipt, { isLoading: isDeleteLoading }] =
		useDeleteReceiptMutation();
	const [loadingId, setLoadingId] = useState("");
	const handleSearch = debounce(async (e: any) => {
		setSearchQuery(e.target.value);
	}, 1000);

	const handleStatusChange = async (id: string, newStatus: string) => {
		if (newStatus === "APPROVED") {
			await approveReceipt({ formData: {}, id });
		} else if (newStatus === "DENIED") {
			await denyReceipt({ formData: {}, id });
		}
		toast.success("Status updated successfully!");
		refetch();
	};

	const handleDelete = async (id: string) => {
		setLoadingId(id);
		await deleteReceipt(id);
		toast.success("Receipt deleted successfully!");
		refetch();
	};

	

	useEffect(() => {
		if (isError) {
			toast.error(
				(error as any)?.data?.message || "Failed to fetch scholarships"
			);
		}
		

		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [isError, error, data]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			<div className="w-full">
				{/* Header */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
					<div className="flex flex-col">
						<h1 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground">Money Receipts</h1>
						<p className="text-muted-foreground mt-1">Manage and track generated money receipts.</p>
					</div>
					<div>
						<button
							className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors shadow-sm"
							onClick={() => setIsOpen(!isOpen)}>
							<PlusIcon
								className="font-bold"
								size={16}
							/>
							<span>Add Receipt</span>
						</button>
					</div>
				</div>

				<div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
					{/* Search Bar */}
					<div className="p-6 pb-4 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between border-b border-border">
						<label
							htmlFor="table-search"
							className="sr-only">
							Search
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
								<svg
									className="w-5 h-5 text-muted-foreground"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clipRule="evenodd"></path>
								</svg>
							</div>
							<input
								type="text"
								id="table-search"
								onChange={handleSearch}
								className="block p-2 ps-10 text-sm text-foreground bg-background border border-border rounded-lg w-80 focus:ring-2 focus:ring-ring focus:border-input transition-all"
								placeholder="Search for receipts"
							/>
						</div>
					</div>

					{/* Table */}
					<div className="overflow-x-auto no-scrollbar">
						<table className="w-full text-sm text-left text-muted-foreground">
							<thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
								<tr>
									<th className="px-6 py-4 font-medium text-left">Name</th>
									<th className="px-6 py-4 font-medium text-left">Email</th>
									<th className="px-6 py-4 font-medium text-left">Phone No.</th>
									<th className="px-6 py-4 font-medium text-left">Transaction ID</th>
									<th className="px-6 py-4 font-medium text-left">Donation For</th>
									<th className="px-6 py-4 font-medium text-left">Status</th>
									<th className="px-6 py-4 font-medium text-left">Task</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-border text-sm">
								{data?.data.length ?? 0 ? (
									data?.data.map((item: any) => (
										<tr
											key={item.id}
											className="bg-card text-foreground transition-colors hover:bg-muted/50 cursor-pointer"
											onClick={(e) => {
												e.stopPropagation(), setReceiptDetails(item);
											}}>
											<td className="px-6 py-4 font-medium">{item.name}</td>
											<td className="px-6 py-4">{item.email}</td>
											<td className="px-6 py-4">{item.phone}</td>
											<td className="px-6 py-4">{item.transactionId}</td>
											<td className="px-6 py-4">{item.donationFor}</td>
											<td className="px-6 py-4">
												{item.paymentStatus === "Pending" ? (
													<div className="flex gap-2">
														<button
															onClick={(e) => {
																e.stopPropagation(),
																	handleStatusChange(item.id, "APPROVED");
															}}
															className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium rounded-md text-xs hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors">
															{isApproveLoading ? (
																<Loader2
																	className="animate-spin"
																	size={14}
																/>
															) : (
																"Approve"
															)}
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation(),
																	handleStatusChange(item.id, "DENIED");
															}}
															className="px-3 py-1.5 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-medium rounded-md text-xs hover:bg-rose-200 dark:hover:bg-rose-500/30 transition-colors">
															{isDenyLoading ? (
																<Loader2
																	className="animate-spin"
																	size={14}
																/>
															) : (
																"Deny"
															)}
														</button>
													</div>
												) : (
													<span
														className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
															item.paymentStatus === "APPROVED"
																? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
																: "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"
														}`}>
														{item.paymentStatus}
													</span>
												)}
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<Link
														href={`${item.generatedReceipt}`}
														target="_blank"
														onClick={(e) => e.stopPropagation()}>
														<Button size="sm" variant="outline" className="h-8 px-2 bg-background border-border text-foreground hover:bg-muted">
															<Eye
																size={14}
																className="cursor-pointer"
															/>
														</Button>
													</Link>
													<Button
														size="sm"
														variant="destructive"
														onClick={(e) => {
															e.stopPropagation(), handleDelete(item.id);
														}}
														className="h-8 px-2 bg-destructive/10 text-destructive border border-transparent hover:bg-destructive hover:text-destructive-foreground">
														{isDeleteLoading && loadingId === item.id ? (
															<Loader2
																className="animate-spin"
																size={14}
															/>
														) : (
															<Trash
																size={14}
																className="cursor-pointer"
															/>
														)}
													</Button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={7}
											className="px-6 py-8 text-center text-muted-foreground bg-card">
											No receipt found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					
					<div
						className={`flex items-center justify-between p-6 border-t border-border ${
							(data?.data?.length ?? 0) > 0 ? "block" : "hidden"
						}`}>
						<div className="text-sm text-muted-foreground">
							Showing Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
								className="px-3 py-1.5 bg-background border border-border hover:bg-muted text-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors">
								<ArrowLeft size={14} />
								Prev
							</button>
							<button
								onClick={() => setPage(page + 1)}
								disabled={page === totalPages}
								className="px-3 py-1.5 bg-background border border-border hover:bg-muted text-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors">
								Next
								<ArrowRight size={14} />
							</button>
						</div>
					</div>
				</div>
			</div>
			{receiptDetails && (
				<ModalReceiptDetails
					open={!!receiptDetails}
					closed={() => setReceiptDetails(undefined)}
					details={receiptDetails}
				/>
			)}
			{
				<ModalReceipt
					open={isOpen}
					closed={() => {
						setIsOpen(false);
						refetch();
					}}
				/>
			}
		</>
	);
};

export default Receipt;
