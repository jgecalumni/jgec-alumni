"use client";

import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
	ShieldAlert,
	ShieldCheck,
	UserPlus,
	Search,
	RotateCw,
	KeyRound,
	Trash2,
	Edit3,
	Mail,
	Lock,
	Check,
	CheckCircle2,
	AlertCircle,
	ExternalLink,
	Copy,
	Layers,
	Eye,
	EyeOff,
	Sparkles,
	SlidersHorizontal,
	LayoutGrid,
	Table as TableIcon,
	Clock,
	Calendar,
	UserCheck,
	Globe,
	FileText,
	GraduationCap,
	Receipt,
	CreditCard,
	Folder,
	Users as UsersIcon,
	Newspaper,
	Image as ImageIcon,
	Bell,
	Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	useGetUsersQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useForgotPasswordMutation,
	UserRecord,
} from "@/store/feature/user-feature";

// All available functional routes within the admin console
const SYSTEM_PATHS = [
	{ path: "/", label: "Dashboard", category: "Core", icon: Globe },
	{ path: "/members", label: "Alumni Directory", category: "Core", icon: UsersIcon },
	{ path: "/governing-body", label: "Governing Body", category: "Core", icon: Award },
	{ path: "/events", label: "Events & Reunions", category: "Core", icon: Calendar },
	{ path: "/notice", label: "Notice Board", category: "Core", icon: Bell },
	{ path: "/scholarship", label: "Scholarships", category: "Core", icon: GraduationCap },
	{ path: "/gallery", label: "Photo Gallery", category: "Media", icon: ImageIcon },
	{ path: "/media&press-release", label: "Media & Press", category: "Media", icon: Newspaper },
	{ path: "/receipt", label: "Donation Receipts", category: "Finance", icon: Receipt },
	{ path: "/payments", label: "Payments Ledger", category: "Finance", icon: CreditCard },
	{ path: "/documents/scholarship", label: "Doc: Scholarships", category: "Archives", icon: Folder },
	{ path: "/documents/kanchenjunga", label: "Doc: Kanchenjunga", category: "Archives", icon: Folder },
	{ path: "/documents/giving-back", label: "Doc: Giving Back", category: "Archives", icon: Folder },
	{ path: "/documents/audit-report", label: "Doc: Audit Reports", category: "Archives", icon: Folder },
	{ path: "/documents/agm-mom", label: "Doc: AGM Minutes", category: "Archives", icon: Folder },
	{ path: "/users", label: "User Governance", category: "System", icon: ShieldAlert },
];

