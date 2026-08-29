"use client";

import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import { InputField } from "../ui/input";
import { SelectField } from "../ui/select";
import { TextareaField } from "../ui/textarea";
import { Button } from "../ui/button";
import { ContactSchema } from "@/schemas/ContactSchema";
import SectionHeader from "../section-header";


const Contact: React.FC = () => {
	return (
		<>
			{/* Contact Banner */}
			<SectionHeader
				highlightTitle="Get in"
				normalTitle="Touch"
				description="For any query or suggestion, please feel free to contact us."
			/>

			<div className="h-full w-full max-w-screen-max_screen px-4 md:px-10 py-16 overflow-hidden flex lg:flex-row flex-col justify-center gap-8 items-center bg-white">
				{/* TODO: Implement Map  */}
				<div className="w-full lg:w-1/2">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5169.520136596787!2d88.69721568836566!3d26.544720329066894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e47bce687f169d%3A0x4152036d0d736d37!2sJalpaiguri%20Government%20Engineering%20College!5e1!3m2!1sen!2sin!4v1737196989015!5m2!1sen!2sin"
						width="600"
						height="450"
						style={{ border: 0 }}
						allowFullScreen={true}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						className="w-full h-auto lg:h-[30rem] min-h-80 object-cover rounded-md"
					/>
				</div>
				{/* Divider */}
				{/* <div className="border border-primary/100 h-1/2 rounded-md"></div> */}
				{/* Contact Form */}
				<div className="w-full lg:w-1/2 border-t-2 lg:border-l-2 lg:border-t-0 lg:pt-0 pt-6 lg:pl-6 border-t-neutral-200 mx-4 lg:mx-0 lg:border-l-normal-200">
					<div className="text-3xl font-medium mb-8">SEND MESSAGE</div>
					<Formik
						initialValues={{
							email: "",
							name: "",
							studentId: "",
							passingYear: "",
							department: "",
							message: "",
						}}
						validationSchema={ContactSchema}
						onSubmit={(values) => {
							console.log(values);
						}}>
						{({ handleChange, values, setFieldValue }) => (
							<Form>
								<div className="flex flex-col w-full gap-4">
									<div className="flex md:flex-row flex-col gap-4 ">
										<div className="flex w-full flex-col gap-1">
											<InputField
												type="email"
												name="email"
												label="Email"
												placeholder="Enter your email"
												className="w-full"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="email"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>

										<div className="flex w-full flex-col gap-1">
											<InputField
												name="name"
												label="Full Name"
												placeholder="Enter your full name"
												onChange={handleChange}
												className="w-full"
											/>
											<ErrorMessage
												name="name"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
									</div>
									<div className="flex gap-4">
										<div className="flex w-full flex-col gap-1">
											<InputField
												name="studentId"
												label="Student ID"
												placeholder="Student ID"
												onChange={handleChange}
												className="w-full"
											/>
											<ErrorMessage
												name="studentId"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex w-full flex-col gap-1">
											<InputField
												name="passingYear"
												label="Passing Year"
												placeholder="Passing Year"
												onChange={handleChange}
												className="w-full"
											/>
											<ErrorMessage
												name="passingYear"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
									</div>
									<div>
										<SelectField
											name="department"
											label="Department"
											placeholder="Select your department"
											data={["CSE", "ECE", "IT", "EE", "ME", "CE"]}
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
									<div className="flex flex-col gap-1">
										<TextareaField
											name="message"
											label="Message"
											placeholder="Enter your message"
											onChange={handleChange}
										/>
										<ErrorMessage
											name="message"
											component="div"
											className="text-red-500 text-xs"
										/>
									</div>
								</div>

								<Button
									className="py-3 text-white mt-4 hover:scale-100 w-1/4 max-w-xs"
									type="submit">
									Submit
								</Button>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</>
	);
};

export default Contact;
