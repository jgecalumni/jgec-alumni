"use client";
import React, { memo, useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import "react-quill/dist/quill.snow.css";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { SelectField } from "../ui/select";
import dynamic from "next/dynamic";
import { useGetAllMembersQuery } from "@/store/feature/member-feature";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import * as Yup from "yup";
import {
	useAddScholarshipsMutation,
	useEditScholarshipsMutation,
} from "@/store/feature/scholarship-feature";
import toast from "react-hot-toast";
import { MultiSelect } from "../ui/multiselect";
import Image from "next/image";

interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}

const validationSchema = Yup.object().shape({
	name: Yup.string()
		.required("Scholarship name is required")
		.max(200, "Scholarship name should be less than 200 characters"),
	description: Yup.string().required("Scholarship description is required"),
	providerName: Yup.string().required("Provider name is required"),
	providerDescription: Yup.string().required(
		"Provider description is required"
	),
	whoCanApply: Yup.string()
		.required("Who can apply is required")
		.max(500, "Who can apply should be less than 500 characters"),
	whenToApply: Yup.string()
		.required("When to apply is required")
		.max(500, "When to apply should be less than 500 characters"),
	ageLimit: Yup.string()
		.required("Age limit is required")
		.max(500, "Age limit should be less than 500 characters"),
	amountDetails: Yup.string()
		.required("Amount details is required")
		.max(500, "Amount details should be less than 500 characters"),
	// array should not be empty
	semRequire: Yup.array().min(1, "At least 1 semester is required"),
});

const semOptions = [
	{ label: "1st Sem", value: "1st Sem" },
	{ label: "2nd Sem", value: "2nd Sem" },
	{ label: "3rd Sem", value: "3rd Sem" },
	{ label: "4th Sem", value: "4th Sem" },
	{ label: "5th Sem", value: "5th Sem" },
	{ label: "6th Sem", value: "6th Sem" },
	{ label: "7th Sem", value: "7th Sem" },
	{ label: "8th Sem", value: "8th Sem" },
];

