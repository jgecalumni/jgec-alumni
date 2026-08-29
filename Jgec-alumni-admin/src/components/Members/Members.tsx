"use client";

import Loading from "@/app/loading";
import { useGetAllMembersQuery } from "@/store/feature/member-feature";
import { debounce } from "@/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ModalMemberDetails } from "../Modals/ModalDetails";


const Members = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [openModal,setOpenModal] = useState<boolean>(false)
    const [editMembers, setEditMembers] = useState<any>("");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const { data, error, isLoading, isError, refetch } = useGetAllMembersQuery({
		page: 1,
		search: searchQuery,
	});

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch members");
		}
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [isError, error, data]);

	if (isLoading) {
		return <Loading />;
	}
	

	const handleSearch = debounce(async (e: any) => {
		const searchValue = e.target.value;
		setSearchQuery(searchValue);
	}, 1000);

	return (
		<div>
			<div className="flex justify-between items-center mb-8">
				<div className="flex flex-col">
					<h1 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground">Members</h1>
					<p className="text-muted-foreground mt-1">View and manage registered alumni members.</p>
				</div>
			</div>

			<div className="bg-card border border-border rounded-xl shadow-sm">
				<div className="p-6 pb-4 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
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
							placeholder="Search for members"
						/>
					</div>
				</div>
				
				<div className="overflow-x-auto no-scrollbar">
					<table className="w-full text-sm text-left text-muted-foreground">
						<thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-y border-border">
							<tr>
								<th
									scope="col"
									className="px-6 py-4 font-medium">
									Name
								</th>
								<th
								scope="col"
								className="px-6 py-4 font-medium">
									Email
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-medium">
									Student ID
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-medium">
									Department
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-medium">
									Passing Year
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-medium">
									Photo
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-medium">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{data?.members?.length > 0 ? (
								data.members.map((item: any) => (
									<tr
										key={item.id}
										className="bg-card text-foreground transition-colors hover:bg-muted/50">
										<th
											scope="row"
											className="px-6 py-4 font-medium max-w-xs"
											title={item.name}>
											{item.name}
										</th>
										<td className="px-6 py-4">{item.email}</td>
										<td className="px-6 py-4 truncate max-w-xs">
											{item.studentId}
										</td>
										<td className="px-6 py-4">{item.department}</td>
										<td className="px-6 py-4">{item.passingYear}</td>
										<td className="px-6 py-4">
											<div className="relative h-12 w-12 rounded-full overflow-hidden border border-border">
												<Image
													src={item.photo}
													alt={item.name}
													fill
													className="object-cover"
												/>
											</div>
										</td>
										<td className="px-6 py-4">
											<button
												className="font-medium text-primary hover:underline"
												onClick={() => setEditMembers(item)}
											>
												View Details
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="px-6 py-8 text-center text-muted-foreground bg-card">
										No members found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				
				<div className={`flex items-center justify-between p-6 border-t border-border ${data?.members?.length > 0 ? "block" : "hidden"}`}>
					<div className="text-sm text-muted-foreground">
						Showing Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => {setPage(page - 1); window.scrollTo(0, 0)}}
							disabled={page === 1}
							className="px-3 py-1.5 bg-background border border-border hover:bg-muted text-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
						>
							<ArrowLeft size={14} />
							Prev
						</button>
						<button
							onClick={() => {setPage(page + 1); window.scrollTo(0, 0)}}
							disabled={page === totalPages}
							className="px-3 py-1.5 bg-background border border-border hover:bg-muted text-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
						>
							Next
							<ArrowRight size={14} />
						</button>
					</div>
				</div>
			</div>
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
