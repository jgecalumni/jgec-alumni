import React, { memo, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { IoAdd, IoCreateOutline, IoPulseOutline } from "react-icons/io5";
import { useAddEventMutation, useEditEventMutation } from "@/store/feature/event-feature";
import Image from "next/image";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import * as Yup from "yup";

interface IProps {
	open: boolean;
	closed: () => void;
	data: IEventType | null;
}

const validateSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	shortDescription: Yup.string().required("Short Description is required"),
	details: Yup.string().required("Details is required"),
	date: Yup.string().required("Date is required"),
	time: Yup.string().required("Time is required"),
	location: Yup.string().required("Location is required"),
	hostName: Yup.string().required("Host Name is required"),
	event_thumbnail: Yup.mixed().required("Event Thumbnail is required"),
	hostDetails: Yup.string().required("Host Details is required"),
	schedule: Yup.array().of(
		Yup.object().shape({
			startTime: Yup.string().required("Required*"),
			endTime: Yup.string().required("Required*"),
			activity: Yup.string().required("Required*"),
		})
	),
})

const ModalEventEdit: React.FC<IProps> = memo(({ open, closed, data }) => {
	const [addEvent, { isError, isLoading, error }] = useAddEventMutation();
	const [editEvent, { isLoading: editLoading, isError: editIsError, error: editError }] = useEditEventMutation();
	
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	useEffect(() => {
		if (editIsError) {
			toast.error((editError as any)?.data.message || "Failed to update event");
		}
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to add event");
			console.log((error as any)?.data?.message);
		}
		if (data?.event_thumbnail) {
			setImagePreview(data.event_thumbnail);
		}
	}, [isError, error, data, editError, editIsError]);
	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		setFieldValue: any
	) => {
		const file = event.target.files?.[0];
		setFieldValue("event_thumbnail", file);

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
	const handleSubmit = async (values: any) => {
		const {
			name,
			shortDescription,
			details,
			date,
			time,
			location,
			hostName,
			hostDetails,
			schedule,
			event_thumbnail,
		} = values;

		const formData = new FormData();
		formData.append("name", name);
		formData.append("shortDescription", shortDescription);
		formData.append("details", details);
		formData.append("date", date);
		formData.append("time", time);
		formData.append("location", location);
		formData.append("hostName", hostName);
		formData.append("hostDetails", hostDetails);
		formData.append("schedule", JSON.stringify(schedule));
		formData.append("event_thumbnail", event_thumbnail);
		if (data) {
			const res = await editEvent({ formData, id: data.id });
			if (res?.data?.success) {
				toast.success("Event updated successfully");
				closed();
			}
		}
		else {
			const res = await addEvent(formData);
			if (res?.data?.success) {
				toast.success("Event added successfully");
				closed();
			}
		}

	};

	return (
		<div>
			<Dialog
				open={open}
				onOpenChange={closed}>
				<DialogContent className="sm:max-w-3xl modal-scrollbar p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl bg-card max-h-[85vh] flex flex-col">
					<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border/50 m-0 shrink-0">
						<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
							<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
								{!data ? (
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
								)}
							</div>
							{!data ? "Add New Event" : "Update Event"}
						</DialogTitle>
					</DialogHeader>
					<div className="px-6 py-4 overflow-y-auto no-scrollbar">
						<Formik
							enableReinitialize={true}
							initialValues={{
								name: data?.name || "",
								shortDescription: data?.shortDescription || "",
								details: data?.details || "",
								event_thumbnail: data?.event_thumbnail || null,
								date: data?.date || '',
								time: data?.time || '',
								location: data?.location || "",
								hostName: data?.hostName || "",
								hostDetails: data?.hostDetails || "",
								schedule: data?.schedule?.length
									? data.schedule
									: [
										{
											startTime: "",
											endTime: "",
											activity: "",
										},
									],
							}}
							validationSchema={validateSchema}
							onSubmit={(values) => handleSubmit(values)}>
							{({ handleChange, values, setFieldValue }) => (
								<Form className="space-y-6">
									<div className="space-y-1.5">
										<Label htmlFor="name" className="font-semibold text-foreground">Name</Label>
										<Input
											id="name"
											name="name"
											placeholder="Name of the event"
											className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
											onChange={handleChange}
											value={values.name}
										/>
										<ErrorMessage
											name="name"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="shortDescription" className="font-semibold text-foreground">Short Description</Label>
										<Input
											id="shortDescription"
											name="shortDescription"
											placeholder="Short Description"
											className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
											onChange={handleChange}
											value={values.shortDescription}
										/>
										<ErrorMessage
											name="shortDescription"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="details" className="font-semibold text-foreground">Details</Label>
										<div className="rounded-xl overflow-hidden border border-border/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-muted/20 focus-within:bg-background [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border/60 [&_.ql-toolbar]:bg-muted/10">
												<ReactQuill
											theme="snow"
											value={values.details}
											onChange={(content) => setFieldValue("details", content)}
											className="text_editor border-none"
										/>
										</div>
										<ErrorMessage
											name="details"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="location" className="font-semibold text-foreground">Venue</Label>
										<Input
											id="location"
											name="location"
											placeholder="Venue of the event"
											className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
											onChange={handleChange}
											value={values.location}
										/>
										<ErrorMessage
											name="location"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="space-y-1.5">
											<Label htmlFor="date" className="font-semibold text-foreground">Select date</Label>
											<Input
												name="date"
												id="date"
												type="date"
												onChange={handleChange}
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												value={values.date}
											/>
											<ErrorMessage
												name="date"
												component="div"
												className="text-red-500 text-xs mt-1.5"
											/>
										</div>
										<div className="space-y-1.5">
											<Label htmlFor="time" className="font-semibold text-foreground">Select time</Label>
											<Input
												name="time"
												id="time"
												type="time"
												onChange={handleChange}
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												value={values.time}
											/>
											<ErrorMessage
												name="time"
												component="div"
												className="text-red-500 text-xs mt-1.5"
											/>
										</div>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="event_thumbnail" className="font-semibold text-foreground">Upload Thumbnail</Label>
										<div className="lg:flex items-center gap-2">
											<Input
												name="event_thumbnail"
												id="event_thumbnail"
												type="file"
												accept="image/*"
												onChange={(e) => handleFileChange(e, setFieldValue)}
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
											/>
											{imagePreview && (
												<div className="mt-2">
													<Image
														src={imagePreview}
														alt="Event Thumbnail"
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
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<Label className="font-semibold text-foreground">Schedule</Label>
										</div>
										<FieldArray name="schedule">
											{({ push, remove }) => (
												<div className="space-y-3">
													{values.schedule.map((_, index) => (
														<div
															key={index}
															className="bg-muted/30 dark:bg-muted/10 border border-border rounded-xl p-3 space-y-3"
														>
															<div className="flex items-center justify-between">
																<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session {index + 1}</span>
																{index !== 0 && (
																	<button
																		type="button"
																		onClick={() => remove(index)}
																		className="p-1.5 rounded-lg text-destructive bg-destructive/10 hover:bg-destructive hover:text-white transition-colors"
																	>
																		<MdDeleteOutline size={14} />
																	</button>
																)}
															</div>
															<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
																<div className="space-y-1">
																	<p className="text-xs font-medium text-muted-foreground">Start Time</p>
																	<Input
																		name={`schedule.${index}.startTime`}
																		placeholder="Start Time"
																		type="time"
																		value={values.schedule[index].startTime}
																		onChange={handleChange}
																		className="text-sm rounded-xl border-border/60 bg-background dark:bg-muted/20 text-foreground transition-colors px-4 py-2 w-full"
																	/>
																	<ErrorMessage name={`schedule.${index}.startTime`} component="div" className="text-red-500 text-xs" />
																</div>
																<div className="space-y-1">
																	<p className="text-xs font-medium text-muted-foreground">End Time</p>
																	<Input
																		name={`schedule.${index}.endTime`}
																		placeholder="End Time"
																		value={values.schedule[index].endTime}
																		onChange={handleChange}
																		type="time"
																		className="text-sm rounded-xl border-border/60 bg-background dark:bg-muted/20 text-foreground transition-colors px-4 py-2 w-full"
																	/>
																	<ErrorMessage name={`schedule.${index}.endTime`} component="div" className="text-red-500 text-xs" />
																</div>
															</div>
															<div className="space-y-1">
																<p className="text-xs font-medium text-muted-foreground">Activity</p>
																<Input
																	name={`schedule.${index}.activity`}
																	placeholder="Describe the activity..."
																	onChange={handleChange}
																	value={values.schedule[index].activity}
																	className="text-sm rounded-xl border-border/60 bg-background dark:bg-muted/20 text-foreground transition-colors px-4 py-2 w-full"
																/>
																<ErrorMessage name={`schedule.${index}.activity`} component="div" className="text-red-500 text-xs" />
															</div>
														</div>
													))}
													<button
														type="button"
														onClick={() => push({ startTime: "", endTime: "", activity: "" })}
														className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border hover:border-indigo-400 dark:hover:border-indigo-600 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-sm font-medium transition-all"
													>
														<IoAdd size={16} /> Add Session
													</button>
												</div>
											)}
										</FieldArray>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="hostName" className="font-semibold text-foreground">Host Name</Label>
										<Input
											id="hostName"
											name="hostName"
											placeholder="Host Name"
											className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
											onChange={handleChange}
											value={values.hostName}
										/>
										<ErrorMessage
											name="hostName"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="hostDetails" className="font-semibold text-foreground">Host Details</Label>
										<div className="rounded-xl overflow-hidden border border-border/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-muted/20 focus-within:bg-background [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border/60 [&_.ql-toolbar]:bg-muted/10">
												<ReactQuill
											theme="snow"
											value={values.hostDetails}
											onChange={(content) =>
												setFieldValue("hostDetails", content)
											}
											className="text_editor border-none"
										/>
										</div>
										<ErrorMessage
											name="hostDetails"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
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
												<>{!data ? "Publish Event" : "Save Changes"}</>
											)}
										</Button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
});

ModalEventEdit.displayName = "ModalEventEdit";

export default ModalEventEdit;