const ModalScholarshipEdit: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		const [addScholarship, { isLoading, isError, error }] =
			useAddScholarshipsMutation();
		const [
			editScholarship,
			{ isLoading: isEditing, isError: isEditError, error: editError },
		] = useEditScholarshipsMutation();
		const [imagePreview, setImagePreview] = useState<string | null>(null);
		const handleFileChange = (
			event: React.ChangeEvent<HTMLInputElement>,
			setFieldValue: any
		) => {
			const file = event.target.files?.[0];
			setFieldValue("providerImage", file);

			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target?.result) {
						setImagePreview(e.target.result as string);
					}
				};
				reader.readAsDataURL(file);
			} else {
				setImagePreview(null);
			}
		};
		useEffect(() => {
			if (details?.providerImage) {
				setImagePreview(details.providerImage);
			}
		}, [details]);

		useEffect(() => {
			if (isEditError) {
				toast.error(
					(editError as any)?.data?.message || "Failed to update scholarship"
				);
			}
			if (isError) {
				toast.error(
					(error as any)?.data?.message || "Failed to add scholarship"
				);
			}
		}, [isError, error, isEditError, editError]);

		const handelSubmit = async (values: any) => {
			let sem = values.semRequire.join(",");			
			const formData = new FormData();
			formData.append("name", values.name);
			formData.append("subtitle", values.subtitle);
			formData.append("description", values.description);
			formData.append("providerName", values.providerName);
			formData.append("providerDepartment", values.providerDepartment);
			formData.append("providerPassingYear", values.providerPassingYear);
			formData.append("providerImage", values.providerImage);
			formData.append("providerDescription", values.providerDescription);
			formData.append("whoCanApply", values.whoCanApply);
			formData.append("whenToApply", values.whenToApply);
			formData.append("ageLimit", values.ageLimit);
			formData.append("amountDetails", values.amountDetails);
			formData.append("semRequire", sem);
			formData.append("isActive", values.isActive);
			formData.append("department", values.department);
			if (values.startDate) formData.append("startDate", values.startDate);
			if (values.endDate) formData.append("endDate", values.endDate);
			if (details) {
				if (!values.semRequire.length) {
					sem = details.semRequire;
				}
				const res = await editScholarship({
					id: details.id,
					formData,
				});
				if (res?.data?.success) {
					toast.success("Scholarship updated successfully");
					closed();
				}
			} else {
				const res = await addScholarship(formData);
				if (res?.data?.success) {
					toast.success("Scholarship added successfully");
					closed();
				}
			}
		};

		return (
			<>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-3xl modal-scrollbar p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl bg-card max-h-[85vh] flex flex-col">
						<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border/50 m-0 shrink-0">
							<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
								<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
									{details ? (
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
									)}
								</div>
								{!details ? "Add New Scholarship" : "Update Scholarship"}
							</DialogTitle>
						</DialogHeader>
						<div className="px-6 py-4 overflow-y-auto no-scrollbar">
							<Formik
								enableReinitialize={true}
								initialValues={{
									name: details?.name || "",
									subtitle: details?.subtitle || "",
									description: details?.description || "",
									providerName: details?.providerName || "",
									providerImage: details?.providerImage || "",
									providerDepartment: details?.providerDepartment || "",
									providerPassingYear: details?.providerPassingYear || "",
									providerDescription: details?.providerDescription || "",
									whoCanApply: details?.whoCanApply || "",
									whenToApply: details?.whenToApply || "null",
									ageLimit: details?.ageLimit || "null",
									amountDetails: details?.amountDetails || "",
									semRequire: details?.semRequire?.split[","] || [],
									isActive: details?.isActive,
									department: details?.department,
									startDate: details?.startDate ? new Date(details.startDate).toISOString().substring(0, 10) : "",
									endDate: details?.endDate ? new Date(details.endDate).toISOString().substring(0, 10) : "",
								}}
								onSubmit={handelSubmit}
								validationSchema={validationSchema}
								>
								{({ handleChange, values, setFieldValue }) => (
									<Form className="space-y-6">
										<div className="space-y-1.5">
											<Label htmlFor="name" className="font-semibold text-foreground">Scholarship Name</Label>
											<Input
												id="name"
												name="name"
												placeholder="Scholarship Name"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												onChange={handleChange}
												value={values.name}
											/>
											<ErrorMessage
												name="name"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="subtitle" className="font-semibold text-foreground">Subtitle</Label>
											<Input
												id="subtitle"
												name="subtitle"
												placeholder="Subtitle for scholarship"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												onChange={handleChange}
												value={values.subtitle}
											/>
											<ErrorMessage
												name="name"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="description" className="font-semibold text-foreground">
												Scholarship Description
											</Label>
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
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										{/* <div>
											<SelectField
												name="providerId"
												label="Select Scholarship Provider"
												defaultValue={
													values.providerId
														? options.find(
																(option) =>
																	Number(option.value) ===
																	Number(values.providerId)
														  )?.label || ""
														: "Select Provider"
												}
												data={options}
												onValueChange={(value) =>
													setFieldValue("providerId", value)
												}
												value={
													options.find(
														(option) =>
															Number(option.value) === Number(values.providerId)
													)?.label || ""
												}
											/>
											<ErrorMessage
												name="providerId"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div> */}
										<div className="space-y-1.5">
											<Label htmlFor="providerName" className="font-semibold text-foreground">Provider Name</Label>
											<Input
												name="providerName"
												id="providerName"
												placeholder="Enter Provider Name"
												value={values.providerName}
												onChange={handleChange}
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
											/>
											<ErrorMessage
												name="provideName"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="providerImage" className="font-semibold text-foreground">Provider Image</Label>
											<div className="lg:flex items-center gap-2">
												<Input
													name="providerImage"
													id="providerImage"
													type="file"
													accept="image/*"
													onChange={(e) => handleFileChange(e, setFieldValue)}
													className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												/>
												{imagePreview && (
													<div className="mt-2">
														<Image
															src={imagePreview}
															alt="Provider Image"
															width={120}
															height={120}
															className="rounded-lg"
														/>
													</div>
												)}
											</div>
											<ErrorMessage
												name="event_thumbnail"
												component="div"
												className="text-red-500 text-xs mt-1.5"
											/>
										</div>
										<div>
											<SelectField
												name="providerDepartment"
												label="Provider Department"
												defaultValue={`${
													values.providerDepartment
														? values.providerDepartment
														: "Select provider department"
												}`}
												data={[
													{ label: "CSE", value: "CSE" },
													{ label: "IT", value: "IT" },
													{ label: "ECE", value: "ECE" },
													{ label: "EE", value: "EE" },
													{ label: "ME", value: "ME" },
													{ label: "CE", value: "CE" },
													{ label: "Not Mentioned", value: "Not Mentioned" },
												]}
												onValueChange={(value) =>
													setFieldValue("providerDepartment", value)
												}
												value={values.providerDepartment}
											/>
											<ErrorMessage
												name="providerDepartment"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="providerPassingYear" className="font-semibold text-foreground">
												Provider passing year
											</Label>
											<Input
												name="providerPassingYear"
												id="providerPassingYear"
												placeholder="Enter the provider passing year"
												type="number"
												onChange={handleChange}
												value={values.providerPassingYear}
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="providerDescription" className="font-semibold text-foreground">
												Provider Description/History
											</Label>
											<div className="rounded-xl overflow-hidden border border-border/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-muted/20 focus-within:bg-background [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border/60 [&_.ql-toolbar]:bg-muted/10">
												<ReactQuill
												theme="snow"
												value={values.providerDescription}
												onChange={(content) =>
													setFieldValue("providerDescription", content)
												}
												className="text_editor border-none"
											/>
										</div>
											<ErrorMessage
												name="providerDescription"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="whoCanApply" className="font-semibold text-foreground">Who can apply?</Label>
											<Textarea
												id="whoCanApply"
												name="whoCanApply"
												placeholder="Who can apply to the scholarship..."
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full min-h-[100px]"
												onChange={handleChange}
												value={values.whoCanApply}
											/>
											<ErrorMessage
												name="whoCanApply"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										{/* <div className="space-y-1.5">
											<Label htmlFor="ageLimit" className="font-semibold text-foreground">Age Limit</Label>
											<Textarea
												id="ageLimit"
												name="ageLimit"
												placeholder="Age Limit"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full min-h-[100px]"
												onChange={handleChange}
												value={values.ageLimit}
											/>
											<ErrorMessage
												name="ageLimit"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="whenToApply" className="font-semibold text-foreground">
												When to apply this scholarship ?
											</Label>
											<Textarea
												id="whenToApply"
												name="whenToApply"
												placeholder="When to apply this scholarship ?"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full min-h-[100px]"
												onChange={handleChange}
												value={values.whenToApply}
											/>
											<ErrorMessage
												name="whenToApply"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div> */}
										<div className="space-y-1.5">
											<Label htmlFor="amountDetails" className="font-semibold text-foreground">
												Scholarship Amount Details
											</Label>
											<Textarea
												id="amountDetails"
												name="amountDetails"
												placeholder="Scholarship Amount Details"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full min-h-[100px]"
												onChange={handleChange}
												value={values.amountDetails}
											/>
											<ErrorMessage
												name="amountDetails"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="semRequire" className="font-semibold text-foreground pb-1">
												Select required semester result for this scholarship
											</Label>
											<MultiSelect
												options={semOptions}
												onValueChange={(value) =>
													setFieldValue("semRequire", value)
												}
												defaultValue={
													details?.semRequire
														? details.semRequire.split(",")
														: []
												}
												placeholder="Select semester"
												footer={false}
												needSearch={false}
												selectAllField={false}
												animation={0}
												maxCount={8}
											/>
											<ErrorMessage
												name="semRequire"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<SelectField
												name="isActive"
												label="Is Active?"
												defaultValue={
													values.isActive === true ||
													values.isActive === false
														? values.isActive === true
															? "Yes"
															: "No"
														: "Select Yes or No"
												}
												data={[
													{ label: "Yes", value: "Yes" },
													{ label: "No", value: "No" },
												]}
												onValueChange={(value) =>
													setFieldValue("isActive", value)
												}
												value={values.isActive}
											/>
											<ErrorMessage
												name="isActive"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div>
											<SelectField
												name="department"
												label="Department"
												defaultValue={`${
													values.department
														? values.department
														: "Select which department can apply"
												}`}
												data={[
													{ label: "CSE", value: "CSE" },
													{ label: "IT", value: "IT" },
													{ label: "ECE", value: "ECE" },
													{ label: "EE", value: "EE" },
													{ label: "ME", value: "ME" },
													{ label: "CE", value: "CE" },
													{ label: "All", value: "All" },
												]}
												onValueChange={(value) =>
													setFieldValue("department", value)
												}
												value={values.department}
											/>
											<ErrorMessage
												name="department"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-1.5">
												<Label htmlFor="startDate" className="font-semibold text-foreground">Start Date</Label>
												<Input
													id="startDate"
													name="startDate"
													type="date"
													className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
													onChange={handleChange}
													value={values.startDate}
												/>
												<ErrorMessage
													name="startDate"
													component={"div"}
													className="text-xs text-red-500 mt-1.5"
												/>
											</div>
											<div className="space-y-1.5">
												<Label htmlFor="endDate" className="font-semibold text-foreground">End Date</Label>
												<Input
													id="endDate"
													name="endDate"
													type="date"
													className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
													onChange={handleChange}
													value={values.endDate}
												/>
												<ErrorMessage
													name="endDate"
													component={"div"}
													className="text-xs text-red-500 mt-1.5"
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
											disabled={isLoading || isEditing}
										>
											{isLoading || isEditing ? (
												<><Loader2 className="animate-spin" size={16} /> Saving...</>
											) : (
												<>{!details ? "Publish Scholarship" : "Save Changes"}</>
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

ModalScholarshipEdit.displayName = "ModalScholarshipEdit";

export default ModalScholarshipEdit;
