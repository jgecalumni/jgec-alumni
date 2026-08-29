import { Dialog } from "@radix-ui/react-dialog";
import { memo, useEffect, useState, useRef } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ErrorMessage, Form, Formik } from "formik";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, X, UploadCloud, FilePenLine, FileText } from "lucide-react";
import toast from "react-hot-toast";
import {
	useAddAgmMomDocsMutation,
	useAddauditReportDocsMutation,
	useAddGivingBackDocsMutation,
	useAddKanchenungaDocsMutation,
	useAddScholDocsMutation,
	useUpdateAgmMomDocsMutation,
	useUpdateauditReportDocsMutation,
	useUpdateGivingBackDocsMutation,
	useUpdateKanchenungaDocsMutation,
	useUpdateScholDocsMutation,
} from "@/store/feature/document-feature";

interface IProps {
	open: boolean;
	closed: () => void;
	data: any | null;
}

interface BaseDocumentModalProps extends IProps {
	useAddMutation: any;
	useUpdateMutation: any;
}

const BaseDocumentModal: React.FC<BaseDocumentModalProps> = ({
	open,
	closed,
	data,
	useAddMutation,
	useUpdateMutation,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [addDocs, { isLoading: addLoading, isError: addIsError, error: addError }] =
		useAddMutation();
	const [editDocs, { isLoading: editLoading, isError: editIsError, error: editError }] =
		useUpdateMutation();

	const handleFileChange = (file: File | null, setFieldValue: any) => {
		if (file) {
			if (file.type !== "application/pdf") {
				toast.error("Please upload a valid PDF document");
				return;
			}
			if (file.size > 10 * 1024 * 1024) {
				toast.error("File size must be less than 10MB");
				return;
			}
			setFieldValue("file", file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const removeFile = (setFieldValue: any) => {
		setFieldValue("file", null);
		setPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handelSubmit = async (values: any) => {
		const { title, file } = values;
		if (file && file.size > 10 * 1024 * 1024) {
			toast.error("File size must be less than 10MB");
			return;
		}
		const formData = new FormData();
		formData.append("title", title);
		if (file) formData.append("file", file);

		if (data) {
			const res = await editDocs({ formData, id: data.id });
			if (res?.data?.success) {
				toast.success("Document updated successfully");
				closed();
			}
		} else {
			if (!file) {
				toast.error("Please select a document to upload");
				return;
			}
			const res = await addDocs(formData);
			if (res?.data?.success) {
				toast.success("Document added successfully");
				closed();
			}
		}
	};

	useEffect(() => {
		if (addIsError) {
			toast.error((addError as any)?.data?.message || "Failed to add Document");
		}
		if (editIsError) {
			toast.error((editError as any)?.data?.message || "Failed to update Document");
		}
		if (data && data.link) {
			setPreviewUrl(data.link);
		}
	}, [addIsError, addError, editIsError, editError, data]);

	const isLoading = addLoading || editLoading;

	return (
		<Dialog open={open} onOpenChange={closed}>
			<DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-border shadow-2xl rounded-2xl bg-card">
				<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border m-0 shrink-0">
					<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
						<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-lg">
							{!data ? <UploadCloud size={20} strokeWidth={2.5} /> : <FilePenLine size={20} strokeWidth={2.5} />}
						</div>
						{!data ? "Upload New Document" : "Update Document"}
					</DialogTitle>
				</DialogHeader>
				<div className="px-6 py-6 overflow-y-auto max-h-[75vh]">
					<Formik
						enableReinitialize={true}
						initialValues={{
							title: data?.title || "",
							file: null,
						}}
						onSubmit={handelSubmit}
					>
						{({ handleChange, values, setFieldValue }) => (
							<Form className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="title" className="font-semibold text-foreground text-sm">
										Document Title
									</Label>
									<Input
										id="title"
										name="title"
										placeholder="e.g. Audit Report 2024-2025"
										className="h-11 rounded-xl border-border bg-background focus-visible:ring-indigo-500/30 transition-all w-full px-4"
										onChange={handleChange}
										value={values.title}
										required
									/>
									<ErrorMessage name="title" component="div" className="text-destructive text-xs mt-1.5 font-medium" />
								</div>
								
								<div className="space-y-2">
									<Label className="font-semibold text-foreground text-sm">Upload PDF</Label>
									{!previewUrl ? (
										<div
											className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all duration-300 ${
												isDragging
													? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
													: "border-border hover:bg-muted/30 hover:border-indigo-400/50"
											}`}
											onDragOver={(e) => {
												e.preventDefault();
												setIsDragging(true);
											}}
											onDragLeave={() => setIsDragging(false)}
											onDrop={(e) => {
												e.preventDefault();
												setIsDragging(false);
												if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
													handleFileChange(e.dataTransfer.files[0], setFieldValue);
												}
											}}
											onClick={() => fileInputRef.current?.click()}
										>
											<input
												ref={fileInputRef}
												type="file"
												accept="application/pdf"
												onChange={(e) => {
													const file = e.target.files ? e.target.files[0] : null;
													handleFileChange(file, setFieldValue);
												}}
												className="hidden"
											/>
											<div className="flex flex-col items-center justify-center pt-5 pb-6 text-center cursor-pointer">
												<div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-3 shadow-sm">
													<UploadCloud size={24} />
												</div>
												<p className="mb-1 text-sm text-muted-foreground">
													<span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
												</p>
												<p className="text-xs text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-md">PDF document (MAX. 10MB)</p>
											</div>
										</div>
									) : (
										<div className="relative border border-border rounded-2xl overflow-hidden bg-muted/20 shadow-sm">
											<div className="flex items-center justify-between p-3 bg-muted/40 border-b border-border">
												<div className="flex items-center gap-2 px-1">
													<FileText size={18} className="text-indigo-500 shrink-0" />
													<span className="text-sm font-medium text-foreground truncate max-w-[300px]">
														{values.file ? (values.file as File).name : data?.title + ".pdf"}
													</span>
												</div>
												<button
													type="button"
													className="p-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors"
													onClick={() => removeFile(setFieldValue)}
													title="Remove file"
												>
													<X size={16} />
												</button>
											</div>
											<iframe
												src={previewUrl}
												className="w-full h-[40vh]"
												title="PDF Preview"
											/>
										</div>
									)}
								</div>
								
								<div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
									<Button
										type="button"
										variant="outline"
										onClick={closed}
										className="rounded-xl font-medium px-6 hover:bg-muted"
									>
										Cancel
									</Button>
									<Button
										type="submit"
										className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-medium px-6 flex items-center gap-2"
										disabled={isLoading}
									>
										{isLoading ? (
											<><Loader2 className="animate-spin" size={16} /> Saving...</>
										) : (
											<>{!data ? "Upload Document" : "Save Changes"}</>
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
};

// Exports

export const ModalDocumentsScholarship: React.FC<IProps> = memo((props) => (
	<BaseDocumentModal
		{...props}
		useAddMutation={useAddScholDocsMutation}
		useUpdateMutation={useUpdateScholDocsMutation}
	/>
));
ModalDocumentsScholarship.displayName = "ModalDocumentsScholarship";

export const ModalDocumentsKanchenjunga: React.FC<IProps> = memo((props) => (
	<BaseDocumentModal
		{...props}
		useAddMutation={useAddKanchenungaDocsMutation}
		useUpdateMutation={useUpdateKanchenungaDocsMutation}
	/>
));
ModalDocumentsKanchenjunga.displayName = "ModalDocumentsKanchenjunga";

export const ModalDocumentsGivingBack: React.FC<IProps> = memo((props) => (
	<BaseDocumentModal
		{...props}
		useAddMutation={useAddGivingBackDocsMutation}
		useUpdateMutation={useUpdateGivingBackDocsMutation}
	/>
));
ModalDocumentsGivingBack.displayName = "ModalDocumentsGivingBack";

export const ModalDocumentsAuditReport: React.FC<IProps> = memo((props) => (
	<BaseDocumentModal
		{...props}
		useAddMutation={useAddauditReportDocsMutation}
		useUpdateMutation={useUpdateauditReportDocsMutation}
	/>
));
ModalDocumentsAuditReport.displayName = "ModalDocumentsAuditReport";

export const ModalDocumentsAgmMom: React.FC<IProps> = memo((props) => (
	<BaseDocumentModal
		{...props}
		useAddMutation={useAddAgmMomDocsMutation}
		useUpdateMutation={useUpdateAgmMomDocsMutation}
	/>
));
ModalDocumentsAgmMom.displayName = "ModalDocumentsAgmMom";
