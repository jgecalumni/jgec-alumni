"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
    ModalDocumentsGivingBack,
	ModalDocumentsKanchenjunga,
	ModalDocumentsScholarship,
} from "../Modals/ModalDocuments";
import {
	useDeleteGivingBackDocsMutation,
	useDeleteKanchenungaDocsMutation,
	useDeleteScholDocsMutation,
	useGetAllGivingBackDocsQuery,
	useGetAllKanchenungaDocsQuery,
	useGetAllScholDocsQuery,
} from "@/store/feature/document-feature";
import { Delete, Eye, FilePenLine, PlusIcon, Trash2 } from "lucide-react";
import DocumentCard from "./DocumentCard";
import Link from "next/link";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const GivingBack = () => {
	const [openModal, setOpenModal] = useState(false);
	const { data, isLoading, isError, error, refetch } =
		useGetAllGivingBackDocsQuery({});
	const [
		deleteGivingBack,
		{ isLoading: deleteLoading, isError: deleteIsError, error: deleteError },
	] = useDeleteGivingBackDocsMutation();
	const [editGivingBackDocs, setEditGivingBackDocs] = useState<any>();

	if (isLoading) {
		return <Loading />;
	}
	const handelDelete = async (id: string) => {
		const res = await deleteGivingBack(id);
		if (res?.data?.success) {
			toast.success("Document deleted successfully");
			refetch();
		}
	};

	return (
		<>
			<div className="flex justify-end">
				<Button
					className="bg-primary flex items-center justify-center gap-1.5 p-2.5 rounded-md text-primary-foreground hover:bg-primary/90 px-4 text-sm transition-colors shadow-sm"
					onClick={() => setOpenModal(true)}>
					<PlusIcon
						className="font-bold"
						size={16}
					/>
					<div>Add Docs</div>
				</Button>
			</div>
			<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{data?.response?.length > 0 ? (
					<>
						{data?.response.map((item: any) => (
							<DocumentCard
								key={item.id || item.title}
								item={item}
								onEdit={setEditGivingBackDocs}
								onDelete={handelDelete}
								isDeleting={deleteLoading}
							/>
						))}
					</>
				) : (
					<div className="col-span-full py-16 flex flex-col items-center justify-center bg-card rounded-2xl border border-dashed border-border text-muted-foreground shadow-sm">
						<div className="bg-indigo-100 dark:bg-indigo-900/20 p-4 rounded-full mb-4 text-indigo-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
						</div>
						<p className="font-medium text-foreground">No documents found</p>
						<p className="text-sm mt-1">Upload a new document to get started.</p>
					</div>
				)}
			</div>
			{(openModal || !!editGivingBackDocs) && (
				<ModalDocumentsGivingBack
					open={openModal || editGivingBackDocs}
					closed={() => {
						setOpenModal(false);
						setEditGivingBackDocs(null);
						refetch();
					}}
					data={editGivingBackDocs}
				/>
			)}
		</>
	);
};

export default GivingBack;
