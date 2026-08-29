import { memo, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ErrorMessage, Form, Formik } from "formik";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Trash2, UploadCloud, FolderOpen, SearchX } from "lucide-react";
import {
	useCreateCategoryMutation,
	useDeleteImageMutation,
	useGetImageByIdQuery,
	useUpdateCategoryMutation,
	useUploadImageMutation,
} from "@/store/feature/gallery-feature";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Image from "next/image";

interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}

const validateSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
});

export const ModalGalleryCategory: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		const [createCategory, { isLoading, isError, error }] =
			useCreateCategoryMutation({});
		const [
			upadateCategory,
			{ isLoading: updateLoading, isError: isUpdateError, error: updateError },
		] = useUpdateCategoryMutation();
		useEffect(() => {
			if (isError) {
				toast.error((error as any)?.data.message || "Failed to add category");
			}
			if (isUpdateError) {
				toast.error(
					(updateError as any)?.data.message || "Failed to update category"
				);
			}
		}, [isError, error, isUpdateError, updateError]);

		const handleSubmit = async (values: any) => {
			console.log(values);

			if (details) {
				const res = await upadateCategory({
					id: details.id,
					values,
				});
				if (res.data?.success) {
					closed();
					toast.success(res.data.message);
				}
			} else {
				const res = await createCategory(values);
				if (res.data?.success) {
					closed();
					toast.success(res.data.message);
				}
			}
		};

		return (
			<>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-lg modal-scrollbar p-0 overflow-hidden border-border/50 shadow-2xl rounded-3xl bg-card/95 backdrop-blur-xl">
						<DialogHeader className="bg-muted/30 px-6 py-6 border-b border-border/50 m-0 shrink-0 relative">
							<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
							<DialogTitle className="text-2xl font-bold flex items-center gap-3 text-foreground">
								<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl shadow-inner border border-indigo-200 dark:border-indigo-800">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
								</div>
								{!details ? "Add New Category" : "Update Category"}
							</DialogTitle>
						</DialogHeader>
						<div className="px-8 py-6 overflow-y-auto no-scrollbar">
							<Formik
								enableReinitialize={true}
								initialValues={{
									name: details?.name || "",
								}}
								validationSchema={validateSchema}
								onSubmit={handleSubmit}>
								{({ handleChange, values, setFieldValue }) => (
									<Form className="space-y-6">
										<div className="space-y-2">
											<Label htmlFor="name" className="font-semibold text-foreground text-sm uppercase tracking-wide">Category Name</Label>
											<Input
												id="name"
												name="name"
												placeholder="e.g. Annual Sports Meet 2024"
												className="text-base rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-3 w-full shadow-inner focus:shadow-md"
												onChange={handleChange}
												value={values.name}
											/>
											<ErrorMessage
												name="name"
												component="div"
												className="text-red-500 text-xs font-medium mt-1.5 ml-1"
											/>
										</div>

										<div className="flex justify-end gap-3 items-center w-full pt-8 pb-2 mt-4">
											<Button 
												type="button" 
												variant="outline" 
												onClick={closed} 
												className="rounded-xl font-medium px-6 py-2.5 h-auto hover:bg-muted/80 transition-colors"
											>
												Cancel
											</Button>
											<Button
												type="submit"
												className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 font-semibold px-8 py-2.5 h-auto flex items-center gap-2"
												disabled={isLoading || updateLoading}
											>
												{isLoading || updateLoading ? (
													<><Loader2 className="animate-spin" size={18} /> Saving...</>
												) : (
													<>{!details ? "Add Category" : "Save Changes"}</>
												)}
											</Button>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					</DialogContent>
				</Dialog>
			</>
		);
	}
);
ModalGalleryCategory.displayName = "ModalGalleryCategory";

