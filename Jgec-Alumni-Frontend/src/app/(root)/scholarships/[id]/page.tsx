"use client";

import Loading from "@/app/Loader";
import { Button } from "@/components/ui/button";

import { InputField } from "@/components/ui/input";

import { SelectField } from "@/components/ui/select";
import { TextareaField } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ScholarshipSchema } from "@/schemas/ScholarshipSchema";
import {
	useApplyScholarshipMutation,
	useScholarshipsQuery,
} from "@/store/feature/scholarship-feature";

import { ErrorMessage, Formik, Form, useFormikContext } from "formik";
import { Loader, Send } from "lucide-react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import Image from "next/image";
import React, { useEffect, useState, use } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
interface EventParams {
	params: Promise<{ id: string }>;
}

const ScrollToError = () => {
	const { errors, submitCount, isSubmitting, isValidating } = useFormikContext();

	useEffect(() => {
		if (submitCount > 0 && !isSubmitting && !isValidating && Object.keys(errors).length > 0) {
			const firstErrorKey = Object.keys(errors)[0];
			const element = document.getElementsByName(firstErrorKey)[0];
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
				element.focus();
			}
		}
	}, [submitCount, isSubmitting, isValidating, errors]);

	return null;
};

const Page: React.FC<EventParams> = ({ params }: EventParams) => {
	const { id } = React.use(params);
	const { data, isLoading, isError, error } = useScholarshipsQuery(id);
	const [
		applyScholarship,
		{ isError: isapplyError, error: applyError, isLoading: applyLoading },
	] = useApplyScholarshipMutation();
	const [loading, setLoading] = useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState(1);
	const totalSteps = 4;
	const router = useRouter();

	useEffect(() => {
		if (isError) {
			toast.error(
				(error as any)?.data?.message || "Failed to fetch scholarship"
			);
		}
		if (isapplyError) {
			toast.error(
				(applyError as any)?.data?.message || "Failed to apply scholarship"
			);
		}
	}, [isError, error, applyError, isapplyError]);

	if (isLoading) {
		return <Loading />;
	}

	const handleFormSubmit = async (values: any) => {
		console.log(values);

		const now = new Date();

		const startDateStr = data?.data.startDate;
		const endDateStr = data?.data.endDate;

		if (!startDateStr || !endDateStr) {
			toast.error("Application window is not configured for this scholarship.");
			return;
		}

		const startDate = new Date(startDateStr);
		const endDate = new Date(endDateStr);

		try {
			setLoading(true);

			if (now < startDate) {
				toast.error(
					`Application will start from ${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`
				);
			} else if (now <= endDate) {
				const formData = new FormData();
				for (const key in values) {
					if (key !== "document") {
						formData.append(key, values[key]);
					}
				}
				formData.append("scholarshipId", id as string);
				if (values.document) {
					formData.append("document", values.document);
				}

				const res = await applyScholarship(formData);

				if (res.data?.success) {
					const jsonValues = { ...values };
					const documentPath = res.data?.data?.document;
					if (documentPath) {
						jsonValues.document = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${documentPath}`;
					} else {
						delete jsonValues.document;
					}
					await toast.promise(
						fetch("/api/submit", {
							method: "POST",
							body: JSON.stringify(jsonValues),
							headers: { "Content-Type": "application/json" },
						}),
						{
							loading: "Submitting your application...",
							success: "Application submitted successfully!",
							error: "Failed to submit the application.",
						}
					);
				}
			} else {
				toast.error("Application period has ended.");
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const semArray: any = data?.data?.semRequire
		? data.data.semRequire.split(",").map((sem: string) => sem.trim())
		: [];

	const currentNow = new Date();
	const currentStartDateStr = data?.data?.startDate;
	const currentEndDateStr = data?.data?.endDate;
	let isApplicationOpen = false;
	let isApplicationUpcoming = false;
	let isApplicationClosed = false;
	let currentStartDateObj: Date | null = null;

	if (currentStartDateStr && currentEndDateStr) {
		currentStartDateObj = new Date(currentStartDateStr);
		const currentEndDateObj = new Date(currentEndDateStr);
		if (currentNow < currentStartDateObj) {
			isApplicationUpcoming = true;
		} else if (currentNow > currentEndDateObj) {
			isApplicationClosed = true;
		} else {
			isApplicationOpen = true;
		}
	}

	return (
		<div className="min-h-screen bg-[#edf1f4] pb-16 pt-[6em] lg:pt-[10em]">
			<div className="w-full px-4 lg:px-8 xl:px-12 flex flex-col xl:flex-row gap-8 items-start">

				{/* Left Column (Info Panel - Sticky) */}
				<div className="w-full xl:w-4/12 flex flex-col gap-6 xl:sticky xl:top-24">

					{/* Hero Section */}
					<Card className="overflow-hidden border-none shadow-md bg-white rounded-xl">
						<div className="flex flex-col items-center p-6 gap-6 text-center">
							<div className="shrink-0">
								{data?.data.providerImage && (
									<Image
										src={data?.data.providerImage}
										alt={data?.data.providerName || "Sponsor Image"}
										width={280}
										height={280}
										className="rounded-xl shadow-sm object-cover border border-neutral-100"
									/>
								)}
							</div>
							<div className="flex flex-col gap-3 flex-1">
								<div>
									<h1 className="md:text-xl text-lg font-bold text-neutral-900 mb-1">
										{data?.data.name}
									</h1>
									<p className="text-neutral-500 text-sm md:text-md font-medium">
										Sponsored by <span className="text-primary font-semibold">{data?.data.providerName || "Sponsor"}</span>
									</p>
								</div>

								<div className="flex flex-wrap gap-2 justify-center mt-2">
									<div className="bg-primary/10 text-primary px-3 md:py-1.5 py-2 rounded-full text-[10px] md:text-[12px] font-semibold">
										Eligibility: {data?.data.whoCanApply}
									</div>
									<div className="bg-green-100 text-green-700 px-3 md:py-1.5 py-2 rounded-full text-[10px] md:text-[12px] font-semibold">
										Amount: {data?.data.amountDetails}
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* About Scholarship */}
					<Card className="border-none shadow-sm bg-[#c4eb80] rounded-xl overflow-hidden">
						<CardHeader className="bg-[#91c837] pb-3 pt-3 px-6">
							<CardTitle className="text-lg text-neutral-900 font-bold uppercase tracking-wider text-sm">
								About the Scholarship
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<ReactQuill
								theme="bubble"
								value={data?.data.description}
								readOnly={true}
								className="view_editor text-justify text-neutral-900 p-0"
							/>
						</CardContent>
					</Card>

					{/* About Sponsor */}
					<Card className="border-none shadow-sm bg-sky-200 rounded-xl overflow-hidden">
						<CardHeader className="bg-sky-300 pb-3 pt-3 px-6">
							<CardTitle className="text-lg text-neutral-900 font-bold uppercase tracking-wider text-sm">
								About the Sponsor
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<ReactQuill
								theme="bubble"
								value={data?.data.providerDescription}
								readOnly={true}
								className="view_editor text-justify text-neutral-900 p-0"
							/>
						</CardContent>
					</Card>
				</div>

				{/* Right Column (Application Form) */}
				<div className="w-full xl:w-8/12">
					<Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden m-0 relative">
						{currentStartDateObj && currentEndDateStr && (
							<div className="absolute top-0 right-0 bg-orange-100 text-orange-700 px-4 py-2 rounded-bl-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-sm border-b border-l border-orange-200 z-10">
								Window: {currentStartDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(currentEndDateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
							</div>
						)}
						<CardHeader className="bg-white border-b border-neutral-100 pb-8 pt-10 px-6 lg:px-10">
							<div className="flex flex-col items-center gap-3">
								<div className="bg-[#c4eb80] text-[#7db02b] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mt-2 md:mt-0">
									Application Portal
								</div>
								<CardTitle className="text-xl lg:text-3xl text-neutral-900 font-extrabold text-center tracking-tight">
									Scholarship Application Form
								</CardTitle>
								<CardDescription className="text-center text-neutral-500 font-medium max-w-4xl mx-auto text-[12px] md:text-[14px] ">
									Please fill out all the required information accurately. Read all relevant rules mentioned before applying.
								</CardDescription>
								<div className="mt-4 bg-amber-50 text-amber-900 border border-amber-300 md:px-4 px-2 py-3 rounded-xl flex items-center justify-center gap-2 text-[12px] lg:text-[14px] text-center font-bold shadow-sm w-full max-w-xl mx-auto">
									⚠️ Warning: An applicant can apply for a maximum of 3 scholarships.
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-6 lg:p-10">
							<Formik
								initialValues={{
									scholarshipName: data?.data.name || "",
									name: "",
									studentId: "",
									dob: "",
									contactHome: "",
									contact: "",
									email: "",
									numberofdirectfamilyMembers: 1,
									fatherOccupation: "",
									totalEarningMembers: "",
									totalFamilyIncome: "",
									eachFamilyIncome: "",
									rank: "",
									jgecIntakeYear: "",
									jgecPassingYear: "",
									extraCurricularActivities: "",
									percentSecondary: "",
									percentHigherSecondary: "",
									...Object.fromEntries(
										(semArray.length === 1 && semArray[0] === "1st Sem" ? ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"] : semArray).map((sem: string) => [`sem_${sem.split(" ")[0]}`, ""])
									),
									average: "",
									department: "",
									residentialAddress: "",
									specialAchievement: "",
									document: null,
								}}
								onSubmit={(values) => {
									handleFormSubmit(values);
								}}
								validationSchema={ScholarshipSchema}
							>
								{({ handleChange, values, setFieldValue }) => {
									let displaySemArray = semArray;

									if (semArray.length === 1 && semArray[0] === "1st Sem") {
										const intakeYearStr = values.jgecIntakeYear ? String(values.jgecIntakeYear).trim() : "";
										if (intakeYearStr.length === 4) {
											const intakeYear = parseInt(intakeYearStr);
											if (!isNaN(intakeYear)) {
												const currentYear = new Date().getFullYear();
												const diff = currentYear - intakeYear;
												if (diff > 0) {
													let count = diff * 2;
													if (count > 8) count = 8;
													const allSems = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];
													displaySemArray = allSems.slice(0, count);
												} else {
													displaySemArray = [];
												}
											} else {
												displaySemArray = [];
											}
										} else {
											displaySemArray = [];
										}
									}

									return (
										<Form className="flex flex-col gap-10">
											<ScrollToError />

											{/* Personal Details */}
											<div className="flex flex-col gap-6">
												<div className="bg-[#c4eb80] text-neutral-900 uppercase text-sm tracking-widest font-bold px-4 py-3 rounded-xl shadow-sm border border-[#91c837]">
													1. Personal Details
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
													<div className="flex flex-col gap-1">
														<InputField
															name="name"
															label="Name (in block letters)"
															placeholder="Enter your full name"
															onChange={(e: any) => setFieldValue("name", e.target.value.toUpperCase())}
														/>
														<ErrorMessage name="name" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="number" name="studentId" label="Student ID" placeholder="Student ID" onChange={handleChange} />
														<ErrorMessage name="studentId" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField name="dob" label="Date of birth" placeholder="01-01-2025" onChange={handleChange} />
														<ErrorMessage name="dob" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="email" name="email" label="Email" placeholder="Enter your email" onChange={handleChange} />
														<ErrorMessage name="email" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="number" name="contactHome" required label="Parent's Contact Number" placeholder="xxxxxxxxxx" onChange={handleChange} />
														<ErrorMessage name="contactHome" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="number" name="contact" required label="Your Mobile Number" placeholder="xxxxxxxxxx" onChange={handleChange} />
														<ErrorMessage name="contact" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3 xl:col-span-2">
														<InputField name="residentialAddress" label="Residential Address" placeholder="Enter your residential address" onChange={handleChange} />
														<ErrorMessage name="residentialAddress" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
												</div>
											</div>

											{/* Family & Income */}
											<div className="flex flex-col gap-6">
												<div className="bg-sky-200 text-neutral-900 uppercase text-sm tracking-widest font-bold px-4 py-3 rounded-xl shadow-sm border border-sky-300">
													2. Family & Income
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
													<div className="flex flex-col gap-1">
														<InputField type="text" name="fatherOccupation" label="Father's Occupation" placeholder="Father's Occupation" onChange={handleChange} />
														<ErrorMessage name="fatherOccupation" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="number" name="numberofdirectfamilyMembers" label="Number of direct family members" placeholder="xx" onChange={handleChange} />
														<ErrorMessage name="numberofdirectfamilyMembers" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="number" name="totalEarningMembers" label="Total earning members (in family)" placeholder="xx" onChange={handleChange} />
														<ErrorMessage name="totalEarningMembers" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="number" name="totalFamilyIncome" label="Total family income (INR/Yearly)" placeholder="xxxxx" onChange={handleChange} />
														<ErrorMessage name="totalFamilyIncome" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="number" name="eachFamilyIncome" label="Earning per family member (Yearly)" placeholder="xxxxx" onChange={handleChange} />
														<ErrorMessage name="eachFamilyIncome" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
												</div>
											</div>

											{/* Academic Details */}
											<div className="flex flex-col gap-6">
												<div className="bg-[#c4eb80] text-neutral-900 uppercase text-sm tracking-widest font-bold px-4 py-3 rounded-xl shadow-sm border border-[#91c837]">
													3. Academic Details
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
													<div className="flex flex-col gap-1">
														<InputField type="number" name="rank" label="WBJEE Rank" placeholder="xxxxx" onChange={handleChange} />
														<ErrorMessage name="rank" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<SelectField
															name="department"
															label="Department"
															defaultValue="Select your department"
															placeholder="Select your department"
															data={
																data?.data.department === "All"
																	? ["CSE", "ECE", "IT", "EE", "ME", "CE"]
																	: [data?.data.department || ""]
															}
															onValueChange={(value) => setFieldValue("department", value)}
															value={values.department}
														/>
														<ErrorMessage name="department" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="text" name="jgecIntakeYear" label="JGEC Intake Year" placeholder="xxxx" onChange={handleChange} />
														<ErrorMessage name="jgecIntakeYear" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="text" name="jgecPassingYear" label="JGEC Passing Year" placeholder="xxxx" onChange={handleChange} />
														<ErrorMessage name="jgecPassingYear" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="text" name="percentSecondary" label="Percentage in Secondary (Class 10)" placeholder="xx %" onChange={handleChange} />
														<ErrorMessage name="percentSecondary" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<InputField type="text" name="percentHigherSecondary" label="Percentage in Higher Sec. (Class 12)" placeholder="xx %" onChange={handleChange} />
														<ErrorMessage name="percentHigherSecondary" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													{displaySemArray.map((sem: string, index: number) => (
														<div key={index} className={`flex flex-col gap-1 ${id === "45" ? "hidden" : ""}`}>
															<InputField type="text" name={`sem_${sem.split(" ")[0]}`} label={`CGPA in ${sem}`} placeholder="x.xx" onChange={handleChange} />
															<ErrorMessage name={`sem_${sem.split(" ")[0]}`} component="div" className="text-red-500 text-xs font-semibold" />
														</div>
													))}
													<div className={`flex flex-col gap-1 ${id === "45" || displaySemArray.length === 0 ? "hidden" : ""}`}>
														<InputField type="text" name="average" label="Average semester marks till date" placeholder="x.xx" onChange={handleChange} />
														<ErrorMessage name="average" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
												</div>
											</div>

											{/* Extra-Curricular & Achievements */}
											<div className="flex flex-col gap-6">
												<div className="bg-sky-200 text-neutral-900 uppercase text-sm tracking-widest font-bold px-4 py-3 rounded-xl shadow-sm border border-sky-300">
													4. Activities & Achievements
												</div>
												<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-1">
													<div className="flex flex-col gap-1">
														<TextareaField
															name="extraCurricularActivities"
															label="Extra-Curricular Activities (Optional)"
															placeholder="Activities regularly performed at campus (Mention any achievement)"
															onChange={handleChange}
														/>
														<ErrorMessage name="extraCurricularActivities" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
													<div className="flex flex-col gap-1">
														<TextareaField
															name="specialAchievement"
															label="Your Special Achievement (Optional)"
															placeholder="Mention any activities pertaining to Social Work"
															onChange={handleChange}
														/>
														<ErrorMessage name="specialAchievement" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
												</div>
											</div>

											{/* Document Upload */}
											<div className="flex flex-col gap-6">
												<div className="bg-[#c4eb80] text-neutral-900 uppercase text-sm tracking-widest font-bold px-4 py-3 rounded-xl shadow-sm border border-[#91c837]">
													5. Document Upload
												</div>
												<div className="flex flex-col gap-2 px-1">
													<div className="p-5 bg-amber-50 border border-amber-300 rounded-xl mb-4 shadow-sm">
														<p className="text-sm text-amber-900 font-extrabold mb-3 uppercase tracking-wider flex items-center gap-2">
															⚠️ Mandatory Document Guidelines
														</p>
														<p className="text-sm text-amber-900 mb-2 font-medium">All documents must be uploaded strictly in PDF format. The required documents are:</p>
														<ul className="list-disc pl-6 text-sm text-amber-900 font-medium space-y-1.5 mb-4">
															<li>Secondary (10th) Marksheet</li>
															<li>Higher Secondary (12th) Marksheet</li>
															<li>JEE/ JELET Rank Card</li>
															<li>Available Semester Marksheets</li>
															<li>Income Certificate (Issued by a competent authority)</li>
															<li>
																Self-Declaration handwritten Form (PDF) must include the following points:<br />
																<span className="italic opacity-90">&quot;The information provided by me is true to the best of my knowledge. If any detail is found incorrect or misleading, my application will be rejected immediately.&quot;</span><br /><br />
																Those who are receiving any other scholarship/s also need to add the following:<br />
																<span className="italic opacity-90">&quot;I hereby declare that I am receiving &apos;Name of the Scholarship&apos; Scholarship of &apos;xxxxx&apos; rupees annually ___.&quot;</span><br /><br />
																In case of non-receipt of any government Scholarship, the applicant is to submit relevant statement accordingly.
															</li>
														</ul>
														<div className="bg-amber-100 p-3 rounded-lg border border-amber-200">
															<p className="text-sm text-amber-900 font-bold text-center">
																All documents MUST be merged into a <span className="underline decoration-2 underline-offset-2">SINGLE PDF</span> file (Max Size: 15MB).
															</p>
														</div>
													</div>
													<div className="flex flex-col gap-1">
														<label className="text-sm font-semibold text-neutral-700">Upload Document (PDF only)</label>
														<input
															type="file"
															accept="application/pdf"
															name="document"
															onChange={(e) => {
																const file = e.target.files ? e.target.files[0] : null;
																setFieldValue("document", file);
															}}
															className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
														/>
														<ErrorMessage name="document" component="div" className="text-red-500 text-xs font-semibold" />
													</div>
												</div>
											</div>

											{/* Submit Button */}
											<div className="flex flex-col items-center justify-center pt-10 border-t border-neutral-100 gap-4">
												{(isApplicationUpcoming || isApplicationClosed) && (
													<div className={`px-4 py-3 rounded-xl text-sm font-bold shadow-sm w-full max-w-lg text-center ${isApplicationUpcoming ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
														{isApplicationUpcoming 
															? `⏳ Application will open on ${currentStartDateObj?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` 
															: "🚫 The application period for this scholarship has ended."}
													</div>
												)}

												{applyLoading ? (
													<Button className="py-4 px-8 text-base hover:scale-100 w-full max-w-[280px] flex justify-center items-center gap-2 rounded-full shadow-lg bg-neutral-200 text-neutral-500 cursor-not-allowed" disabled>
														<Loader className="animate-spin w-5 h-5" />
														Submitting...
													</Button>
												) : (
													<Button
														className={`group relative py-4 px-8 text-base w-full max-w-[280px] font-bold shadow-xl uppercase tracking-widest rounded-full flex items-center justify-center gap-2 overflow-hidden ${(!isApplicationOpen) ? "bg-neutral-300 text-neutral-500 shadow-none cursor-not-allowed hover:bg-neutral-300 hover:-translate-y-0" : "shadow-[#91c837]/30 bg-gradient-to-r from-[#91c837] to-[#7db02b] hover:from-[#7db02b] hover:to-[#6a9920] text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#91c837]/40"}`}
														type="submit"
														disabled={!isApplicationOpen}
													>
														<span className="relative z-10">{isApplicationUpcoming ? "Opening Soon" : isApplicationClosed ? "Application Closed" : "Submit Application"}</span>
														{isApplicationOpen && <Send className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />}
														{/* Shine effect on hover */}
														{isApplicationOpen && <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>}
													</Button>
												)}
											</div>
										</Form>
									)
								}}
							</Formik>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Page;
