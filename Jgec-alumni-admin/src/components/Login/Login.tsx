"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { validationSchema } from "@/schemas/LoginSchema";
import { useLoginMutation } from "@/store/baseApi";
import toast from "react-hot-toast";

const Login: React.FC = () => {
	const router = useRouter();
	const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (isError) { 
			toast.error((error as any)?.data?.message || "Failed to login");
		}
		if (isSuccess) {
			router.push("/");
		}
	}, [isError, error, isSuccess, router]);

	return (
		<section className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8">
			{/* Main Card */}
			<div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800">
				
				{/* Left Side - Branding */}
				<div className="lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
					{/* Decorative background elements */}
					<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
						<div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl opacity-30 mix-blend-overlay"></div>
						<div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-blue-400 blur-3xl opacity-30 mix-blend-overlay"></div>
					</div>

					<div className="relative z-10 flex flex-col items-start">
						<div className="bg-white/10 p-3 lg:p-4 rounded-2xl backdrop-blur-md border border-white/20 mb-6 lg:mb-8 shadow-xl">
							<Image
								src="/assets/Logo.webp"
								alt="Alumni Logo"
								width={80}
								height={80}
								className="drop-shadow-lg w-16 h-16 lg:w-20 lg:h-20"
							/>
						</div>
						<h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-2 lg:mb-4">
							JGEC Alumni
						</h1>
						<p className="text-indigo-100 text-base lg:text-xl font-medium max-w-md hidden sm:block">
							Welcome to the Admin Portal. Manage the community, events, and resources all in one place.
						</p>
					</div>

					<div className="relative z-10 mt-12 lg:mt-0 hidden lg:block">
						<div className="flex items-center gap-4 text-indigo-200 text-sm font-medium">
							<div className="h-px bg-indigo-400/50 flex-1"></div>
							<span>Authorized Personnel Only</span>
							<div className="h-px bg-indigo-400/50 flex-1"></div>
						</div>
					</div>
				</div>

				{/* Right Side - Form */}
				<div className="lg:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900">
					<div className="max-w-md w-full mx-auto">
						<div className="mb-8 lg:mb-10">
							<h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
								Welcome Back
							</h2>
							<p className="text-sm lg:text-base text-slate-500 dark:text-slate-400">
								Please sign in to your admin account to continue.
							</p>
						</div>

						<Formik
							initialValues={{ email: "", password: "" }}
							onSubmit={async (values) => {
								await login(values);
							}}
							validationSchema={validationSchema}>
							{({ handleChange, values }) => (
								<Form className="flex flex-col gap-6">
									<div className="flex flex-col gap-2">
										<Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
										<div className="relative group">
											<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
												<Mail className="h-5 w-5" />
											</div>
											<Input
												type="email"
												name="email"
												id="email"
												value={values.email}
												placeholder="admin@jgecalumni.in"
												className="pl-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-950 dark:border-slate-800 transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20"
												onChange={handleChange}
											/>
										</div>
										<ErrorMessage
											name="email"
											component="div"
											className="text-red-500 text-sm font-medium mt-1 flex items-center gap-1"
										/>
									</div>

									<div className="flex flex-col gap-2">
										<div className="flex justify-between items-center">
											<Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
										</div>
										<div className="relative group">
											<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
												<Lock className="h-5 w-5" />
											</div>
											<Input
												type={showPassword ? "text" : "password"}
												id="password"
												name="password"
												value={values.password}
												placeholder="••••••••"
												className="pl-11 pr-11 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-950 dark:border-slate-800 transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20"
												onChange={handleChange}
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
											>
												{showPassword ? (
													<EyeOff className="h-5 w-5" />
												) : (
													<Eye className="h-5 w-5" />
												)}
											</button>
										</div>
										<ErrorMessage
											name="password"
											component="div"
											className="text-red-500 text-sm font-medium mt-1"
										/>
									</div>

									<Button
										className="w-full h-12 mt-4 text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all duration-300 flex items-center justify-center gap-2 group"
										type="submit"
										disabled={isLoading}
									>
										{isLoading ? (
											<>
												Signing in...
												<Loader2 className="h-5 w-5 animate-spin" />
											</>
										) : (
											<>
												Sign In
												<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
											</>
										)}
									</Button>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Login;
