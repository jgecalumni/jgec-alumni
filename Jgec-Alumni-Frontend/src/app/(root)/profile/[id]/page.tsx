"use client";
import { Button } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { TextareaField } from "@/components/ui/textarea";
import {
	useUpdateUserMutation,
	useUserDetailsQuery,
} from "@/store/feature/user-feature";
import { ErrorMessage, Form, Formik } from "formik";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
interface ProfileParams {
	params: { id: string };
}
const Page: React.FC<ProfileParams> = ({ params }: ProfileParams) => {
	const { id } = params;
	const { data, isError, error, refetch } = useUserDetailsQuery(id);
	const [updateUser, { isError: isUpdateError, error: updateError }] =
		useUpdateUserMutation();
	const [imagePreview, setImagePreview] = useState<string|null>(null);

	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		setFieldValue: any
	) => {
		const file = event.target.files?.[0];
		setFieldValue("photo", file);

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
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch user");
		}
		if (isUpdateError) {
			toast.error(
				(updateError as any)?.data?.message || "Failed to update user"
			);
			console.log((updateError as any)?.data?.message);
			
		}
		setImagePreview(data?.data.photo||null)
	}, [isError, error, isUpdateError, updateError,data]);

	const handleUpdate = async (values: IUserType, setSubmitting: any) => {
		const formData = new FormData();
		const {
			name,
			email,
			password,
			studentId,
			passingYear,
			department,
			residentialAddress,
			professionalAddress,
			photo,
		} = values;
		formData.append("name", name);
		formData.append("email", email);
		formData.append("password",password);
		formData.append("studentId", studentId);
		formData.append("passingYear", passingYear);
		formData.append("department", department);
		formData.append("residentialAddress", residentialAddress);
		formData.append("professionalAddress", professionalAddress);
		if (photo) {
			formData.append("photo", photo);
		}
		const res = await updateUser({ formData, id });
		if (res.data?.success) {
			toast.success("User updated successfully");
			setSubmitting(false);
			refetch();
		}
	};
	return (
		<div className=" mt-28 p-8 lg:p-14 w-full min-w-full flex flex-col justify-center items-center">
			<div className="text-xl sm:text-2xl font-medium mb-4 sm:mb-8">
				Update your profile
			</div>
			<Formik
				initialValues={{
					email: data?.data.email,
					password: "",
					name: data?.data.name,
					studentId: data?.data.studentId,
					passingYear: data?.data.passingYear,
					department: data?.data.department || "",
					residentialAddress: data?.data.residentialAddress,
					professionalAddress: data?.data.professionalAddress,
					photo: data?.data.photo || "",
				}}
				enableReinitialize={true}
				onSubmit={(values: any, actions: any) => {
					handleUpdate(values, actions.setSubmitting);
				}}>
				{({ handleChange, values, setFieldValue, isSubmitting }) => (
					<Form className="lg:w-2/3">
						<div className="grid mb-3 lg:grid-cols-2 grid-col-1 gap-4">
							<div className="flex flex-col gap-1">
								<InputField
									type="email"
									name="email"
									label="Email"
									value={values.email}
									placeholder="Enter your email"
									onChange={handleChange}
								/>
								<ErrorMessage
									name="email"
									component="div"
									className="text-red-500 text-xs"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<InputField
									type="password"
									name="password"
									label="Password"
									placeholder="Update your password"
									onChange={handleChange}
								/>
								<ErrorMessage
									name="password"
									component="div"
									className="text-red-500 text-xs"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<InputField
									name="name"
									label="Full Name"
									value={values.name}
									placeholder="Enter your full name"
									onChange={handleChange}
								/>
								<ErrorMessage
									name="name"
									component="div"
									className="text-red-500 text-xs"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<InputField
									name="studentId"
									label="Student ID"
									value={values.studentId}
									placeholder="Student ID"
									onChange={handleChange}
								/>
								<ErrorMessage
									name="studentId"
									component="div"
									className="text-red-500 text-xs"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<InputField
									name="passingYear"
									label="Passing Year"
									value={values.passingYear}
									placeholder="Passing Year"
									onChange={handleChange}
								/>
								<ErrorMessage
									name="passingYear"
									component="div"
									className="text-red-500 text-xs"
								/>
							</div>
							<div>
								<SelectField
									name="department"
									label="Department"
									defaultValue="Select your department"
									placeholder="Select your department"
									data={["CSE", "ECE", "IT", "EE", "ME", "CE"]}
									onValueChange={(value) => setFieldValue("department", value)}
									value={values.department}
								/>
								<ErrorMessage
									name="department"
									component="div"
									className="text-red-500 text-xs"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<TextareaField
									name="residentialAddress"
									label="Residential Address"
									value={values.residentialAddress}
									placeholder="Enter your residential address"
									onChange={handleChange}
								/>
								<ErrorMessage
									name="residentialAddress"
									component="div"
									className="text-red-500 text-xs"
								/>
							</div>

							<div className="flex flex-col gap-1">
								<TextareaField
									name="professionalAddress"
									label="Professional Address"
									value={values.professionalAddress}
									placeholder="Enter your professional address"
									onChange={handleChange}
								/>
								<ErrorMessage
									name="professionalAddress"
									component="div"
									className="text-red-500 text-xs"
								/>
							</div>
							
							<div className="lg:flex items-center gap-2">
								<Input
									name="photo"
									id="photo"
									type="file"
									accept="image/*"
									onChange={(e) => handleFileChange(e, setFieldValue)}
									className="mt-1"
								/>
								{imagePreview ? (
									<div className="mt-2">
										<Image
											src={imagePreview}
											alt="Profile Photo"
											width={180}
											height={180}
											className="rounded-lg"
										/>
									</div>
								) : (
									<div className="mt-2">
										<Image
											src={imagePreview||""}
											alt="Profile Photo"
											width={180}
											height={180}
											className="rounded-lg"
										/>
									</div>
								)}
							</div>
						</div>

						{isSubmitting ? (
							<>
								<Button
									disabled
									className="py-3 text-white hover:scale-100 w-full max-w-lg lg:max-w-xs"
									type="submit">
									<Loader2 className="animate-spin" /> Loading...
								</Button>
							</>
						) : (
							<>
								<Button
									className="py-3 text-white hover:scale-100 w-full max-w-lg lg:max-w-xs"
									type="submit">
									Update
								</Button>
							</>
						)}
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Page;
