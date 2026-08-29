"use client"

import React, { memo, useEffect, } from "react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Loader2, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ErrorMessage, Form, Formik } from "formik";
import dynamic from "next/dynamic";
import { useAddNewNoticeMutation, useUpdateNoticeMutation } from "@/store/feature/notice-feature";
import toast from "react-hot-toast";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import * as Yup from "yup";

interface IProps {
	open: boolean;
	closed: () => void;
	data: INoticeType | null;
}

const validateSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	description: Yup.string().required("Description is required"),
});


const ModalNoticeEdit: React.FC<IProps> = memo(({ open, closed, data }) => {
	const [addNotice, { isLoading, isError, error, isSuccess }] = useAddNewNoticeMutation();
	const [editNotice, { isLoading: editLoading, isError: editIsError, error: editError, isSuccess: editSuccess }] = useUpdateNoticeMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data.message || "Failed to add notice");
		}
		if (editIsError) {
			toast.error((editError as any)?.data.message || "Failed to update notice");
		}
	}, [isError, error, isSuccess, editIsError, editError, editSuccess]);

	const handelSubmit = async (values: any) => {
		const { title, description, date, file } = values;
		if (file && file.size > 2 * 1024 * 1024) {
			toast.error("File size must be less than 2MB");
			return;
		}
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("date", date);
		formData.append("file", file);
		if (data) {
			const res = await editNotice({ formData, id: data.id }); 
			if (res?.data?.success) {
				toast.success("Notice updated successfully");
				closed();
			}
		}
		else { 
			const res = await addNotice(formData);
			if (res?.data?.success) {
				toast.success("Notice added successfully");
				closed();
			}
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={closed}>
				<DialogContent className="sm:max-w-3xl modal-scrollbar p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl bg-card max-h-[85vh] flex flex-col">
					<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border/50 m-0 shrink-0">
						<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
							<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
								{data ? (
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
								)}
							</div>
							{!data ? "Create New Notice" : "Update Notice"}
						</DialogTitle>
					</DialogHeader>
					<div className="px-6 py-4 overflow-y-auto">
						<Formik
							enableReinitialize={true}
							initialValues={{
								title: data?.title || "",
								description: data?.description || "",
								date: data?.date || new Date().toLocaleDateString(),
								file: null
							}}
							validationSchema={validateSchema}
							onSubmit={handelSubmit}>
							{({ handleChange, values, setFieldValue }) => (
								<Form className="space-y-6">
									<div className="space-y-1.5">
										<Label htmlFor="title" className="font-semibold text-foreground">Notice Title <span className="text-destructive">*</span></Label>
										<Input
											id="title"
											name="title"
											placeholder="Enter an eye-catching title..."
											className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2"
											onChange={handleChange}
											value={values.title}
										/>
										<ErrorMessage
											name="title"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="description" className="font-semibold text-foreground">Notice Description <span className="text-destructive">*</span></Label>
										<div className="rounded-xl overflow-hidden border border-border/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-muted/20 focus-within:bg-background [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border/60 [&_.ql-toolbar]:bg-muted/10">
											<ReactQuill
												theme="snow"
											value={values.description}
											onChange={(content) =>
												setFieldValue("description", content)
											}
												className="text_editor border-none"
											/>
										</div>
										<ErrorMessage
											name="description"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<div className="space-y-1.5">
											<Label htmlFor="date" className="font-semibold text-foreground">Publication Date <span className="text-destructive">*</span></Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														className={cn(
															"w-full justify-start text-left font-normal rounded-xl border-border/60 bg-muted/20 hover:bg-background transition-colors px-4 py-2",
															!values.date && "text-muted-foreground"
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{values.date ? format(new Date(values.date), "PPP") : <span>Pick a date</span>}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={values.date ? new Date(values.date) : undefined}
														onSelect={(date) => {
															setFieldValue("date", date ? date.toISOString() : "");
														}}
													/>
												</PopoverContent>
											</Popover>
											<ErrorMessage
												name="date"
												component="div"
												className="text-red-500 text-xs mt-1.5"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="link" className="font-semibold text-foreground">Attachment (Optional)</Label>
											<Input
												name="link"
												id="link"
												type="file"
												onChange={(e) => setFieldValue("file", e?.target?.files ? e.target.files[0] : "")}
												className="rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer h-10 w-full"
											/>
										</div>
									</div>
									<div className="flex justify-end gap-3 items-center w-full pt-6 pb-2 border-t border-border/50 mt-8">
										<Button 
											type="button" 
											variant="outline" 
											onClick={closed} 
											className="rounded-xl font-medium px-5"
										>
											Cancel
										</Button>
										<Button
											type="submit"
											className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 font-medium px-6 flex items-center gap-2"
											disabled={isLoading || editLoading}
										>
											{isLoading || editLoading ? (
												<><Loader2 className="animate-spin" size={16} /> Saving...</>
											) : (
												<>{!data ? "Publish Notice" : "Save Changes"}</>
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
});

ModalNoticeEdit.displayName = "ModalNoticeEdit";

export default ModalNoticeEdit;