export const ModalGalleryImageUpload: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		const [imagePreviews, setImagePreviews] = useState<string[]>([]);
		const [uploadImage, { isLoading, isError, error }] =
			useUploadImageMutation();

		const handleFileChange = (
			event: React.ChangeEvent<HTMLInputElement>,
			setFieldValue: any
		) => {
			const files = event.target.files;
			if (!files) return;

			const imageArray: string[] = [];
			const fileArray: File[] = [];

			Array.from(files).forEach((file) => {
				fileArray.push(file);
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target?.result) {
						imageArray.push(e.target.result as string);
						setImagePreviews([...imageArray]);
					}
				};
				reader.readAsDataURL(file);
			});

			setFieldValue("images", fileArray);
		};

		useEffect(() => {
			if (isError) {
				toast.error((error as any)?.data.message || "Failed to upload image");
			}
		}, [isError, error]);

		const handleSubmit = async (values: any) => {
			const formData = new FormData();			
			values.images.forEach((file: any) => {
				formData.append("images", file);
			});
			const res = await uploadImage({ id: details, formData });
			if (res.data?.success) {
				closed();
				toast.success(res.data.message);
			}
		};

		return (
			<Dialog
				open={open}
				onOpenChange={closed}>
				<DialogContent className="sm:max-w-2xl modal-scrollbar p-0 overflow-hidden border-border/50 shadow-2xl rounded-3xl bg-card/95 backdrop-blur-xl">
					<DialogHeader className="bg-muted/30 px-6 py-6 border-b border-border/50 m-0 shrink-0 relative">
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
						<DialogTitle className="text-2xl font-bold flex items-center gap-3 text-foreground">
							<div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl shadow-inner border border-emerald-200 dark:border-emerald-800">
								<UploadCloud size={20} strokeWidth={2.5} />
							</div>
							Upload Photos
						</DialogTitle>
					</DialogHeader>
					<div className="px-8 py-6">
						<Formik
							enableReinitialize={true}
							initialValues={{
								images: details?.images || [],
							}}
							onSubmit={(values) => {
								handleSubmit(values);
							}}>
							{({ handleChange, values, setFieldValue }) => (
								<Form className="space-y-6">
									<div className="space-y-3">
										<Label htmlFor="images" className="font-semibold text-foreground text-sm uppercase tracking-wide">Select Photos</Label>
										
										<div className="relative group">
											<div className="absolute inset-0 bg-emerald-500/5 rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 group-hover:bg-emerald-500/10 group-hover:border-emerald-400 dark:group-hover:border-emerald-600 transition-all pointer-events-none z-0"></div>
											<div className="relative z-10 flex flex-col items-center justify-center py-10 px-6 text-center cursor-pointer">
												<div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3 text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:scale-110 transition-transform">
													<UploadCloud size={32} />
												</div>
												<p className="text-base font-semibold text-foreground mb-1">Click to upload photos</p>
												<p className="text-sm text-muted-foreground">or drag and drop multiple images here</p>
												<p className="text-xs text-muted-foreground mt-2 font-medium bg-muted px-2 py-1 rounded-md">JPG, PNG, GIF up to 10MB</p>
												<Input
													name="images"
													id="images"
													type="file"
													accept="image/*"
													multiple
													onChange={(e) => handleFileChange(e, setFieldValue)}
													className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
												/>
											</div>
										</div>

										{/* Image Previews */}
										{imagePreviews.length > 0 && (
											<div className="mt-6">
												<Label className="font-semibold text-foreground text-sm uppercase tracking-wide mb-3 block">Previews ({imagePreviews.length})</Label>
												<div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-[220px] overflow-y-auto no-scrollbar p-2 -mx-2">
													{imagePreviews.map((src, index) => (
														<div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-border">
															<Image
																src={src}
																alt={`Thumbnail ${index + 1}`}
																fill
																className="object-cover group-hover:scale-110 transition-transform duration-500"
															/>
															<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
																<Trash2 size={16} className="text-white drop-shadow-md cursor-pointer hover:text-red-400 transition-colors" onClick={() => {
																	const newPreviews = [...imagePreviews];
																	newPreviews.splice(index, 1);
																	setImagePreviews(newPreviews);
																	
																	const newValues = [...values.images];
																	newValues.splice(index, 1);
																	setFieldValue("images", newValues);
																}} />
															</div>
														</div>
													))}
												</div>
											</div>
										)}

										<ErrorMessage
											name="images"
											component="div"
											className="text-red-500 text-xs font-medium mt-1.5 ml-1"
										/>
									</div>
									
									<div className="flex justify-end gap-3 items-center w-full pt-6 pb-2 border-t border-border/50 mt-4">
										<Button 
											type="button" 
											variant="outline" 
											onClick={closed} 
											className="rounded-xl font-medium px-6 py-2.5 h-auto hover:bg-muted/80 transition-colors"
										>
											Cancel
										</Button>
										<Button
											type="submit"
											className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 font-semibold px-8 py-2.5 h-auto flex items-center gap-2"
											disabled={isLoading || values.images.length === 0}
										>
											{isLoading ? (
												<><Loader2 className="animate-spin" size={18} /> Uploading...</>
											) : (
												<>Upload {values.images.length > 0 ? values.images.length : ''} Photos</>
											)}
										</Button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</DialogContent>
			</Dialog>
		);
	}
);