export default function UsersManagementPage() {
	const { data, isLoading, isFetching, refetch } = useGetUsersQuery();
	const users = useMemo(() => data?.data || [], [data]);

	const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
	const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
	const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
	const [forgotPassword, { isLoading: isSendingReset }] = useForgotPasswordMutation();

	// Search & Filter state
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<"ALL" | "SUPER_ADMIN" | "ADMIN">("ALL");
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");

	// Modals state
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [editUser, setEditUser] = useState<UserRecord | null>(null);
	const [deleteCandidate, setDeleteCandidate] = useState<UserRecord | null>(null);
	const [resetCandidate, setResetCandidate] = useState<UserRecord | null>(null);
	const [lastGeneratedResetUrl, setLastGeneratedResetUrl] = useState<string | null>(null);

	// Create User Form State
	const [createForm, setCreateForm] = useState({
		name: "",
		email: "",
		password: "",
		role: "ADMIN" as "SUPER_ADMIN" | "ADMIN",
		allowedPaths: ["*"],
	});
	const [showCreatePassword, setShowCreatePassword] = useState(false);

	// Edit User Form State
	const [editForm, setEditForm] = useState({
		name: "",
		role: "ADMIN" as "SUPER_ADMIN" | "ADMIN",
		allowedPaths: [] as string[],
	});

	// Filtered users list
	const filteredUsers = useMemo(() => {
		return users.filter((u) => {
			const query = searchQuery.toLowerCase();
			const matchesSearch =
				u.name.toLowerCase().includes(query) ||
				u.email.toLowerCase().includes(query);
			const matchesRole =
				roleFilter === "ALL" ? true : u.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [users, searchQuery, roleFilter]);

	// Counts
	const superAdminsCount = useMemo(
		() => users.filter((u) => u.role === "SUPER_ADMIN").length,
		[users]
	);
	const standardAdminsCount = useMemo(
		() => users.filter((u) => u.role === "ADMIN").length,
		[users]
	);

	// Generate Random Strong Password
	const generateStrongPassword = () => {
		const chars =
			"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*";
		let generated = "";
		for (let i = 0; i < 12; i++) {
			generated += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		setCreateForm((prev) => ({ ...prev, password: generated }));
		setShowCreatePassword(true);
		toast.success("High-entropy password generated!");
	};

	// Handle Create Submit
	const handleCreateSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!createForm.name || !createForm.email || !createForm.password) {
			toast.error("Name, email, and password are required.");
			return;
		}

		try {
			const res = await createUser({
				name: createForm.name.trim(),
				email: createForm.email.trim().toLowerCase(),
				password: createForm.password,
				role: createForm.role,
				allowedPaths: createForm.allowedPaths,
			}).unwrap();

			if (res.success) {
				toast.success("Administrator account provisioned successfully!");
				setCreateModalOpen(false);
				setCreateForm({
					name: "",
					email: "",
					password: "",
					role: "ADMIN",
					allowedPaths: ["*"],
				});
			} else {
				toast.error(res.message || "Failed to create user.");
			}
		} catch (err: any) {
			toast.error(err?.data?.message || "Error creating administrator.");
		}
	};

	// Open Edit Modal
	const handleOpenEdit = (user: UserRecord) => {
		setEditUser(user);
		setEditForm({
			name: user.name,
			role: user.role,
			allowedPaths: [...user.allowedPaths],
		});
	};

	// Handle Edit Submit
	const handleEditSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editUser) return;

		try {
			const res = await updateUser({
				id: editUser.id,
				name: editForm.name.trim(),
				role: editForm.role,
				allowedPaths: editForm.allowedPaths,
			}).unwrap();

			if (res.success) {
				toast.success("User access profile updated!");
				setEditUser(null);
			} else {
				toast.error(res.message || "Failed to update user.");
			}
		} catch (err: any) {
			toast.error(err?.data?.message || "Error updating user.");
		}
	};

	// Handle Delete Submit
	const handleDeleteSubmit = async () => {
		if (!deleteCandidate) return;

		try {
			const res = await deleteUser(deleteCandidate.id).unwrap();
			if (res.success) {
				toast.success("Account permanently deleted.");
				setDeleteCandidate(null);
			} else {
				toast.error(res.message || "Failed to delete user.");
			}
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to delete user.");
		}
	};

	// Handle Send Reset Link (Forgot Password per user)
	const handleSendResetLink = async (user: UserRecord) => {
		setResetCandidate(user);
		try {
			const res = await forgotPassword({ email: user.email }).unwrap();
			if (res.success) {
				const origin =
					typeof window !== "undefined" ? window.location.origin : "";
				const resetLink = res.debugToken
					? `${origin}/reset-password?token=${res.debugToken}&email=${encodeURIComponent(
							user.email
					  )}`
					: null;
				setLastGeneratedResetUrl(resetLink);
				toast.success(
					`Password reset link dispatched to ${user.email}!`
				);
			} else {
				toast.error(res.message || "Failed to dispatch reset link.");
			}
		} catch (err: any) {
			toast.error(err?.data?.message || "Error sending reset email.");
		}
	};

	// Toggle path selection in form
	const togglePathInForm = (
		path: string,
		isEdit: boolean = false
	) => {
		if (isEdit) {
			setEditForm((prev) => {
				const current = prev.allowedPaths;
				let nextPaths: string[];
				if (path === "*") {
					nextPaths = current.includes("*") ? [] : ["*"];
				} else {
					const filtered = current.filter((p) => p !== "*");
					nextPaths = filtered.includes(path)
						? filtered.filter((p) => p !== path)
						: [...filtered, path];
				}
				return { ...prev, allowedPaths: nextPaths };
			});
		} else {
			setCreateForm((prev) => {
				const current = prev.allowedPaths;
				let nextPaths: string[];
				if (path === "*") {
					nextPaths = current.includes("*") ? [] : ["*"];
				} else {
					const filtered = current.filter((p) => p !== "*");
					nextPaths = filtered.includes(path)
						? filtered.filter((p) => p !== path)
						: [...filtered, path];
				}
				return { ...prev, allowedPaths: nextPaths };
			});
		}
	};

	return (
		<div className="space-y-8 pb-16">
			{/* 1. Header Command Area */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
				<div>
					<div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 text-xs font-semibold mb-2">
						<ShieldAlert className="w-3.5 h-3.5" />
						<span>SYSTEM ACCESS & GOVERNANCE</span>
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
						Administrator Accounts
					</h1>
					<p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
						Provision privileged council accounts, manage route permissions, and issue password recovery keys.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						size="sm"
						onClick={() => refetch()}
						disabled={isFetching}
						className="h-10 text-xs font-medium rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
					>
						<RotateCw
							className={`w-3.5 h-3.5 mr-1.5 ${
								isFetching ? "animate-spin text-primary" : ""
							}`}
						/>
						Sync Accounts
					</Button>

					<Button
						onClick={() => setCreateModalOpen(true)}
						className="h-10 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center gap-2 shadow-sm"
					>
						<UserPlus className="w-4 h-4" />
						<span>Create Administrator</span>
					</Button>
				</div>
			</div>

			{/* 2. Institutional Metric Badges */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Total Accounts
						</span>
						<div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
							<UsersIcon className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-2xl font-bold text-slate-900 dark:text-white">
							{users.length}
						</span>
						<span className="text-xs text-slate-500">active profiles</span>
					</div>
				</div>

				<div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Super Admins
						</span>
						<div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
							<ShieldAlert className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-2xl font-bold text-slate-900 dark:text-white">
							{superAdminsCount}
						</span>
						<span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
							unrestricted (*)
						</span>
					</div>
				</div>

				<div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Scoped Admins
						</span>
						<div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
							<ShieldCheck className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-2xl font-bold text-slate-900 dark:text-white">
							{standardAdminsCount}
						</span>
						<span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
							role-based routes
						</span>
					</div>
				</div>

				<div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Auth Protocol
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
							<KeyRound className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
							Dual-Token Refresh
						</span>
						<span className="text-[11px] text-slate-500">Active</span>
					</div>
				</div>
			</div>

			{/* 3. Filter & Search Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
				{/* Search Input */}
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search by administrator name or email address..."
						className="pl-10 h-10 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60"
					/>
				</div>

				{/* Role Filters & View Switcher */}
				<div className="flex items-center gap-2">
					<div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
						{(["ALL", "SUPER_ADMIN", "ADMIN"] as const).map((role) => (
							<button
								key={role}
								onClick={() => setRoleFilter(role)}
								className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
									roleFilter === role
										? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
										: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
								}`}
							>
								{role === "ALL"
									? "All Roles"
									: role === "SUPER_ADMIN"
									? "Super Admins"
									: "Standard Admins"}
							</button>
						))}
					</div>

					<div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />

					{/* View Toggle */}
					<div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
						<button
							onClick={() => setViewMode("table")}
							title="Table View"
							className={`p-1.5 rounded-lg transition-colors ${
								viewMode === "table"
									? "bg-white dark:bg-slate-900 text-primary shadow-sm"
									: "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
							}`}
						>
							<TableIcon className="w-4 h-4" />
						</button>
						<button
							onClick={() => setViewMode("grid")}
							title="Card Grid View"
							className={`p-1.5 rounded-lg transition-colors ${
								viewMode === "grid"
									? "bg-white dark:bg-slate-900 text-primary shadow-sm"
									: "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
							}`}
						>
							<LayoutGrid className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			{/* 4. Users Data Presentation */}
			{isLoading ? (
				<div className="py-20 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
					<div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
					<span>Loading administrator directory...</span>
				</div>
			) : filteredUsers.length === 0 ? (
				<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
					<div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
						<ShieldAlert className="w-6 h-6" />
					</div>
					<h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
						No Administrators Found
					</h3>
					<p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
						{searchQuery
							? `No accounts matched your search "${searchQuery}".`
							: "No administrative accounts exist under this filter category."}
					</p>
					{searchQuery && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSearchQuery("")}
							className="mt-4 text-xs rounded-xl"
						>
							Clear Search Filter
						</Button>
					)}
				</div>
			) : viewMode === "table" ? (
				/* Table View */
				<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse text-xs">
							<thead>
								<tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-slate-500 uppercase tracking-wider text-[10px]">
									<th className="py-3.5 px-4 font-semibold">Administrator</th>
									<th className="py-3.5 px-4 font-semibold">Role Privilege</th>
									<th className="py-3.5 px-4 font-semibold">Route Authorizations</th>
									<th className="py-3.5 px-4 font-semibold">Last Active</th>
									<th className="py-3.5 px-4 font-semibold text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{filteredUsers.map((user) => {
									const isSuper = user.role === "SUPER_ADMIN";
									const hasWildcard = user.allowedPaths?.includes("*");
									const initials = user.name
										? user.name
												.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()
												.slice(0, 2)
										: "AD";

									return (
										<tr
											key={user.id}
											className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
										>
											{/* Name & Email */}
											<td className="py-4 px-4">
												<div className="flex items-center gap-3">
													<div
														className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border ${
															isSuper
																? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
																: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
														}`}
													>
														{initials}
													</div>
													<div className="min-w-0">
														<div className="font-semibold text-slate-900 dark:text-white truncate">
															{user.name}
														</div>
														<div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
															{user.email}
														</div>
													</div>
												</div>
											</td>

											{/* Role Badge */}
											<td className="py-4 px-4">
												{isSuper ? (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
														<ShieldAlert className="w-3 h-3 text-purple-600 dark:text-purple-400" />
														SUPER ADMIN
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
														<ShieldCheck className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
														ADMIN
													</span>
												)}
											</td>

											{/* Route Authorizations */}
											<td className="py-4 px-4">
												{hasWildcard ? (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
														<Globe className="w-3 h-3" />
														Unrestricted Access (*)
													</span>
												) : (
													<div className="flex flex-wrap gap-1 max-w-xs">
														{user.allowedPaths?.slice(0, 3).map((p) => (
															<span
																key={p}
																className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-mono"
															>
																{p}
															</span>
														))}
														{user.allowedPaths?.length > 3 && (
															<span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-700 dark:text-slate-300">
																+{user.allowedPaths.length - 3} more
															</span>
														)}
													</div>
												)}
											</td>

											{/* Last Login Date */}
											<td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
												<div className="flex items-center gap-1.5">
													<Clock className="w-3.5 h-3.5 text-slate-400" />
													<span>
														{user.last_login_at
															? new Date(user.last_login_at).toLocaleDateString(
																	"en-IN",
																	{
																		month: "short",
																		day: "numeric",
																		year: "numeric",
																	}
															  )
															: "Never logged in"}
													</span>
												</div>
											</td>

											{/* Actions: Send Reset Link, Edit, Delete */}
											<td className="py-4 px-4 text-right">
												<div className="flex items-center justify-end gap-1.5">
													{/* Forgot Password / Send Reset Link Action */}
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleSendResetLink(user)}
														disabled={isSendingReset}
														title="Send Password Reset Link"
														className="h-8 px-2.5 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 dark:text-amber-400 rounded-lg flex items-center gap-1"
													>
														<KeyRound className="w-3.5 h-3.5" />
														<span className="hidden lg:inline text-[11px]">
															Reset Link
														</span>
													</Button>

													{/* Edit User Button */}
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleOpenEdit(user)}
														title="Edit Permissions"
														className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
													>
														<Edit3 className="w-3.5 h-3.5" />
													</Button>

													{/* Delete User Button */}
													<Button
														variant="ghost"
														size="sm"
														onClick={() => setDeleteCandidate(user)}
														title="Revoke / Delete User"
														className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
													>
														<Trash2 className="w-3.5 h-3.5" />
													</Button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				/* Card Grid View */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredUsers.map((user) => {
						const isSuper = user.role === "SUPER_ADMIN";
						const hasWildcard = user.allowedPaths?.includes("*");
						const initials = user.name
							? user.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()
									.slice(0, 2)
							: "AD";

						return (
							<div
								key={user.id}
								className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
							>
								{/* Card Top: Avatar & Role */}
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-center gap-3 min-w-0">
										<div
											className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
												isSuper
													? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
													: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
											}`}
										>
											{initials}
										</div>
										<div className="min-w-0">
											<h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
												{user.name}
											</h4>
											<p className="text-xs text-slate-500 dark:text-slate-400 truncate">
												{user.email}
											</p>
										</div>
									</div>

									{isSuper ? (
										<span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
											SUPER
										</span>
									) : (
										<span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
											ADMIN
										</span>
									)}
								</div>

								{/* Routes Granted Preview */}
								<div className="space-y-1.5">
									<span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
										Authorized Routes
									</span>
									<div>
										{hasWildcard ? (
											<div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
												<Globe className="w-3 h-3" />
												Full System Wildcard (*)
											</div>
										) : (
											<div className="flex flex-wrap gap-1">
												{user.allowedPaths?.map((p) => (
													<span
														key={p}
														className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-mono"
													>
														{p}
													</span>
												))}
											</div>
										)}
									</div>
								</div>

								{/* Card Bottom: Metadata & Actions */}
								<div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
									<div className="text-[11px] text-slate-400 flex items-center gap-1">
										<Clock className="w-3.5 h-3.5" />
										<span>
											{user.last_login_at
												? new Date(user.last_login_at).toLocaleDateString()
												: "Never"}
										</span>
									</div>

									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleSendResetLink(user)}
											title="Send Password Reset Link"
											className="h-8 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-1"
										>
											<KeyRound className="w-3.5 h-3.5" />
											<span className="text-[11px]">Reset</span>
										</Button>

										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleOpenEdit(user)}
											title="Edit Permissions"
											className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
										>
											<Edit3 className="w-3.5 h-3.5" />
										</Button>

										<Button
											variant="ghost"
											size="sm"
											onClick={() => setDeleteCandidate(user)}
											title="Revoke / Delete User"
											className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
										>
											<Trash2 className="w-3.5 h-3.5" />
										</Button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* ================= MODAL: CREATE USER ================= */}
			<Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
				<DialogContent className="max-w-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
							<UserPlus className="w-5 h-5" />
						</div>
						<DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
							Provision Administrator Account
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-500 leading-relaxed">
							Create a verified administrative council profile. An official welcome email with initial credentials will be automatically dispatched.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleCreateSubmit} className="space-y-5 my-2">
						{/* Name & Email Row */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Full Name <span className="text-red-500">*</span>
								</Label>
								<Input
									required
									value={createForm.name}
									onChange={(e) =>
										setCreateForm((p) => ({ ...p, name: e.target.value }))
									}
									placeholder="Dr. Sourav Sengupta"
									className="h-10 text-xs rounded-xl"
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Email Address <span className="text-red-500">*</span>
								</Label>
								<Input
									type="email"
									required
									value={createForm.email}
									onChange={(e) =>
										setCreateForm((p) => ({ ...p, email: e.target.value }))
									}
									placeholder="sourav@jgecalumni.in"
									className="h-10 text-xs rounded-xl"
								/>
							</div>
						</div>

						{/* Password Field + Generator */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Initial Password <span className="text-red-500">*</span>
								</Label>
								<button
									type="button"
									onClick={generateStrongPassword}
									className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
								>
									<Sparkles className="w-3 h-3" />
									Generate Strong Password
								</button>
							</div>
							<div className="relative">
								<Input
									type={showCreatePassword ? "text" : "password"}
									required
									value={createForm.password}
									onChange={(e) =>
										setCreateForm((p) => ({ ...p, password: e.target.value }))
									}
									placeholder="Minimum 8 characters"
									className="pr-10 h-10 text-xs rounded-xl font-mono"
								/>
								<button
									type="button"
									onClick={() => setShowCreatePassword(!showCreatePassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
								>
									{showCreatePassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</button>
							</div>
						</div>

						{/* Role Selection */}
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
								Account Role
							</Label>
							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={() =>
										setCreateForm((p) => ({
											...p,
											role: "ADMIN",
											allowedPaths: p.allowedPaths.includes("*")
												? ["/members", "/events", "/notice"]
												: p.allowedPaths,
										}))
									}
									className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
										createForm.role === "ADMIN"
											? "border-cyan-500 bg-cyan-500/10 text-cyan-900 dark:text-cyan-200 ring-1 ring-cyan-500"
											: "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
									}`}
								>
									<ShieldCheck className="w-4 h-4 mt-0.5 text-cyan-600 shrink-0" />
									<div>
										<div className="text-xs font-bold">Standard Admin</div>
										<div className="text-[10px] text-slate-500 dark:text-slate-400">
											Access confined to selected operational routes.
										</div>
									</div>
								</button>

								<button
									type="button"
									onClick={() =>
										setCreateForm((p) => ({
											...p,
											role: "SUPER_ADMIN",
											allowedPaths: ["*"],
										}))
									}
									className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
										createForm.role === "SUPER_ADMIN"
											? "border-purple-500 bg-purple-500/10 text-purple-900 dark:text-purple-200 ring-1 ring-purple-500"
											: "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
									}`}
								>
									<ShieldAlert className="w-4 h-4 mt-0.5 text-purple-600 shrink-0" />
									<div>
										<div className="text-xs font-bold">Super Admin</div>
										<div className="text-[10px] text-slate-500 dark:text-slate-400">
											Full root access across all current and future paths.
										</div>
									</div>
								</button>
							</div>
						</div>

						{/* Route Permissions Selector */}
						<div className="space-y-2 pt-2">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Authorized Navigation Paths
								</Label>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() =>
											setCreateForm((p) => ({
												...p,
												allowedPaths: ["*"],
											}))
										}
										className="text-[11px] font-semibold text-primary hover:underline"
									>
										Grant All (*)
									</button>
									<span className="text-slate-300 dark:text-slate-700">&bull;</span>
									<button
										type="button"
										onClick={() =>
											setCreateForm((p) => ({
												...p,
												allowedPaths: SYSTEM_PATHS.map((s) => s.path),
											}))
										}
										className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
									>
										Check All
									</button>
									<span className="text-slate-300 dark:text-slate-700">&bull;</span>
									<button
										type="button"
										onClick={() =>
											setCreateForm((p) => ({
												...p,
												allowedPaths: [],
											}))
										}
										className="text-[11px] text-slate-500 hover:text-red-500"
									>
										Clear
									</button>
								</div>
							</div>

							{createForm.allowedPaths.includes("*") ? (
								<div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
									<div className="flex items-center gap-2 text-xs font-medium">
										<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
										<span>Unrestricted Super Admin Wildcard (*) Granted</span>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											setCreateForm((p) => ({
												...p,
												allowedPaths: ["/members", "/events", "/notice"],
											}))
										}
										className="h-7 text-[10px] rounded-lg"
									>
										Configure Specific Paths
									</Button>
								</div>
							) : (
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 max-h-48 overflow-y-auto">
									{SYSTEM_PATHS.map((item) => {
										const isSelected = createForm.allowedPaths.includes(
											item.path
										);
										const Icon = item.icon;
										return (
											<button
												key={item.path}
												type="button"
												onClick={() => togglePathInForm(item.path, false)}
												className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all ${
													isSelected
														? "bg-primary text-white font-medium shadow-sm"
														: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
												}`}
											>
												<Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
												<span className="truncate">{item.label}</span>
											</button>
										);
									})}
								</div>
							)}
						</div>

						<DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setCreateModalOpen(false)}
								className="text-xs"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isCreating}
								className="h-10 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
							>
								{isCreating ? "Provisioning..." : "Provision Account"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* ================= MODAL: EDIT USER ================= */}
			<Dialog open={Boolean(editUser)} onOpenChange={(open) => !open && setEditUser(null)}>
				<DialogContent className="max-w-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
							<Edit3 className="w-5 h-5" />
						</div>
						<DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
							Update Permissions & Profile
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-500">
							Modifying administrative access for {editUser?.email}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleEditSubmit} className="space-y-5 my-2">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
								Full Name
							</Label>
							<Input
								required
								value={editForm.name}
								onChange={(e) =>
									setEditForm((p) => ({ ...p, name: e.target.value }))
								}
								className="h-10 text-xs rounded-xl"
							/>
						</div>

						{/* Role Selection */}
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
								Account Role
							</Label>
							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={() =>
										setEditForm((p) => ({
											...p,
											role: "ADMIN",
										}))
									}
									className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
										editForm.role === "ADMIN"
											? "border-cyan-500 bg-cyan-500/10 text-cyan-900 dark:text-cyan-200 ring-1 ring-cyan-500"
											: "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
									}`}
								>
									<ShieldCheck className="w-4 h-4 mt-0.5 text-cyan-600 shrink-0" />
									<div>
										<div className="text-xs font-bold">Standard Admin</div>
										<div className="text-[10px] text-slate-500 dark:text-slate-400">
											Restricted to specific paths.
										</div>
									</div>
								</button>

								<button
									type="button"
									onClick={() =>
										setEditForm((p) => ({
											...p,
											role: "SUPER_ADMIN",
											allowedPaths: ["*"],
										}))
									}
									className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
										editForm.role === "SUPER_ADMIN"
											? "border-purple-500 bg-purple-500/10 text-purple-900 dark:text-purple-200 ring-1 ring-purple-500"
											: "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
									}`}
								>
									<ShieldAlert className="w-4 h-4 mt-0.5 text-purple-600 shrink-0" />
									<div>
										<div className="text-xs font-bold">Super Admin</div>
										<div className="text-[10px] text-slate-500 dark:text-slate-400">
											Full root access (*).
										</div>
									</div>
								</button>
							</div>
						</div>

						{/* Route Permissions Selector */}
						<div className="space-y-2 pt-2">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Authorized Navigation Paths
								</Label>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() =>
											setEditForm((p) => ({
												...p,
												allowedPaths: ["*"],
											}))
										}
										className="text-[11px] font-semibold text-primary hover:underline"
									>
										Grant All (*)
									</button>
									<span className="text-slate-300 dark:text-slate-700">&bull;</span>
									<button
										type="button"
										onClick={() =>
											setEditForm((p) => ({
												...p,
												allowedPaths: SYSTEM_PATHS.map((s) => s.path),
											}))
										}
										className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
									>
										Check All
									</button>
									<span className="text-slate-300 dark:text-slate-700">&bull;</span>
									<button
										type="button"
										onClick={() =>
											setEditForm((p) => ({
												...p,
												allowedPaths: [],
											}))
										}
										className="text-[11px] text-slate-500 hover:text-red-500"
									>
										Clear
									</button>
								</div>
							</div>

							{editForm.allowedPaths.includes("*") ? (
								<div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
									<div className="flex items-center gap-2 text-xs font-medium">
										<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
										<span>Unrestricted Super Admin Wildcard (*) Granted</span>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											setEditForm((p) => ({
												...p,
												allowedPaths: ["/members", "/events"],
											}))
										}
										className="h-7 text-[10px] rounded-lg"
									>
										Restrict Paths
									</Button>
								</div>
							) : (
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 max-h-48 overflow-y-auto">
									{SYSTEM_PATHS.map((item) => {
										const isSelected = editForm.allowedPaths.includes(
											item.path
										);
										const Icon = item.icon;
										return (
											<button
												key={item.path}
												type="button"
												onClick={() => togglePathInForm(item.path, true)}
												className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all ${
													isSelected
														? "bg-primary text-white font-medium shadow-sm"
														: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
												}`}
											>
												<Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
												<span className="truncate">{item.label}</span>
											</button>
										);
									})}
								</div>
							)}
						</div>

						<DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setEditUser(null)}
								className="text-xs"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isUpdating}
								className="h-10 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
							>
								{isUpdating ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* ================= MODAL: DELETE CONFIRMATION ================= */}
			<Dialog
				open={Boolean(deleteCandidate)}
				onOpenChange={(open) => !open && setDeleteCandidate(null)}
			>
				<DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
					<DialogHeader>
						<div className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mb-2">
							<Trash2 className="w-5 h-5" />
						</div>
						<DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
							Revoke Administrator Access
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-500 leading-relaxed">
							Are you sure you want to permanently delete the administrative account for{" "}
							<span className="font-semibold text-slate-800 dark:text-slate-200">
								{deleteCandidate?.name} ({deleteCandidate?.email})
							</span>
							? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>

					<DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
						<Button
							type="button"
							variant="ghost"
							onClick={() => setDeleteCandidate(null)}
							className="text-xs"
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={isDeleting}
							onClick={handleDeleteSubmit}
							className="h-10 text-xs font-semibold rounded-xl"
						>
							{isDeleting ? "Revoking..." : "Revoke Account"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* ================= MODAL: RESET LINK DETAILS / DEBUG ================= */}
			<Dialog
				open={Boolean(lastGeneratedResetUrl)}
				onOpenChange={(open) => !open && setLastGeneratedResetUrl(null)}
			>
				<DialogContent className="max-w-lg p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
					<DialogHeader>
						<div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2">
							<KeyRound className="w-5 h-5" />
						</div>
						<DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
							Password Reset Link Generated
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-500 leading-relaxed">
							The reset instructions were dispatched to{" "}
							<span className="font-semibold text-slate-800 dark:text-slate-200">
								{resetCandidate?.email}
							</span>
							. For administrative convenience, the direct recovery link is also provided below:
						</DialogDescription>
					</DialogHeader>

					{lastGeneratedResetUrl && (
						<div className="space-y-3 my-2">
							<div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 break-all font-mono text-[11px] text-slate-700 dark:text-slate-300">
								{lastGeneratedResetUrl}
							</div>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										navigator.clipboard.writeText(lastGeneratedResetUrl);
										toast.success("Reset URL copied to clipboard!");
									}}
									className="flex-1 h-9 text-xs rounded-xl flex items-center justify-center gap-1.5"
								>
									<Copy className="w-3.5 h-3.5" />
									Copy Recovery Link
								</Button>
								<Button
									type="button"
									onClick={() => window.open(lastGeneratedResetUrl, "_blank")}
									className="flex-1 h-9 text-xs rounded-xl bg-primary text-white flex items-center justify-center gap-1.5"
								>
									<ExternalLink className="w-3.5 h-3.5" />
									Open Link
								</Button>
							</div>
						</div>
					)}

					<DialogFooter className="pt-2">
						<Button
							type="button"
							onClick={() => setLastGeneratedResetUrl(null)}
							className="w-full text-xs"
						>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
