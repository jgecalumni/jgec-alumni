"use client";
import React, { useEffect } from "react";
import { MdCloudUpload } from "react-icons/md";
import { InputField } from "../ui/input";
import { ErrorMessage, Form, Formik } from "formik";
import { Button } from "../ui/button";
import { TextareaField } from "../ui/textarea";
import { SelectField } from "../ui/select";
import { LoginSchema, RegisterSchema } from "@/schemas/AuthSchema";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/store/baseApi";
import { useAuth } from "@/store/AuthContext";

const Auth: React.FC = () => {
	const { handleLogin } = useAuth();
	const [register, { isError, error }] = useRegisterMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to add user");
		}
	}, [isError, error]);

	const registerUser = async (userData: IRegisterType, setSubmitting: any) => {
		const formData = new FormData();
		formData.append("name", userData.name);
		formData.append("email", userData.email);
		formData.append("password", userData.password);
		formData.append("photo", userData.photo || "");
		formData.append("nickname", userData.nickname);
		formData.append("passingYear", userData.passingYear);
		formData.append("department", userData.department);
		formData.append("residentialAddress", userData.residentialAddress);
		formData.append("professionalAddress", userData.professionalAddress);
		formData.append("receipt", userData.receipt || "");

		const res = await register(formData);
		if (res?.data?.success) {
			toast.success("Registered successfully");
		}
		setSubmitting(false);
	};

	return (
		<section className="bg-[#f4f6f9] px-4 md:px-10 py-10 md:py-16">
			<div className="w-full max-w-screen-lg mx-auto">
				<Formik
					initialValues={{
						email: "",
						password: "",
						name: "",
						nickname: "",
						passingYear: "",
						department: "",
						residentialAddress: "",
						professionalAddress: "",
						photo: null as File | null,
						receipt: null as File | null,
					}}
					validationSchema={RegisterSchema}
					onSubmit={(values: any, actions: any) => {
						registerUser(values, actions.setSubmitting);
					}}>
					{({ handleChange, values, setFieldValue, isSubmitting, setFieldError, errors }) => (
						<Form>
							{/* ── Section: Account Info ── */}
							<div className="mb-8">
								<div className="flex items-center gap-3 mb-5">
									<span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">1</span>
									<h3 className="text-base font-bold text-neutral-700 uppercase tracking-wide">Account Information</h3>
									<div className="flex-1 h-px bg-neutral-200" />
								</div>
								<div className="grid sm:grid-cols-2 gap-4">
									<div className="flex flex-col gap-1">
										<InputField type="email" name="email" label="Email" placeholder="Enter your email" onChange={handleChange} />
										<ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-0.5" />
									</div>
									<div className="flex flex-col gap-1">
										<InputField type="password" name="password" label="Password" placeholder="Enter your password" onChange={handleChange} />
										<ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-0.5" />
									</div>
								</div>
							</div>

							{/* ── Section: Personal Info ── */}
							<div className="mb-8">
								<div className="flex items-center gap-3 mb-5">
									<span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">2</span>
									<h3 className="text-base font-bold text-neutral-700 uppercase tracking-wide">Personal Information</h3>
									<div className="flex-1 h-px bg-neutral-200" />
								</div>
								<div className="grid sm:grid-cols-2 gap-4">
									<div className="flex flex-col gap-1">
										<InputField name="name" label="Full Name" placeholder="Enter your full name" onChange={handleChange} />
										<ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-0.5" />
									</div>
									<div className="flex flex-col gap-1">
										<InputField name="nickname" label="Nickname (if any)" placeholder="Nickname" onChange={handleChange} />
										<ErrorMessage name="nickname" component="div" className="text-red-500 text-xs mt-0.5" />
									</div>
									<div className="flex flex-col gap-1">
										<InputField name="passingYear" label="Passing Year" placeholder="e.g. 2018" onChange={handleChange} />
										<ErrorMessage name="passingYear" component="div" className="text-red-500 text-xs mt-0.5" />
									</div>
									<div className="flex flex-col gap-1">
										<SelectField
											name="department"
											label="Department"
											defaultValue="Select your department"
											placeholder="Select your department"
											data={["CSE", "ECE", "IT", "EE", "ME", "CE"]}
											onValueChange={(value) => setFieldValue("department", value)}
											value={values.department}
										/>
										<ErrorMessage name="department" component="div" className="text-red-500 text-xs mt-0.5" />
									</div>
									<div className="flex flex-col gap-1">
										<TextareaField name="residentialAddress" label="Residential Address" placeholder="Enter your residential address" onChange={handleChange} />
										<ErrorMessage name="residentialAddress" component="div" className="text-red-500 text-xs mt-0.5" />
									</div>
									<div className="flex flex-col gap-1">
										<TextareaField name="professionalAddress" label="Professional Address" placeholder="Enter your professional address" onChange={handleChange} />
										<ErrorMessage name="professionalAddress" component="div" className="text-red-500 text-xs mt-0.5" />
									</div>
								</div>
							</div>

							{/* ── Section: Documents ── */}
							<div className="mb-8">
								<div className="flex items-center gap-3 mb-5">
									<span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">3</span>
									<h3 className="text-base font-bold text-neutral-700 uppercase tracking-wide">Documents & Photo</h3>
									<div className="flex-1 h-px bg-neutral-200" />
								</div>
								<div className="grid sm:grid-cols-2 gap-5">

									{/* Photo Upload */}
									<div className="flex flex-col gap-1.5">
										<label className="text-sm font-semibold text-neutral-700">
											Profile Photo <span className="text-red-500">*</span>
										</label>
										<label
											htmlFor="photo"
											className={`relative flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
												${values.photo
													? "border-green-400 bg-green-50"
													: "border-neutral-300 bg-white hover:border-blue-400 hover:bg-blue-50"
												}`}
										>
											<MdCloudUpload size={28} className={values.photo ? "text-green-500" : "text-neutral-400"} />
											<div className="text-center px-2">
												{values.photo ? (
													<>
														<p className="text-sm font-semibold text-green-700 line-clamp-1">{values.photo.name}</p>
														<p className="text-xs text-green-600">Click to change</p>
													</>
												) : (
													<>
														<p className="text-sm font-medium text-neutral-600">Click to upload photo</p>
														<p className="text-xs text-neutral-400 mt-0.5">JPG, PNG, WEBP, GIF accepted</p>
													</>
												)}
											</div>
											<input
												id="photo"
												name="photo"
												type="file"
												accept="image/*"
												className="absolute inset-0 opacity-0 cursor-pointer"
												onChange={(event) => {
													const file = event.currentTarget.files?.[0];
													if (file) {
														if (!file.type.startsWith("image/")) {
															setFieldError("photo", "Only image files are accepted (JPG, PNG, WEBP, etc.)");
															event.currentTarget.value = "";
															return;
														}
														setFieldValue("photo", file);
													}
												}}
											/>
										</label>
										<ErrorMessage name="photo" component="div" className="text-red-500 text-xs" />
									</div>

									{/* Receipt Upload */}
									<div className="flex flex-col gap-1.5">
										<label className="text-sm font-semibold text-neutral-700">
											Payment Receipt <span className="text-red-500">*</span>
										</label>
										<label
											htmlFor="receipt"
											className={`relative flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
												${values.receipt
													? "border-green-400 bg-green-50"
													: "border-neutral-300 bg-white hover:border-blue-400 hover:bg-blue-50"
												}`}
										>
											<MdCloudUpload size={28} className={values.receipt ? "text-green-500" : "text-neutral-400"} />
											<div className="text-center px-2">
												{values.receipt ? (
													<>
														<p className="text-sm font-semibold text-green-700 line-clamp-1">{values.receipt.name}</p>
														<p className="text-xs text-green-600">Click to change</p>
													</>
												) : (
													<>
														<p className="text-sm font-medium text-neutral-600">Click to upload receipt</p>
														<p className="text-xs text-neutral-400 mt-0.5">PDF only · Max 8 MB</p>
													</>
												)}
											</div>
											<input
												id="receipt"
												name="receipt"
												type="file"
												accept="application/pdf"
												className="absolute inset-0 opacity-0 cursor-pointer"
												onChange={(event) => {
													const file = event.currentTarget.files?.[0];
													if (file) {
														if (file.type !== "application/pdf") {
															setFieldError("receipt", "Only PDF files are accepted.");
															event.currentTarget.value = "";
															return;
														}
														if (file.size > 8 * 1024 * 1024) {
															setFieldError("receipt", "Receipt PDF must be smaller than 8 MB.");
															event.currentTarget.value = "";
															return;
														}
														setFieldValue("receipt", file);
													}
												}}
											/>
										</label>
										<ErrorMessage name="receipt" component="div" className="text-red-500 text-xs" />
									</div>

								</div>
							</div>

							{/* ── Payment Note ── */}
							<div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900">
								<p className="font-bold mb-2">📌 Payment Note</p>
								<p className="mb-2">
									Rs. 100 is mandatory for membership. This grants access to Find Your Pal, Finance, and Alumni Membership Info using your own email and password.
								</p>
								<p className="mb-1 font-medium">Deposit to any of the SBI Current Accounts:</p>
								<ul className="list-decimal pl-5 space-y-1 text-xs">
									<li>
										SBI A/C No: <span className="font-semibold">31904400275</span> &nbsp;|&nbsp; IFSC: <span className="font-semibold">SBIN0007194</span> &nbsp;|&nbsp; MICR: 735002512 &nbsp;|&nbsp; Branch Code: 7194 — Jointly operated by Treasurer &amp; either of President/Secretary.
									</li>
								</ul>
							</div>

							{/* ── Submit ── */}
							<div>
								{isSubmitting ? (
									<Button disabled className="py-3 text-white hover:scale-100 w-full" type="submit">
										<Loader2 className="animate-spin mr-2" /> Submitting...
									</Button>
								) : (
									<Button className="py-3 text-white hover:scale-100 w-full" type="submit">
										Submit Registration
									</Button>
								)}
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</section>
	);
};

export default Auth;