ModalGalleryImageUpload.displayName = "ModalGalleryImageUpload";

export const ModalGalleryImageView: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		const [loadingId, setLoadingId] = useState<string | null>(null);
		const { data, isLoading, isError, error, refetch } = useGetImageByIdQuery(details.id);

		const [deleteImage, { error: deleteError, isError: isDeleteError }] = useDeleteImageMutation();

		useEffect(() => {
			if (open) {
				refetch();
			}
		}, [open, refetch]);

		useEffect(() => {
			if (isError) {
				toast.error((error as any)?.data.message || "Failed to fetch images");
			}
			if (isDeleteError) {
				toast.error((deleteError as any)?.data.message || "Failed to delete image");
			}
		}, [isError, error, isDeleteError, deleteError]);

		const handleDelete = async (id: string) => {
			setLoadingId(id); 
			const res = await deleteImage(id);
			setLoadingId(null); 
			if (res?.data?.success) {
				toast.success("Image deleted successfully");
				refetch(); 
			}
		};

		return (
			<Dialog open={open} onOpenChange={closed}>
				<DialogContent className="sm:max-w-4xl w-full modal-scrollbar p-0 overflow-hidden border-border/50 shadow-2xl rounded-3xl bg-card/95 backdrop-blur-xl h-[85vh] flex flex-col">
					<DialogHeader className="bg-muted/30 px-6 py-6 border-b border-border/50 m-0 shrink-0 relative">
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
						<div className="flex items-center justify-between">
							<DialogTitle className="text-2xl font-bold flex items-center gap-3 text-foreground">
								<div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 p-2.5 rounded-xl shadow-inner border border-blue-200 dark:border-blue-800">
									<FolderOpen size={20} strokeWidth={2.5} />
								</div>
								Gallery: <span className="text-muted-foreground ml-1 font-medium">{details?.name}</span>
							</DialogTitle>
						</div>
					</DialogHeader>
					
					<div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-muted/5">
						{isLoading ? (
							<div className="flex h-full flex-col justify-center items-center w-full gap-4">
								<Loader2 className="animate-spin text-blue-500" size={40} />
								<p className="text-muted-foreground font-medium animate-pulse">Loading gallery images...</p>
							</div>
						) : (
							<div className="h-full">
								{data?.data?.length === 0 ? (
									<div className="flex flex-col items-center justify-center h-full text-muted-foreground">
										<div className="bg-muted/30 p-6 rounded-full mb-4 border border-dashed border-border">
											<SearchX size={48} className="opacity-40" />
										</div>
										<p className="text-xl font-bold text-foreground mb-1">No images found</p>
										<p className="text-sm">This gallery is currently empty. Upload some photos to get started!</p>
									</div>
								) : (
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-max">
										{data?.data.map((image: any) => (
											<div key={image.id} className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-border/50 aspect-square bg-muted/20">
												<Image
													src={image.image}
													alt="Gallery Image"
													fill
													sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
													className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
													<button
														className="self-end bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
														onClick={() => handleDelete(image.id)}
														disabled={loadingId === image.id}
														title="Delete Image"
													>
														{loadingId === image.id ? (
															<Loader2 size={16} className="animate-spin" />
														) : (
															<Trash2 size={16} />
														)}
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		);
	}
);


ModalGalleryImageView.displayName = "ModalGalleryImageView";
