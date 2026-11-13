"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	ArrowRight,
	Loader2,
	ShieldCheck,
	AlertCircle,
	HelpCircle,
	Sparkles,
	Building2,
	GraduationCap,
	CheckCircle2,
	KeyRound,
	ExternalLink,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ThemeToggle } from "../theme-toggle";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { validationSchema } from "@/schemas/LoginSchema";
import { useLoginMutation } from "@/store/baseApi";
import { useForgotPasswordMutation } from "@/store/feature/user-feature";

const Login: React.FC = () => {
	const router = useRouter();
	const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();
	const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(true);
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
	const [forgotSuccess, setForgotSuccess] = useState(false);

	const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!forgotEmail) {
			toast.error("Please enter your administrator email address.");
			return;
		}
		try {
			const res = await forgotPassword({ email: forgotEmail }).unwrap();
			setForgotSuccess(true);
			toast.success(res.message || "Password reset instructions sent.");
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to request password reset.");
		}
	};

	return (
		<section className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
			{/* Ambient Background Grid & Glow Orbs */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
				{/* Fine Matrix Pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

				{/* Atmospheric Light Orbs */}
				<div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-primary/15 blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl" />
			</div>

			{/* Top Bar: Brand Badge, Status & Theme Control */}
			<header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white shadow-md p-1 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
						<Image
							src="/assets/Logo.webp"
							alt="JGEC Alumni Association Crest"
							width={36}
							height={36}
							className="object-contain"
							priority
						/>
					</div>
					<div>
						<span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
							JGEC Alumni Association
							<span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300">
								Admin
							</span>
						</span>
						<p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
							Central Administration Console
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3 sm:gap-4">
					{/* Live System Status Pill */}
					<div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
						</span>
						<span>Systems Operational</span>
					</div>

					{/* Theme Switcher */}
					<ThemeToggle />
				</div>
			</header>

			{/* Center Command Card */}
			<main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 my-auto py-6">
				<div className="w-full bg-white dark:bg-slate-900/95 rounded-3xl shadow-2xl shadow-slate-300/40 dark:shadow-black/70 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl overflow-hidden flex flex-col lg:flex-row">
					
					{/* Left Column: Institutional Brand & Authority Showcase */}
					<div className="lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
						{/* Ambient Glows & Mesh Lines */}
						<div className="absolute inset-0 pointer-events-none opacity-30">
							<div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary blur-3xl" />
							<div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500 blur-3xl" />
							<div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px]" />
						</div>

						{/* Top Section: Header & Badges */}
						<div className="relative z-10">
							<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-blue-200 mb-6">
								<Sparkles className="w-3.5 h-3.5 text-amber-300" />
								<span>Jalpaiguri Govt. Engg. College • Estd. 1961</span>
							</div>

							<div className="flex items-center gap-4 mb-5">
								<div className="relative w-16 h-16 sm:w-20 sm:h-20 p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center shrink-0">
									<Image
										src="/assets/Logo.webp"
										alt="Alumni Logo"
										width={70}
										height={70}
										className="object-contain drop-shadow-md"
										priority
									/>
								</div>
								<div>
									<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
										JGEC Alumni
									</h1>
									<p className="text-xs sm:text-sm text-blue-200 font-medium">
										Governance & Management Hub
									</p>
								</div>
							</div>

							<p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-md">
								Empowering the global community of alumni. Oversee registrations, scholarship allocations, events, and institutional publications.
							</p>
						</div>

						{/* Middle Section: Security & System Highlights */}
						<div className="relative z-10 my-8 space-y-3.5">
							<div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
								<div className="mt-0.5 p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
									<ShieldCheck className="w-4 h-4" />
								</div>
								<div>
									<h2 className="text-xs font-semibold text-white">Tier-1 Access Control</h2>
									<p className="text-[11px] text-slate-300">
										Restricted cryptographic verification for authorized governing council members.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
								<div className="mt-0.5 p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
									<GraduationCap className="w-4 h-4" />
								</div>
								<div>
									<h2 className="text-xs font-semibold text-white">Scholarships & Chapters</h2>
									<p className="text-[11px] text-slate-300">
										Direct facilitation of student grants, batch contributions, and global chapters.
									</p>
								</div>
							</div>
						</div>

						{/* Bottom Section: Security Footer */}
						<div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-200/90 font-medium">
							<span className="flex items-center gap-1.5">
								<Lock className="w-3.5 h-3.5 text-blue-300" />
								SSL 256-Bit Encrypted Session
							</span>
							<span className="text-[11px] text-slate-400">
								Audit Logged
							</span>
						</div>
					</div>

					{/* Right Column: High-Performance Authentication Form */}
					<div className="lg:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-white dark:bg-slate-900">
						<div className="max-w-md w-full mx-auto">
							
							{/* Form Title & Subtitle */}
							<div className="mb-8">
								<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 text-xs font-semibold mb-3">
									<KeyRound className="w-3.5 h-3.5" />
									<span>ADMINISTRATOR LOGIN</span>
								</div>
								<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
									Welcome Back
								</h2>
								<p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-normal">
									Please authenticate with your official administrator credentials.
								</p>
							</div>

							{/* Formik Form Container */}
							<Formik
								initialValues={{ email: "", password: "" }}
								validationSchema={validationSchema}
								onSubmit={async (values) => {
									try {
										const res = await login(values).unwrap();
										if (res.success) {
											if (res.user) {
												try {
													localStorage.setItem("user_info", JSON.stringify(res.user));
												} catch {}
											}
											toast.success("Welcome back! Redirecting to dashboard...");
											window.location.href = "/";
										} else {
											toast.error(res.message || "Authentication failed.");
										}
									} catch (err: any) {
										toast.error(err?.data?.message || "Authentication failed. Please verify your credentials.");
									}
								}}
							>
								{({ handleChange, handleBlur, values, errors, touched }) => (
									<Form className="space-y-5" noValidate>
										
										{/* Email Field */}
										<div className="space-y-1.5">
											<div className="flex items-center justify-between">
												<Label
													htmlFor="email"
													className="text-xs font-semibold text-slate-700 dark:text-slate-300"
												>
													Email Address <span className="text-red-500">*</span>
												</Label>
											</div>
											<div className="relative group">
												<div
													className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
														touched.email && errors.email
															? "text-red-500"
															: "text-slate-400 group-focus-within:text-primary"
													}`}
												>
													<Mail className="h-4.5 w-4.5" />
												</div>
												<Input
													id="email"
													name="email"
													type="email"
													autoComplete="email"
													value={values.email}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder="admin@jgecalumni.in"
													aria-invalid={touched.email && Boolean(errors.email)}
													aria-describedby={touched.email && errors.email ? "email-error" : undefined}
													className={`pl-10 h-11 sm:h-12 text-sm rounded-xl transition-all duration-200 ${
														touched.email && errors.email
															? "border-red-500 dark:border-red-500/80 bg-red-50/30 dark:bg-red-950/20 focus-visible:ring-red-500/30"
															: "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 focus-visible:border-primary"
													}`}
												/>
											</div>
											{touched.email && errors.email && (
												<p
													id="email-error"
													role="alert"
													className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5 pt-0.5"
												>
													<AlertCircle className="w-3.5 h-3.5 shrink-0" />
													<span>{errors.email}</span>
												</p>
											)}
										</div>

										{/* Password Field */}
										<div className="space-y-1.5">
											<div className="flex items-center justify-between">
												<Label
													htmlFor="password"
													className="text-xs font-semibold text-slate-700 dark:text-slate-300"
												>
													Password <span className="text-red-500">*</span>
												</Label>
												
												{/* Interactive Password Recovery Dialog */}
												<Dialog open={forgotDialogOpen} onOpenChange={(open) => {
													setForgotDialogOpen(open);
													if (!open) {
														setForgotSuccess(false);
														setForgotEmail("");
													}
												}}>
													<DialogTrigger asChild>
														<button
															type="button"
															onClick={() => {
																setForgotEmail(values.email || "");
																setForgotDialogOpen(true);
															}}
															className="text-xs font-medium text-primary hover:text-primary/80 dark:text-blue-400 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
														>
															Forgot password?
														</button>
													</DialogTrigger>
													<DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
														<DialogHeader>
															<div className="w-11 h-11 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center mb-2">
																<KeyRound className="w-5 h-5" />
															</div>
															<DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
																Reset Administrator Password
															</DialogTitle>
															<DialogDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
																Enter your registered administrative email to receive an official cryptographic password reset link.
															</DialogDescription>
														</DialogHeader>

														{forgotSuccess ? (
															<div className="my-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2">
																<div className="flex items-center gap-2 font-semibold text-sm">
																	<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
																	Reset Instructions Dispatched
																</div>
																<p className="text-xs text-slate-600 dark:text-slate-300">
																	If an active administrator account exists for <span className="font-semibold text-slate-900 dark:text-white">{forgotEmail}</span>, a secure one-time reset link has been dispatched to that inbox. The link expires in 15 minutes.
																</p>
																<Button
																	type="button"
																	onClick={() => setForgotDialogOpen(false)}
																	className="w-full mt-3 h-9 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
																>
																	Return to Login
																</Button>
															</div>
														) : (
															<form onSubmit={handleForgotPasswordSubmit} className="space-y-4 my-2">
																<div className="space-y-1.5">
																	<Label htmlFor="forgot-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
																		Admin Email Address
																	</Label>
																	<div className="relative">
																		<Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
																		<Input
																			id="forgot-email"
																			type="email"
																			required
																			placeholder="admin@jgecalumni.in"
																			value={forgotEmail}
																			onChange={(e) => setForgotEmail(e.target.value)}
																			className="pl-9 h-11 text-xs rounded-xl"
																		/>
																	</div>
																</div>

																<Button
																	type="submit"
																	disabled={isForgotLoading}
																	className="w-full h-11 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
																>
																	{isForgotLoading ? (
																		<>
																			<Loader2 className="w-4 h-4 animate-spin" />
																			Sending Reset Link...
																		</>
																	) : (
																		<>
																			Send Password Reset Link
																			<ArrowRight className="w-3.5 h-3.5" />
																		</>
																	)}
																</Button>
															</form>
														)}

														<div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
															<span>Association Office Support:</span>
															<a
																href="mailto:support@jgecalumni.in"
																className="font-medium text-primary hover:underline flex items-center gap-1"
															>
																support@jgecalumni.in
																<ExternalLink className="w-3 h-3" />
															</a>
														</div>
													</DialogContent>
												</Dialog>
											</div>

											<div className="relative group">
												<div
													className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
														touched.password && errors.password
															? "text-red-500"
															: "text-slate-400 group-focus-within:text-primary"
													}`}
												>
													<Lock className="h-4.5 w-4.5" />
												</div>
												<Input
													id="password"
													name="password"
													type={showPassword ? "text" : "password"}
													autoComplete="current-password"
													value={values.password}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder="••••••••"
													aria-invalid={touched.password && Boolean(errors.password)}
													aria-describedby={touched.password && errors.password ? "password-error" : undefined}
													className={`pl-10 pr-11 h-11 sm:h-12 text-sm rounded-xl transition-all duration-200 ${
														touched.password && errors.password
															? "border-red-500 dark:border-red-500/80 bg-red-50/30 dark:bg-red-950/20 focus-visible:ring-red-500/30"
															: "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 focus-visible:border-primary"
													}`}
												/>
												<button
													type="button"
													onClick={() => setShowPassword((prev) => !prev)}
													aria-label={showPassword ? "Hide password" : "Show password"}
													className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:text-primary"
												>
													{showPassword ? (
														<EyeOff className="h-4.5 w-4.5" />
													) : (
														<Eye className="h-4.5 w-4.5" />
													)}
												</button>
											</div>
											{touched.password && errors.password && (
												<p
													id="password-error"
													role="alert"
													className="text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1.5 pt-0.5"
												>
													<AlertCircle className="w-3.5 h-3.5 shrink-0" />
													<span>{errors.password}</span>
												</p>
											)}
										</div>

										{/* Workstation Persistence Option */}
										<div className="flex items-center justify-between pt-1">
											<label
												htmlFor="remember-workstation"
												className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
											>
												<input
													id="remember-workstation"
													type="checkbox"
													checked={rememberMe}
													onChange={(e) => setRememberMe(e.target.checked)}
													className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary/30 dark:bg-slate-950 cursor-pointer"
												/>
												<span>Remember my workstation</span>
											</label>
											<span className="text-[11px] text-slate-400 hidden sm:inline">
												30-day session
											</span>
										</div>

										{/* Submit Action */}
										<Button
											type="submit"
											disabled={isLoading}
											className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed"
										>
											{isLoading ? (
												<>
													<span>Authenticating...</span>
													<Loader2 className="h-4.5 w-4.5 animate-spin" />
												</>
											) : (
												<>
													<span>Sign In to Console</span>
													<ArrowRight className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-1" />
												</>
											)}
										</Button>

										{/* Keyboard Hint */}
										<div className="text-center pt-1">
											<p className="text-[11px] text-slate-400 dark:text-slate-500">
												Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">Enter ↵</kbd> to sign in
											</p>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					</div>
				</div>
			</main>

			{/* Modern Micro-Footer */}
			<footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-500">
				<div>
					© {new Date().getFullYear()} Jalpaiguri Government Engineering College Alumni Association. All rights reserved.
				</div>
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300">
						<Building2 className="w-3.5 h-3.5" />
						Jalpaiguri, West Bengal
					</span>
					<span>•</span>
					<a
						href="mailto:support@jgecalumni.in"
						className="hover:text-primary dark:hover:text-blue-400 transition-colors"
					>
						IT Support
					</a>
				</div>
			</footer>
		</section>
	);
};

export default Login;
