"use client";

import React, { useEffect, useState } from "react";
import {
	ArrowLeft,
	ArrowRight,
	Loader2,
	PlusIcon,
	Upload,
	Folder,
	Images,
	Edit2,
	Search,
	Trash2,
	Image as ImageIcon
} from "lucide-react";
import { debounce } from "@/utils";
import {
	ModalGalleryCategory,
	ModalGalleryImageUpload,
	ModalGalleryImageView,
} from "../Modals/ModalGallery";
import {
	useDeleteCategoryMutation,
	useGetCategoryQuery,
} from "@/store/feature/gallery-feature";
import toast from "react-hot-toast";
import Loading from "@/app/loading";

const Gallery = () => {
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [openImage, setOpenImage] = useState(false);
	const [categoryID, setCategoryID] = useState("");
	const [viewImages, setViewImages] = useState<any>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [editCategory, setEditCategory] = useState<any>(null);

	const { data, isLoading, isError, error, refetch } = useGetCategoryQuery({
		page: page,
		search: searchQuery,
	});

	const [
		deleteCategory,
		{ isError: isDeleteError, error: deleteError },
	] = useDeleteCategoryMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch categories");
		}
		if (data) {
			setTotalPages(data.totalPages || 1);
		}
		if (isDeleteError) {
			toast.error((deleteError as any)?.data?.message || "Failed to delete category");
		}
	}, [isError, error, data, isDeleteError, deleteError]);

	const handleSearch = debounce(async (e: any) => {
		setSearchQuery(e.target.value);
		setPage(1);
	}, 600);

	const handleDelete = async (id: string, name: string) => {
		if (!window.confirm(`Are you sure you want to delete album "${name}" and all its photos?`)) {
			return;
		}
		setLoadingId(id);
		try {
			const res = await deleteCategory(id);
			if (res?.data?.success) {
				toast.success("Category deleted successfully");
				refetch();
			}
		} finally {
			setLoadingId(null);
		}
	};

	if (isLoading) return <Loading />;

	const categories = data?.data || [];
	const totalCount = data?.totalCount || categories.length;

	return (
		<div className="w-full space-y-6">
			{/* Command Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
							<ImageIcon className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
								Campus Photo Gallery
							</h1>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Curate alumni gatherings, jubilee celebrations, reunions, and archive albums.
							</p>
						</div>
					</div>
				</div>

				<button
					onClick={() => {
						setEditCategory(null);
						setOpenModal(true);
					}}
					className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm active:scale-95"
				>
					<PlusIcon className="h-4 w-4" />
					<span>Create New Album</span>
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
							placeholder="Search album collection by title..."
							className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
						/>
					</div>

					<div className="text-xs text-slate-500 dark:text-slate-400">
						Total Albums: <strong className="text-slate-900 dark:text-slate-100">{totalCount}</strong>
					</div>
				</div>

				{/* Album Grid */}
				<div className="p-4 sm:p-6">
					{categories.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{categories.map((item: any) => {
								const photoCount = item.images?.length || 0;
								const isDeleting = loadingId === item.id;

								return (
									<div
										key={item.id}
										onClick={() => setViewImages(item)}
										className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
									>
										<div>
											<div className="flex items-start justify-between gap-3 mb-3">
												<div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
													<Folder className="h-5 w-5" />
												</div>
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
													{photoCount} {photoCount === 1 ? "Photo" : "Photos"}
												</span>
											</div>

											<h3
												className="font-bold text-slate-900 dark:text-slate-100 text-base truncate group-hover:text-primary transition-colors"
												title={item.name}
											>
												{item.name}
											</h3>
											<p className="text-xs text-slate-400 mt-0.5">Alumni Album Collection</p>
										</div>

										<div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
											<div className="flex items-center gap-1">
												<button
													type="button"
													title="Upload Photos"
													onClick={(e) => {
														e.stopPropagation();
														setCategoryID(item.id);
														setOpenImage(true);
													}}
													className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
												>
													<Upload className="h-4 w-4" />
												</button>
												<button
													type="button"
													title="View Gallery"
													onClick={(e) => {
														e.stopPropagation();
														setViewImages(item);
													}}
													className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
												>
													<Images className="h-4 w-4" />
												</button>
											</div>

											<div className="flex items-center gap-1">
												<button
													type="button"
													title="Edit Album Title"
													onClick={(e) => {
														e.stopPropagation();
														setEditCategory(item);
													}}
													className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
												>
													<Edit2 className="h-4 w-4" />
												</button>
												<button
													type="button"
													title="Delete Album"
													disabled={isDeleting}
													onClick={(e) => {
														e.stopPropagation();
														handleDelete(item.id, item.name);
													}}
													className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
												>
													{isDeleting ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<Trash2 className="h-4 w-4" />
													)}
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
									<Folder className="h-6 w-6" />
								</div>
								<p className="font-semibold text-slate-900 dark:text-slate-100">No albums found</p>
								<p className="text-xs text-slate-500 mt-1">
									Create a photo album category to upload reunions and event photos.
								</p>
								<button
									onClick={() => setOpenModal(true)}
									className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
								>
									Create First Album
								</button>
							</div>
						</div>
					)}
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
			{(openModal || editCategory) && (
				<ModalGalleryCategory
					open={openModal || !!editCategory}
					closed={() => {
						setOpenModal(false);
						setEditCategory(null);
						refetch();
					}}
					details={editCategory}
				/>
			)}
			{openImage && (
				<ModalGalleryImageUpload
					open={openImage}
					closed={() => {
						setOpenImage(false);
						refetch();
					}}
					details={categoryID}
				/>
			)}
			{viewImages && (
				<ModalGalleryImageView
					open={!!viewImages}
					closed={() => {
						setViewImages(null);
						refetch();
					}}
					details={viewImages}
				/>
			)}
		</div>
	);
};

export default Gallery;
