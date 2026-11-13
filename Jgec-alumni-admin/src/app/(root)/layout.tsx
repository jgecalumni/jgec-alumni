"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
	LayoutDashboard,
	Users,
	CalendarDays,
	BellRing,
	GraduationCap,
	Images,
	Newspaper,
	Receipt,
	CreditCard,
	Folder,
	ChevronDown,
	LogOut,
	Loader2,
	ExternalLink,
	PanelLeftClose,
	PanelLeft,
	Menu,
	X,
	ShieldAlert,
	Lock,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { useLogoutMutation } from "@/store/baseApi";
import { clearAuthCookies } from "@/app/actions";

const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 210;
const MAX_WIDTH = 420;
const COLLAPSED_WIDTH = 70;

interface CurrentUser {
	id?: string;
	name?: string;
	email?: string;
	role?: string;
	allowedPaths?: string[];
}

const getStoredUser = (): CurrentUser | null => {
	if (typeof window === "undefined") return null;
	try {
		const stored = localStorage.getItem("user_info");
		if (stored) return JSON.parse(stored);
	} catch {}
	try {
		const cookies = document.cookie.split("; ");
		const userCookie = cookies.find((c) => c.startsWith("user_session="));
		if (userCookie) {
			const raw = decodeURIComponent(userCookie.split("=")[1]);
			return JSON.parse(raw);
		}
	} catch {}
	return null;
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const router = useRouter();
	const [logout, { isLoading }] = useLogoutMutation();

	// Sidebar resizable state
	const [sidebarWidth, setSidebarWidth] = useState<number>(DEFAULT_WIDTH);
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [mobileOpen, setMobileOpen] = useState<boolean>(false);
	const [documentsOpen, setDocumentsOpen] = useState<boolean>(pathname.startsWith("/documents"));

	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
		const user = getStoredUser();
		if (user) {
			setCurrentUser(user);
		}
	}, []);

	// Route Authorization check
	const isPathAllowed = useCallback(
		(targetPath: string) => {
			if (!isMounted || !currentUser) return true; // During SSR / hydration, default to true to match HTML
			if (currentUser.role === "SUPER_ADMIN") return true;
			if (currentUser.allowedPaths?.includes("*")) return true;
			return Boolean(
				currentUser.allowedPaths?.some(
					(p) =>
						targetPath === p ||
						(p !== "/" && targetPath.startsWith(`${p}/`)) ||
						(p === "/" && targetPath === "/")
				)
			);
		},
		[isMounted, currentUser]
	);

	// Client-side guard: redirect immediately if visiting an unauthorized URL
	useEffect(() => {
		if (!isMounted || !currentUser) return;
		if (!isPathAllowed(pathname)) {
			toast.error(`Access restricted: You do not have permission to view this section.`);
			const fallback =
				currentUser.allowedPaths?.find((p) => p !== "*" && p !== pathname) || "/";
			router.push(fallback);
		}
	}, [pathname, isMounted, currentUser, isPathAllowed, router]);

	// Load persisted width and collapsed preference from localStorage
	useEffect(() => {
		const savedWidth = localStorage.getItem("jgec_admin_sidebar_width");
		if (savedWidth) {
			const parsed = parseInt(savedWidth, 10);
			if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
				setSidebarWidth(parsed);
			}
		}
		const savedCollapsed = localStorage.getItem("jgec_admin_sidebar_collapsed");
		if (savedCollapsed !== null) {
			setIsCollapsed(savedCollapsed === "true");
		}
	}, []);

	// Handle Drag Resizing
	const startResizing = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	}, []);

	const stopResizing = useCallback(() => {
		setIsResizing(false);
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing) return;
			const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
			setSidebarWidth(newWidth);
			localStorage.setItem("jgec_admin_sidebar_width", newWidth.toString());
		},
		[isResizing]
	);

	useEffect(() => {
		if (isResizing) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", stopResizing);
			document.body.style.userSelect = "none";
			document.body.style.cursor = "col-resize";
		} else {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", stopResizing);
			document.body.style.userSelect = "";
			document.body.style.cursor = "";
		}
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", stopResizing);
			document.body.style.userSelect = "";
			document.body.style.cursor = "";
		};
	}, [isResizing, handleMouseMove, stopResizing]);

	const toggleCollapse = () => {
		setIsCollapsed((prev) => {
			const next = !prev;
			localStorage.setItem("jgec_admin_sidebar_collapsed", next ? "true" : "false");
			return next;
		});
	};

	const resetWidth = () => {
		setSidebarWidth(DEFAULT_WIDTH);
		localStorage.setItem("jgec_admin_sidebar_width", DEFAULT_WIDTH.toString());
		toast.success("Sidebar width reset to default (260px)");
	};

	const handleLogout = async () => {
		try {
			const res = await logout().unwrap();
			if (res.success) {
				toast.success(res.message);
			} else {
				toast.error(res.message || "Failed to logout from server");
			}
		} catch (error: any) {
			toast.error(error?.data?.message || "Failed to logout from server");
		} finally {
			try {
				localStorage.removeItem("user_info");
			} catch {}
			await clearAuthCookies();
			window.location.href = "/login";
		}
	};

	// Primary navigation items with dedicated vibrant color accents
	const mainNavItems = [
		{
			name: "Dashboard",
			path: "/",
			icon: LayoutDashboard,
			color: "text-blue-500",
			bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
			activeColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 ring-1 ring-blue-500/30",
		},
		{
			name: "Members",
			path: "/members",
			icon: Users,
			color: "text-cyan-500",
			bgColor: "bg-cyan-500/10 dark:bg-cyan-500/20",
			activeColor: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 ring-1 ring-cyan-500/30",
		},
		{
			name: "Events & Reunions",
			path: "/events",
			icon: CalendarDays,
			color: "text-purple-500",
			bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
			activeColor: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 ring-1 ring-purple-500/30",
		},
		{
			name: "Notice Board",
			path: "/notice",
			icon: BellRing,
			color: "text-amber-500",
			bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
			activeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/30",
		},
		{
			name: "Scholarships",
			path: "/scholarship",
			icon: GraduationCap,
			color: "text-emerald-500",
			bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
			activeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30",
		},
	];

	const mediaNavItems = [
		{
			name: "Photo Gallery",
			path: "/gallery",
			icon: Images,
			color: "text-pink-500",
			bgColor: "bg-pink-500/10 dark:bg-pink-500/20",
			activeColor: "bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 ring-1 ring-pink-500/30",
		},
		{
			name: "Media & Press",
			path: "/media&press-release",
			icon: Newspaper,
			color: "text-indigo-500",
			bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20",
			activeColor: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-500/30",
		},
	];

	const financeNavItems = [
		{
			name: "Donation Receipts",
			path: "/receipt",
			icon: Receipt,
			color: "text-teal-500",
			bgColor: "bg-teal-500/10 dark:bg-teal-500/20",
			activeColor: "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 ring-1 ring-teal-500/30",
		},
		{
			name: "Payments Ledger",
			path: "/payments",
			icon: CreditCard,
			color: "text-rose-500",
			bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
			activeColor: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30",
		},
	];

	const systemNavItems = [
		{
			name: "User Governance",
			path: "/users",
			icon: ShieldAlert,
			color: "text-violet-500",
			bgColor: "bg-violet-500/10 dark:bg-violet-500/20",
			activeColor: "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 ring-1 ring-violet-500/30",
		},
	];

	const documentSections = [
		{ name: "Scholarships", path: "/documents/scholarship" },
		{ name: "Kanchenjunga", path: "/documents/kanchenjunga" },
		{ name: "Giving Back", path: "/documents/giving-back" },
		{ name: "Audit Reports", path: "/documents/audit-report" },
		{ name: "AGM Minutes", path: "/documents/agm-mom" },
	];

	const getPageTitle = () => {
		if (pathname === "/") return "Executive Dashboard";
		if (pathname.startsWith("/members")) return "Alumni Directory";
		if (pathname.startsWith("/events")) return "Events & Reunions";
		if (pathname.startsWith("/notice")) return "Notice Board";
		if (pathname.startsWith("/scholarship")) return "Scholarships & Grants";
		if (pathname.startsWith("/gallery")) return "Photo Gallery";
		if (pathname.startsWith("/media&press-release")) return "Media & Press";
		if (pathname.startsWith("/receipt")) return "Donation Receipts";
		if (pathname.startsWith("/payments")) return "Payments Ledger";
		if (pathname.startsWith("/documents")) return "Official Documents";
		if (pathname.startsWith("/users")) return "User Management & RBAC";
		return "Console";
	};

	// Sidebar Inner Content Component (used for both desktop and mobile drawer)
	const renderSidebarContent = (mobile = false) => {
		const showFull = !isCollapsed || mobile;

		return (
			<div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 select-none overflow-hidden">

				{/* 1. Header: Logo, Branding & Collapse Toggle */}
				<div className="shrink-0 border-b border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900">
					{showFull ? (
						// Expanded Header
						<div className="flex items-center justify-between px-3.5 py-3">
							<div className="flex items-center gap-3 min-w-0">
								<div className="relative w-9 h-9 shrink-0 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 flex items-center justify-center shadow-sm">
									<Image
										src="/assets/Logo.webp"
										alt="JGEC Alumni Logo"
										width={32}
										height={32}
										className="object-contain w-full h-full"
										priority
									/>
								</div>
								<div className="flex flex-col min-w-0">
									<div className="flex items-center gap-1.5">
										<span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 truncate">
											JGEC Alumni
										</span>
										<span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary dark:bg-primary/25 dark:text-blue-300 uppercase tracking-wider shrink-0">
											Admin
										</span>
									</div>
									<span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
										Govt. Engg. College
									</span>
								</div>
							</div>

							{!mobile ? (
								<button
									onClick={toggleCollapse}
									title="Collapse Sidebar"
									className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 ml-1"
								>
									<PanelLeftClose className="w-4 h-4" />
								</button>
							) : (
								<button
									onClick={() => setMobileOpen(false)}
									className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
								>
									<X className="w-5 h-5" />
								</button>
							)}
						</div>
					) : (
						// Collapsed Header: Perfectly Centered Logo without horizontal squeezing
						<div className="flex flex-col items-center justify-center py-2.5 px-2 gap-1.5">
							<button
								onClick={toggleCollapse}
								title="Click to expand sidebar"
								className="relative w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
							>
								<Image
									src="/assets/Logo.webp"
									alt="JGEC Alumni Logo"
									width={34}
									height={34}
									className="object-contain w-full h-full"
									priority
								/>
							</button>
							<button
								onClick={toggleCollapse}
								title="Expand Sidebar"
								className="p-1 rounded-md text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
							>
								<PanelLeft className="w-3.5 h-3.5" />
							</button>
						</div>
					)}
				</div>

				{/* 2. Middle Navigation List: Scrollable, Stretches Full Middle Height */}
				<div className="flex-1 min-h-0 overflow-y-auto px-2.5 py-3 space-y-4 no-scrollbar">

					{/* Core Group */}
					<div className="space-y-1">
						{showFull && (
							<div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
								Core Portal
							</div>
						)}
						{mainNavItems.map((item) => {
							const isAllowed = isPathAllowed(item.path);
							const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
							const Icon = item.icon;

							if (!isAllowed) {
								return (
									<div
										key={item.name}
										title={!showFull ? `${item.name} (Restricted)` : "Access Restricted (Requires Permission)"}
										onClick={() => toast.error(`Access restricted: You do not have permission to view ${item.name}.`)}
										className={`group flex items-center ${
											showFull ? "gap-3 px-2.5 py-2 justify-between" : "justify-center p-2"
										} rounded-xl text-xs sm:text-sm font-medium transition-all opacity-40 bg-slate-100/40 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none`}
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="p-1.5 rounded-lg shrink-0 bg-slate-200/50 dark:bg-slate-800/50 text-slate-400">
												<Icon className="w-4 h-4" />
											</div>
											{showFull && <span className="truncate">{item.name}</span>}
										</div>
										{showFull && <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400/80 ml-auto" />}
									</div>
								);
							}

							return (
								<Link
									key={item.name}
									href={item.path}
									onClick={() => mobile && setMobileOpen(false)}
									title={!showFull ? item.name : undefined}
									className={`group flex items-center ${showFull ? "gap-3 px-2.5 py-2" : "justify-center p-2"
										} rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${isActive
											? item.activeColor
											: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
										}`}
								>
									<div className={`p-1.5 rounded-lg shrink-0 transition-transform duration-200 ${item.bgColor} ${item.color} ${isActive ? "scale-105 shadow-sm" : "group-hover:scale-105"}`}>
										<Icon className="w-4 h-4" />
									</div>
									{showFull && <span className="truncate">{item.name}</span>}
								</Link>
							);
						})}
					</div>

					{/* Media Group */}
					<div className="space-y-1">
						{showFull ? (
							<div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
								Media & Publications
							</div>
						) : (
							<div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-1" />
						)}
						{mediaNavItems.map((item) => {
							const isAllowed = isPathAllowed(item.path);
							const isActive = pathname.startsWith(item.path);
							const Icon = item.icon;

							if (!isAllowed) {
								return (
									<div
										key={item.name}
										title={!showFull ? `${item.name} (Restricted)` : "Access Restricted (Requires Permission)"}
										onClick={() => toast.error(`Access restricted: You do not have permission to view ${item.name}.`)}
										className={`group flex items-center ${
											showFull ? "gap-3 px-2.5 py-2 justify-between" : "justify-center p-2"
										} rounded-xl text-xs sm:text-sm font-medium transition-all opacity-40 bg-slate-100/40 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none`}
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="p-1.5 rounded-lg shrink-0 bg-slate-200/50 dark:bg-slate-800/50 text-slate-400">
												<Icon className="w-4 h-4" />
											</div>
											{showFull && <span className="truncate">{item.name}</span>}
										</div>
										{showFull && <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400/80 ml-auto" />}
									</div>
								);
							}

							return (
								<Link
									key={item.name}
									href={item.path}
									onClick={() => mobile && setMobileOpen(false)}
									title={!showFull ? item.name : undefined}
									className={`group flex items-center ${showFull ? "gap-3 px-2.5 py-2" : "justify-center p-2"
										} rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${isActive
											? item.activeColor
											: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
										}`}
								>
									<div className={`p-1.5 rounded-lg shrink-0 transition-transform duration-200 ${item.bgColor} ${item.color} ${isActive ? "scale-105 shadow-sm" : "group-hover:scale-105"}`}>
										<Icon className="w-4 h-4" />
									</div>
									{showFull && <span className="truncate">{item.name}</span>}
								</Link>
							);
						})}
					</div>

					{/* Financials Group */}
					<div className="space-y-1">
						{showFull ? (
							<div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
								Financial Accounting
							</div>
						) : (
							<div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-1" />
						)}
						{financeNavItems.map((item) => {
							const isAllowed = isPathAllowed(item.path);
							const isActive = pathname.startsWith(item.path);
							const Icon = item.icon;

							if (!isAllowed) {
								return (
									<div
										key={item.name}
										title={!showFull ? `${item.name} (Restricted)` : "Access Restricted (Requires Permission)"}
										onClick={() => toast.error(`Access restricted: You do not have permission to view ${item.name}.`)}
										className={`group flex items-center ${
											showFull ? "gap-3 px-2.5 py-2 justify-between" : "justify-center p-2"
										} rounded-xl text-xs sm:text-sm font-medium transition-all opacity-40 bg-slate-100/40 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none`}
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="p-1.5 rounded-lg shrink-0 bg-slate-200/50 dark:bg-slate-800/50 text-slate-400">
												<Icon className="w-4 h-4" />
											</div>
											{showFull && <span className="truncate">{item.name}</span>}
										</div>
										{showFull && <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400/80 ml-auto" />}
									</div>
								);
							}

							return (
								<Link
									key={item.name}
									href={item.path}
									onClick={() => mobile && setMobileOpen(false)}
									title={!showFull ? item.name : undefined}
									className={`group flex items-center ${showFull ? "gap-3 px-2.5 py-2" : "justify-center p-2"
										} rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${isActive
											? item.activeColor
											: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
										}`}
								>
									<div className={`p-1.5 rounded-lg shrink-0 transition-transform duration-200 ${item.bgColor} ${item.color} ${isActive ? "scale-105 shadow-sm" : "group-hover:scale-105"}`}>
										<Icon className="w-4 h-4" />
									</div>
									{showFull && <span className="truncate">{item.name}</span>}
								</Link>
							);
						})}
					</div>

					{/* Documents Group */}
					<div className="space-y-1">
						{showFull ? (
							<div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
								Archive & Records
							</div>
						) : (
							<div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-1" />
						)}
						<div>
							<button
								onClick={() => {
									if (!showFull) {
										setIsCollapsed(false);
										setDocumentsOpen(true);
									} else {
										setDocumentsOpen(!documentsOpen);
									}
								}}
								title={!showFull ? "Official Documents" : undefined}
								className={`w-full group flex items-center ${showFull ? "justify-between px-2.5 py-2" : "justify-center p-2"
									} rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${pathname.startsWith("/documents")
										? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
										: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
									}`}
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="p-1.5 rounded-lg shrink-0 bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300">
										<Folder className="w-4 h-4" />
									</div>
									{showFull && <span className="truncate">Official Documents</span>}
								</div>
								{showFull && (
									<ChevronDown
										className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${documentsOpen ? "rotate-180" : ""
											}`}
									/>
								)}
							</button>

							{/* Document Submenu */}
							{documentsOpen && showFull && (
								<div className="ml-5 mt-1 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1 py-1">
									{documentSections.map((doc) => {
										const isDocActive = pathname === doc.path;
										const isDocAllowed = isPathAllowed(doc.path);

										if (!isDocAllowed) {
											return (
												<div
													key={doc.name}
													title="Access Restricted"
													onClick={() => toast.error(`Access restricted: You do not have permission to view ${doc.name}.`)}
													className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-xs opacity-40 text-slate-400 cursor-not-allowed select-none"
												>
													<div className="flex items-center gap-2 min-w-0">
														<div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
														<span className="truncate">{doc.name}</span>
													</div>
													<Lock className="w-3 h-3 text-slate-400 shrink-0" />
												</div>
											);
										}

										return (
											<Link
												key={doc.name}
												href={doc.path}
												onClick={() => mobile && setMobileOpen(false)}
												className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${isDocActive
														? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-semibold"
														: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
													}`}
											>
												<div className={`w-1.5 h-1.5 rounded-full ${isDocActive ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`} />
												<span className="truncate">{doc.name}</span>
											</Link>
										);
									})}
								</div>
							)}
						</div>
					</div>

					{/* System & Access Governance Group */}
					<div className="space-y-1">
						{showFull ? (
							<div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
								System & Access
							</div>
						) : (
							<div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-1" />
						)}
						{systemNavItems.map((item) => {
							const isAllowed = isPathAllowed(item.path);
							const isActive = pathname.startsWith(item.path);
							const Icon = item.icon;

							if (!isAllowed) {
								return (
									<div
										key={item.name}
										title={!showFull ? `${item.name} (Restricted)` : "Access Restricted (Requires Permission)"}
										onClick={() => toast.error(`Access restricted: You do not have permission to view ${item.name}.`)}
										className={`group flex items-center ${
											showFull ? "gap-3 px-2.5 py-2 justify-between" : "justify-center p-2"
										} rounded-xl text-xs sm:text-sm font-medium transition-all opacity-40 bg-slate-100/40 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none`}
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="p-1.5 rounded-lg shrink-0 bg-slate-200/50 dark:bg-slate-800/50 text-slate-400">
												<Icon className="w-4 h-4" />
											</div>
											{showFull && <span className="truncate">{item.name}</span>}
										</div>
										{showFull && <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400/80 ml-auto" />}
									</div>
								);
							}

							return (
								<Link
									key={item.name}
									href={item.path}
									onClick={() => mobile && setMobileOpen(false)}
									title={!showFull ? item.name : undefined}
									className={`group flex items-center ${
										showFull ? "gap-3 px-2.5 py-2" : "justify-center p-2"
									} rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
										isActive
											? item.activeColor
											: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
									}`}
								>
									<div
										className={`p-1.5 rounded-lg shrink-0 transition-transform duration-200 ${item.bgColor} ${item.color} ${
											isActive ? "scale-105 shadow-sm" : "group-hover:scale-105"
										}`}
									>
										<Icon className="w-4 h-4" />
									</div>
									{showFull && <span className="truncate">{item.name}</span>}
								</Link>
							);
						})}
					</div>

				</div>

				{/* 3. Footer: Permanently Pinned to Bottom (Zero Gap) */}
				<div className="shrink-0 mt-auto border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50/80 dark:bg-slate-900/80 p-3">
					<div className={`flex items-center ${showFull ? "justify-between gap-2" : "justify-center"}`}>
						{showFull && (
							<div className="flex items-center gap-2.5 min-w-0 pr-1">
								<div
									suppressHydrationWarning
									className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border ${
										isMounted && currentUser?.role === "SUPER_ADMIN"
											? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
											: "bg-primary/15 text-primary dark:bg-primary/25 dark:text-blue-300 border-primary/20"
									}`}
								>
									{isMounted && currentUser?.name
										? currentUser.name
												.trim()
												.split(" ")
												.map((n: string) => n[0])
												.join("")
												.toUpperCase()
												.slice(0, 2)
										: "AD"}
								</div>
								<div className="flex flex-col min-w-0" suppressHydrationWarning>
									<div className="flex items-center gap-1.5">
										<span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" suppressHydrationWarning>
											{isMounted && currentUser?.name ? currentUser.name : "Council Admin"}
										</span>
										{isMounted && currentUser?.role === "SUPER_ADMIN" && (
											<span className="text-[9px] font-bold px-1 py-0.2 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 uppercase tracking-tight shrink-0">
												SUPER
											</span>
										)}
									</div>
									<span className="text-[10px] text-slate-500 dark:text-slate-400 truncate" suppressHydrationWarning>
										{isMounted && currentUser?.email ? currentUser.email : "admin@jgecalumni.in"}
									</span>
								</div>
							</div>
						)}

						<button
							onClick={handleLogout}
							disabled={isLoading}
							title="Sign Out of Portal"
							className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors focus:outline-none shrink-0"
							aria-label="Sign Out"
						>
							{isLoading ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<LogOut className="w-4 h-4" />
							)}
						</button>
					</div>
				</div>

			</div>
		);
	};

	const currentSidebarWidth = isCollapsed ? COLLAPSED_WIDTH : sidebarWidth;

	const renderMainContent = () => {
		if (isMounted && currentUser && !isPathAllowed(pathname)) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-10">
					<div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center mb-3">
						<Lock className="w-7 h-7" />
					</div>
					<h2 className="text-xl font-bold text-slate-900 dark:text-white">
						Access Restricted
					</h2>
					<p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
						Your administrative credentials do not grant authorization for this path (<code className="font-mono text-red-500 font-semibold">{pathname}</code>). Please contact a Super Administrator to adjust your permissions.
					</p>
					<button
						onClick={() => {
							const fallback =
								currentUser.allowedPaths?.find((p) => p !== "*" && p !== pathname) || "/";
							window.location.href = fallback;
						}}
						className="mt-6 px-4 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm transition-colors"
					>
						Return to Permitted Section
					</button>
				</div>
			);
		}
		return children;
	};

	return (
		<div className="min-h-screen w-full bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

			{/* Desktop Truly Fixed Sidebar (position: fixed inset-y-0 left-0) */}
			<aside
				style={{ width: `${currentSidebarWidth}px` }}
				className="fixed inset-y-0 left-0 z-30 hidden md:flex flex-col shrink-0 border-r border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 transition-[width] duration-150 ease-out h-screen overflow-hidden"
			>
				{renderSidebarContent(false)}

				{/* Drag Resize Handle */}
				{!isCollapsed && (
					<div
						onMouseDown={startResizing}
						onDoubleClick={resetWidth}
						title="Drag to resize sidebar • Double-click to reset (260px)"
						className={`absolute -right-1.5 top-0 bottom-0 w-3 cursor-col-resize z-40 group flex items-center justify-center transition-colors ${isResizing ? "bg-primary/25" : "hover:bg-primary/10"
							}`}
					>
						<div
							className={`w-0.5 h-10 rounded-full transition-colors ${isResizing ? "bg-primary" : "bg-slate-300 dark:bg-slate-700 group-hover:bg-primary"
								}`}
						/>
					</div>
				)}
			</aside>

			{/* Mobile Drawer */}
			{mobileOpen && (
				<div className="fixed inset-0 z-50 md:hidden flex">
					<div
						onClick={() => setMobileOpen(false)}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
					/>
					<div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
						{renderSidebarContent(true)}
					</div>
				</div>
			)}

			{/* Main Content Area: Offset by exactly the fixed sidebar width on desktop */}
			<div
				style={{ marginLeft: `${currentSidebarWidth}px` }}
				className="hidden md:flex flex-col min-h-screen transition-[margin-left] duration-150 ease-out"
			>
				{/* Top Command Bar */}
				<header className="sticky top-0 z-20 flex h-14 sm:h-16 items-center justify-between border-b border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md transition-colors shrink-0">

					{/* Left: Section Title & Breadcrumb */}
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
								Console
							</span>
							<span className="text-xs text-slate-300 dark:text-slate-600">/</span>
							<h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
								{getPageTitle()}
							</h1>
						</div>
					</div>

					{/* Right: Sync Status, Public Site Link, Theme Switcher */}
					<div className="flex items-center gap-3 sm:gap-4">
						<div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
							</span>
							<span>Online</span>
						</div>

						<a
							href="https://jgecalumni.in"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 shadow-sm"
						>
							<span>Public Website</span>
							<ExternalLink className="w-3.5 h-3.5 text-slate-400" />
						</a>

						<ThemeToggle />
					</div>
				</header>

				{/* Page Content Viewport */}
				<main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
					{renderMainContent()}
				</main>

				{/* Institutional Footer */}
				<footer className="border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-4 text-center sm:text-left text-xs text-slate-500 dark:text-slate-400 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
					<p suppressHydrationWarning>
						© {new Date().getFullYear()} Jalpaiguri Government Engineering College Alumni Association. All rights reserved.
					</p>
					<p className="text-[11px] text-slate-400">
						Restricted Admin Console • Estd. 1961
					</p>
				</footer>
			</div>

			{/* Mobile Viewport Layout (< 768px) */}
			<div className="md:hidden flex flex-col min-h-screen w-full">
				<header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 px-4 backdrop-blur-md shrink-0">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setMobileOpen(true)}
							className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
							aria-label="Open navigation menu"
						>
							<Menu className="w-5 h-5" />
						</button>
						<h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
							{getPageTitle()}
						</h1>
					</div>
					<ThemeToggle />
				</header>

				<main className="flex-1 p-4 w-full">
					{renderMainContent()}
				</main>

				<footer className="border-t border-slate-200/80 dark:border-slate-800/80 p-4 text-center text-xs text-slate-500 shrink-0">
					<p suppressHydrationWarning>© {new Date().getFullYear()} JGEC Alumni Association</p>
				</footer>
			</div>
		</div>
	);
}
