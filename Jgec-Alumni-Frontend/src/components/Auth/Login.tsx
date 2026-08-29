"use client";
import React, { useEffect } from "react";
import { InputField } from "../ui/input";
import { ErrorMessage, Form, Formik } from "formik";
import { Button } from "../ui/button";

import { LoginSchema } from "@/schemas/AuthSchema";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import Link from "next/link";

const Login: React.FC = () => {
	const { handleLogin } = useAuth();

	return (
		<section className="bg-white px-4 md:px-10 py-10 md:py-20">
			{/* Authentication Form */}
			<div className="h-full w-full max-w-screen-lg mx-auto  overflow-hidden flex lg:flex-row flex-col justify-center gap-8 items-center">
				{/* Login Form */}
				<div className="w-full max-lg:max-w-lg lg:w-1/3">
					<h2 className="text-xl sm:text-2xl font-medium text-start mb-4 sm:mb-8">
						Already a Member?
					</h2>
					<Formik
						initialValues={{ email: "", password: "" }}
						validationSchema={LoginSchema}
						onSubmit={(values, actions) => {
							handleLogin(values, actions.setSubmitting);
						}}>
						{({ handleChange, isSubmitting }) => (
							<Form className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<InputField
										type="email"
										name="email"
										label="Email"
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
										placeholder="Enter your password"
										onChange={handleChange}
									/>
									<ErrorMessage
										name="password"
										component="div"
										className="text-red-500 text-xs"
									/>
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
											Login
										</Button>
									</>
								)}
							</Form>
						)}
					</Formik>
					<div className="flex flex-col gap-1 mt-4">
						<span>
							New here?{" "}
							<Link
								href="/register"
								className="text-red-500">
								Sign up
							</Link>{" "}
							to get started!{" "}
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Login;
