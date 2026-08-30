"use client";

import Image from "next/image";
// Lucide icons imported below

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLogoutMutation } from "@/store/baseApi";
import React, { useEffect } from "react";
import { clearAuthCookies } from "@/app/actions";
import toast from "react-hot-toast";
import { ChevronRight, Loader2, Newspaper, LayoutDashboard, BellRing, GraduationCap, CalendarDays, Images, Users, Receipt, CreditCard, Folder, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const router = useRouter();
	const [logout, { isLoading }] = useLogoutMutation();

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
			// Guarantee cookie deletion via Next.js Server Action
			await clearAuthCookies();
			window.location.href = "/login";
		}
	};

	// Navigation items
	const navItems = [
		{ name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
		{ name: "Notice", path: "/notice", icon: <BellRing size={18} />, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
		{ name: "Scholarship", path: "/scholarship", icon: <GraduationCap size={18} />, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
		{ name: "Events", path: "/events", icon: <CalendarDays size={18} />, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
		{ name: "Gallery", path: "/gallery", icon: <Images size={18} />, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/30" },
		{ name: "Members", path: "/members", icon: <Users size={18} />, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
		{ name: "Receipt", path: "/receipt", icon: <Receipt size={18} />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
		{ name: "Payments", path: "/payments", icon: <CreditCard size={18} />, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/30" },
		{ name: "Media & Press Release", path: "/media&press-release", icon: <Newspaper size={18} />, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
	];
	const documentSections = [
		{ name: "Scholarships", path: "/documents/scholarship" },
		{ name: "Kanchenjunga", path: "/documents/kanchenjunga" },
		{ name: "Giving-Back", path: "/documents/giving-back" },
		{ name: "Audit-Report", path: "/documents/audit-report" },
		{ name: "AGM-MOM", path: "/documents/agm-mom" },
	];

	return (
		<SidebarProvider>
			<Sidebar collapsible="icon" className="border-r border-border/40 bg-background/60 backdrop-blur-xl shadow-sm">
				<SidebarContent>
					<SidebarGroup className="group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:group-hover:p-2 transition-all duration-300">
						<SidebarGroupLabel className="my-6 h-auto py-2 group-data-[collapsible=icon]:!mt-6 group-data-[collapsible=icon]:!opacity-100 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:group-hover:px-2 transition-all duration-300">
							<div className="flex gap-4 items-center group cursor-pointer w-full overflow-hidden whitespace-nowrap">
								<div className="relative overflow-hidden rounded-xl shadow-sm ring-1 ring-border/50 group-hover:ring-primary/50 transition-all duration-500 shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:group-hover:w-12 group-data-[collapsible=icon]:group-hover:h-12 flex items-center justify-center">
									<Image
										src="/assets/Logo.webp"
										height={60}
										width={60}
										alt="Jgec Alumni Logo"
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
									/>
								</div>
								<div className="flex flex-col truncate group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 transition-opacity duration-300">
									<span className="text-lg font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
										JGEC Alumni
									</span>
									<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Admin Portal</span>
								</div>
							</div>
						</SidebarGroupLabel>
						<SidebarGroupContent className="px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:group-hover:px-3 transition-all duration-300">
							<ScrollArea type="hover" className="h-[calc(100vh-120px)] w-full">
								<SidebarMenu className="space-y-1.5 mt-2">
									{navItems.map((item) => {
										const isActive = pathname === item.path;
										return (
											<SidebarMenuItem key={item.name}>
												<SidebarMenuButton asChild className="h-auto">
													<Link
														href={item.path}
														className={`flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-xl px-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:group-hover:px-3 group-data-[collapsible=icon]:group-hover:py-2.5 py-2.5 transition-all duration-300 group hover:translate-x-1 ${isActive
															? `${item.bg} ${item.color} shadow-sm font-semibold`
															: "text-muted-foreground hover:bg-muted/80 hover:text-foreground font-medium"
															}`}>
														<span className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-lg transition-all duration-300 ${isActive ? "bg-background/60 shadow-sm scale-110" : `${item.bg} ${item.color} group-hover:scale-110 shadow-sm`}`}>
															{item.icon}
														</span>
														<span className="flex-1 truncate group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 transition-opacity duration-300">
															{item.name}
														</span>
														{isActive && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-4 shrink-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 transition-opacity duration-300" />}
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}

									{/* Documents Dropdown */}
									<SidebarMenuItem className="mt-2 pb-4">
										<DropdownMenu>
											<DropdownMenuTrigger className={`flex w-full items-center gap-3 overflow-hidden whitespace-nowrap rounded-xl px-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:group-hover:px-3 group-data-[collapsible=icon]:group-hover:py-2.5 py-2.5 transition-all duration-300 group focus:outline-none hover:translate-x-1 ${pathname.includes('/documents') ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground font-medium"}`}>
												<span className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-lg transition-all duration-300 ${pathname.includes('/documents') ? "bg-background/60 shadow-sm scale-110" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 shadow-sm"}`}>
													<Folder size={18} />
												</span>
												<span className="flex-1 text-left truncate group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 transition-opacity duration-300">
													Documents
												</span>
												<ChevronRight size={16} className={`shrink-0 transition-all duration-300 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 ${pathname.includes('/documents') ? 'text-indigo-600 dark:text-indigo-400 rotate-90' : 'text-muted-foreground group-hover:text-foreground'}`} />
											</DropdownMenuTrigger>
											<DropdownMenuContent className="w-56 p-2 border border-border/50 shadow-xl rounded-2xl bg-background/95 backdrop-blur-xl" align="start" sideOffset={8}>
												{documentSections.map((doc) => {
													const isDocActive = pathname === doc.path;
													return (
														<DropdownMenuItem
															key={doc.name}
															asChild
															className={`rounded-xl cursor-pointer mb-1 last:mb-0 transition-all duration-200 ${isDocActive ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium" : "text-muted-foreground focus:bg-muted focus:text-foreground"}`}
														>
															<Link
																href={doc.path}
																className="flex items-center gap-2 px-3 py-2">
																<ChevronRight size={14} className={`transition-transform duration-300 ${isDocActive ? "text-indigo-600 dark:text-indigo-400 translate-x-1" : "text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
																<span className={isDocActive ? "translate-x-1 transition-transform" : ""}>{doc.name}</span>
															</Link>
														</DropdownMenuItem>
													);
												})}
											</DropdownMenuContent>
										</DropdownMenu>
									</SidebarMenuItem>
								</SidebarMenu>
							</ScrollArea>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>

			<div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 dark:bg-[#0a0a0a] text-foreground relative overflow-hidden">
				{/* Decorative background blobs */}
				<div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/4 pointer-events-none" />
				<div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

				{/* Top Navigation */}
				<div className="p-4 lg:p-6 pb-0 sticky top-0 z-30">
					<header className="flex h-16 w-full items-center justify-between rounded-2xl border border-border/40 bg-background/60 px-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-background/80 hover:shadow-md lg:px-6">
						<div className="flex items-center gap-4">
							<SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10 p-2 rounded-xl" />
							<div className="hidden lg:flex items-center gap-3">
								<div className="h-5 w-px bg-border/60"></div>
								<div className="text-sm font-medium text-muted-foreground">Admin Portal</div>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="hidden sm:block">
								<ThemeToggle />
							</div>
							<div className="h-5 w-px bg-border/60 hidden sm:block"></div>
							<button
								className="flex items-center justify-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-2 text-sm font-semibold text-destructive shadow-sm transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-destructive/30 disabled:opacity-50 group hover:shadow-lg hover:shadow-destructive/20 hover:-translate-y-0.5 active:translate-y-0"
								onClick={handleLogout}
								disabled={isLoading}>
								<span>Sign Out</span>
								{!isLoading ? (
									<LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
								) : (
									<Loader2
										className="animate-spin"
										size={16}
									/>
								)}
							</button>
						</div>
					</header>
				</div>

				{/* Main Content Area */}
				<main className="flex-1 p-4 lg:p-6 flex flex-col z-10">
					<div className="mx-auto w-full max-w-7xl flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
						{children}
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
