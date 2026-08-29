"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
	ArrowLeft,
	ArrowRight,
	Link,
	Loader2,
	PlusIcon,
	Upload,
	Folder,
	FolderOpen,
	Images,
	Edit2,
	Search,
	Trash2,
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
	const [editCategory, setEditCategory] = useState<any>("");

	const { data, isLoading, isError, error, refetch } = useGetCategoryQuery({
		page: page,
		search: searchQuery,
	});
	const [
		deleteCategory,
		{ isLoading: deleteLoading, error: deleteError, isError: isDeleteError },
	] = useDeleteCategoryMutation();
	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data.message || "Failed to fetch categories");
		}
		if (data) {
			setTotalPages(data.totalPages);
		}
		if (isDeleteError) {
			toast.error(
				(deleteError as any)?.data.message || "Failed to delete category"
			);
		}
	}, [isError, error, data, isDeleteError, deleteError]);

	const handleSearch = debounce(async (e: any) => {
		const searchValue = e.target.value;
		setSearchQuery(searchValue);
	}, 1000);
	const handleDelete = async (id: string) => {
		setLoadingId(id)
		const res = await deleteCategory(id);
		if (res?.data?.success) {
			toast.success("Category deleted successfully");
			refetch();
		}
		setLoadingId(null);
	};
	if (isLoading) return <Loading />;

	return (
		<>
			{/* Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
				<div className="flex flex-col">
					<h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-foreground">Gallery</h1>
					<p className="text-muted-foreground mt-1 text-sm lg:text-base">Manage photo categories and galleries.</p>
				</div>
				<Button
					onClick={() => setOpenModal(true)}
					className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 rounded-xl px-5 h-11"
				>
					<PlusIcon size={18} strokeWidth={2.5} />
					<span className="font-semibold">Add Category</span>
				</Button>
			</div>
			
			<div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl overflow-hidden mb-8">
				{/* Toolbar */}
				<div className="p-6 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between border-b border-border/50 bg-muted/10">
					<div className="relative w-full sm:w-80 group">
						<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-500 transition-colors">
							<Search size={18} />
						</div>
						<input
							type="text"
							onChange={handleSearch}
							className="block w-full pl-10 pr-4 py-2.5 bg-background border border-border/60 rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-sm"
							placeholder="Search for category..."
						/>
					</div>
					
					<div className="text-sm text-muted-foreground font-medium px-4 py-2 bg-background rounded-xl border border-border/50 shadow-sm">
						Total Categories: <span className="text-foreground font-bold">{data?.totalCount || data?.data?.length || 0}</span>
					</div>
				</div>
				
				{/* Grid Layout */}
				<div className="p-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{data?.data && data.data.length > 0 ? (
							data.data.map((item: any) => (
								<div 
									key={item.id} 
									className="group flex flex-col bg-background/50 border border-border/60 rounded-2xl p-5 hover:bg-muted/30 hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
								>
									{/* Top decorative gradient */}
									<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									
									<div className="flex items-start justify-between mb-4">
										<div className="p-3.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
											<Folder size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-300"/>
										</div>
										<div className="flex flex-col items-end">
											<span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 shadow-sm">
												{item.images?.length || 0} Photos
											</span>
										</div>
									</div>
									
									<div className="flex-1 mb-6">
										<h3 className="text-lg font-bold text-foreground truncate mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={item.name}>
											{item.name}
										</h3>
										<p className="text-xs text-muted-foreground font-medium">Gallery Collection</p>
									</div>

									{/* Action Buttons */}
									<div className="flex items-center justify-between pt-4 border-t border-border/50">
										<div className="flex items-center gap-2">
											<button 
												className="flex items-center justify-center w-9 h-9 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-700 transition-all shadow-sm hover:shadow"
												onClick={(e) => { e.stopPropagation(); setOpenImage(true); setCategoryID(item.id); }}
												title="Upload Photo"
											>
												<Upload size={16} strokeWidth={2.5} />
											</button>
											<button 
												className="flex items-center justify-center w-9 h-9 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-700 transition-all shadow-sm hover:shadow"
												onClick={(e) => { e.stopPropagation(); setViewImages(item); }}
												title="View Gallery"
											>
												<Images size={16} strokeWidth={2.5} />
											</button>
										</div>
										
										<div className="flex items-center gap-2">
											<button 
												className="flex items-center justify-center w-9 h-9 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:text-amber-700 transition-all shadow-sm hover:shadow"
												onClick={(e) => { e.stopPropagation(); setEditCategory(item); }}
												title="Edit Category"
											>
												<Edit2 size={16} strokeWidth={2.5} />
											</button>
											<button 
												className="flex items-center justify-center w-9 h-9 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-700 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
												onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
												disabled={loadingId === item.id}
												title="Delete Category"
											>
												{loadingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} strokeWidth={2.5} />}
											</button>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
								<div className="p-4 bg-muted/30 rounded-full mb-4">
									<FolderOpen size={48} className="opacity-40" strokeWidth={1.5} />
								</div>
								<p className="text-xl font-bold text-foreground mb-1">No Categories Found</p>
								<p className="text-sm">Create a new category to get started with your gallery.</p>
								<Button
									variant="outline"
									onClick={() => setOpenModal(true)}
									className="mt-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
								>
									<PlusIcon size={16} className="mr-2" />
									Create Category
								</Button>
							</div>
						)}
					</div>
				</div>
				
				{/* Pagination */}
				<div className={`flex items-center justify-between p-6 border-t border-border/50 bg-muted/10 ${data?.data?.length > 0 ? "block" : "hidden"}`}>
					<div className="text-sm text-muted-foreground">
						Showing Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => {setPage(page - 1); window.scrollTo(0, 0)}}
							disabled={page === 1}
							className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-95">
							<ArrowLeft size={16} />
							Prev
						</button>
						<button
							onClick={() => {setPage(page + 1); window.scrollTo(0, 0)}}
							disabled={page === totalPages}
							className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm hover:shadow hover:scale-[1.02] active:scale-95">
							Next
							<ArrowRight size={16} />
						</button>
					</div>
				</div>
			</div>
			
			{(openModal || editCategory) && (
				<ModalGalleryCategory
					open={openModal || editCategory}
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
					open={viewImages}
					closed={() => {
						setViewImages(null);
						refetch();
					}}
					details={viewImages}
				/>
			)}
		</>
	);
};

export default Gallery;
