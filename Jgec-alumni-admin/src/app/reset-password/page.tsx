"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
	Lock,
	Eye,
	EyeOff,
	CheckCircle2,
	AlertCircle,
	ArrowRight,
	Loader2,
	KeyRound,
	ShieldCheck,
	Check,
	X,
	ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { useResetPasswordMutation } from "@/store/feature/user-feature";

function ResetPasswordContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const token = searchParams.get("token") || "";
	const email = searchParams.get("email") || "";

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	// Password criteria checks
	const rules = useMemo(() => {
		return {
			length: newPassword.length >= 8,
			hasUpper: /[A-Z]/.test(newPassword),
			hasLower: /[a-z]/.test(newPassword),
			hasNumber: /[0-9]/.test(newPassword),
			hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
			matches: newPassword.length > 0 && newPassword === confirmPassword,
		};
	}, [newPassword, confirmPassword]);

	const passedCount = useMemo(() => {
		return [
			rules.length,
			rules.hasUpper,
			rules.hasLower,
			rules.hasNumber,
			rules.hasSpecial,
		].filter(Boolean).length;
	}, [rules]);

	const isFormValid =
		rules.length &&
		rules.hasUpper &&
		rules.hasLower &&
		rules.hasNumber &&
		rules.matches &&
		Boolean(token);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!token) {
			toast.error("Invalid reset link. Token parameter is missing.");
			return;
		}

		if (!rules.matches) {
			toast.error("Passwords do not match.");
			return;
		}

		try {
			const res = await resetPassword({
				token,
				newPassword,
			}).unwrap();

			if (res.success) {
				setIsSubmitted(true);
				toast.success(res.message || "Password reset successfully!");
			} else {
				toast.error(res.message || "Failed to reset password.");
			}
		} catch (err: any) {
			toast.error(
				err?.data?.message ||
					"Failed to reset password. The link may have expired."
			);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			{/* Brand / Title Header */}
			<div className="text-center mb-6">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 text-xs font-semibold mb-3">
					<KeyRound className="w-3.5 h-3.5" />
					<span>CRYPTOGRAPHIC CREDENTIAL RECOVERY</span>
				</div>
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
					Reset Administrator Password
				</h1>
				<p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
					{email ? (
						<>
							Updating credentials for{" "}
							<span className="font-semibold text-slate-800 dark:text-slate-200">
								{email}
							</span>
						</>
					) : (
						"Configure a new high-entropy password for your account."
					)}
				</p>
			</div>

			{/* Missing Token Banner */}
			{!token && (
				<div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-start gap-3 text-xs leading-relaxed">
					<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
					<div>
						<p className="font-semibold">Security Token Missing</p>
						<p className="mt-0.5 text-slate-600 dark:text-slate-400">
							This link does not include a valid authorization token. Please request a new password reset link from the login page or contact system administration.
						</p>
						<Link
							href="/login"
							className="inline-flex items-center gap-1.5 mt-2 font-semibold text-primary dark:text-blue-400 hover:underline"
						>
							Return to Login Console
							<ArrowRight className="w-3 h-3" />
						</Link>
					</div>
				</div>
			)}

			{isSubmitted ? (
				/* Success View */
				<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center space-y-4">
					<div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
						<CheckCircle2 className="w-8 h-8" />
					</div>
					<h2 className="text-xl font-bold text-slate-900 dark:text-white">
						Password Reset Complete
					</h2>
					<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
						Your administrative credentials have been successfully updated. All active sessions have been invalidated for security. You can now log in with your new password.
					</p>
					<Button
						onClick={() => router.push("/login")}
						className="w-full h-11 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 shadow-sm"
					>
						Proceed to Login
						<ArrowRight className="w-4 h-4" />
					</Button>
				</div>
			) : (
				/* Reset Password Form */
				<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* New Password */}
						<div className="space-y-1.5">
							<Label
								htmlFor="newPassword"
								className="text-xs font-semibold text-slate-700 dark:text-slate-300"
							>
								New Password <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
									<Lock className="w-4 h-4" />
								</div>
								<Input
									id="newPassword"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="••••••••••••"
									required
									className="pl-10 pr-10 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
								>
									{showPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div className="space-y-1.5">
							<Label
								htmlFor="confirmPassword"
								className="text-xs font-semibold text-slate-700 dark:text-slate-300"
							>
								Confirm New Password <span className="text-red-500">*</span>
							</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
									<ShieldCheck className="w-4 h-4" />
								</div>
								<Input
									id="confirmPassword"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="••••••••••••"
									required
									className={`pl-10 h-11 text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 ${
										confirmPassword && !rules.matches
											? "border-red-500/70"
											: confirmPassword && rules.matches
											? "border-emerald-500/70"
											: ""
									}`}
								/>
							</div>
						</div>

						{/* Strength Meter Bar */}
						{newPassword.length > 0 && (
							<div className="space-y-2 pt-1">
								<div className="flex items-center justify-between text-[11px]">
									<span className="text-slate-500">Security Strength</span>
									<span
										className={`font-semibold ${
											passedCount <= 2
												? "text-red-500"
												: passedCount <= 4
												? "text-amber-500"
												: "text-emerald-500"
										}`}
									>
										{passedCount <= 2
											? "Weak"
											: passedCount <= 4
											? "Moderate"
											: "Strong"}
									</span>
								</div>
								<div className="grid grid-cols-5 gap-1.5 h-1.5">
									{[1, 2, 3, 4, 5].map((lvl) => (
										<div
											key={lvl}
											className={`h-full rounded-full transition-colors ${
												lvl <= passedCount
													? passedCount <= 2
														? "bg-red-500"
														: passedCount <= 4
														? "bg-amber-500"
														: "bg-emerald-500"
													: "bg-slate-200 dark:bg-slate-800"
											}`}
										/>
									))}
								</div>

								{/* Checklist */}
								<div className="pt-2 grid grid-cols-2 gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
									<div className="flex items-center gap-1.5">
										{rules.length ? (
											<Check className="w-3.5 h-3.5 text-emerald-500" />
										) : (
											<X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
										)}
										<span>8+ characters</span>
									</div>
									<div className="flex items-center gap-1.5">
										{rules.hasUpper ? (
											<Check className="w-3.5 h-3.5 text-emerald-500" />
										) : (
											<X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
										)}
										<span>Uppercase letter</span>
									</div>
									<div className="flex items-center gap-1.5">
										{rules.hasLower ? (
											<Check className="w-3.5 h-3.5 text-emerald-500" />
										) : (
											<X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
										)}
										<span>Lowercase letter</span>
									</div>
									<div className="flex items-center gap-1.5">
										{rules.hasNumber ? (
											<Check className="w-3.5 h-3.5 text-emerald-500" />
										) : (
											<X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
										)}
										<span>Number (0-9)</span>
									</div>
									<div className="col-span-2 flex items-center gap-1.5">
										{rules.matches ? (
											<Check className="w-3.5 h-3.5 text-emerald-500" />
										) : (
											<X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
										)}
										<span>Passwords match</span>
									</div>
								</div>
							</div>
						)}

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={!isFormValid || isLoading}
							className="w-full h-11 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Encrypting & Updating Credentials...
								</>
							) : (
								<>
									Update Administrator Password
									<ArrowRight className="w-4 h-4" />
								</>
							)}
						</Button>

						<div className="text-center pt-2">
							<Link
								href="/login"
								className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
							>
								Cancel and return to Login
							</Link>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
			{/* Ambient Matrix Grid & Background Glow */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
				<div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-primary/15 blur-3xl" />
				<div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl" />
			</div>

			{/* Top Bar Header */}
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
								Security
							</span>
						</span>
						<p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
							Credential Management Gateway
						</p>
					</div>
				</div>

				<ThemeToggle />
			</header>

			{/* Center Body */}
			<main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
				<Suspense
					fallback={
						<div className="flex items-center justify-center py-20 text-slate-400 text-xs gap-2">
							<Loader2 className="w-5 h-5 animate-spin" />
							Loading security verification gateway...
						</div>
					}
				>
					<ResetPasswordContent />
				</Suspense>
			</main>

			{/* Footer */}
			<footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
				<span>
					Official Portal of Jalpaiguri Government Engineering College Alumni Association &bull; Secured with SHA-256
				</span>
			</footer>
		</div>
	);
}

