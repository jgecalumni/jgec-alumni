"use client";

import Image from "next/image";
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
	useSidebar,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLogoutMutation } from "@/store/baseApi";
import React, { useEffect, useRef, useState } from "react";
import { clearAuthCookies } from "@/app/actions";
import toast from "react-hot-toast";
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, Newspaper, LayoutDashboard, BellRing, GraduationCap, CalendarDays, Images, Users, Receipt, CreditCard, Folder, LogOut, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function MobileSidebarCloseButton() {
	const { setOpenMobile, isMobile } = useSidebar();
	if (!isMobile) return null;
	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				setOpenMobile(false);
			}}
			className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors hover:bg-white/50 dark:hover:bg-white/10 rounded-xl"
			aria-label="Close Sidebar"
		>
			<X size={20} />
		</button>
	);
}

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
		{ name: "Dashboard", path: "/", icon: <LayoutDashboard size={16} />, gradient: "from-blue-500 to-cyan-500" },
		{ name: "Notice", path: "/notice", icon: <BellRing size={16} />, gradient: "from-orange-500 to-amber-500" },
		{ name: "Scholarship", path: "/scholarship", icon: <GraduationCap size={16} />, gradient: "from-green-500 to-emerald-500" },
		{ name: "Events", path: "/events", icon: <CalendarDays size={16} />, gradient: "from-purple-500 to-fuchsia-500" },
		{ name: "Gallery", path: "/gallery", icon: <Images size={16} />, gradient: "from-pink-500 to-rose-500" },
		{ name: "Members", path: "/members", icon: <Users size={16} />, gradient: "from-cyan-500 to-sky-500" },
		{ name: "Receipt", path: "/receipt", icon: <Receipt size={16} />, gradient: "from-emerald-500 to-teal-500" },
		{ name: "Payments", path: "/payments", icon: <CreditCard size={16} />, gradient: "from-rose-500 to-red-500" },
		{ name: "Media & Press Release", path: "/media&press-release", icon: <Newspaper size={16} />, gradient: "from-indigo-500 to-violet-500" },
	];
	const documentSections = [
		{ name: "Scholarships", path: "/documents/scholarship" },
		{ name: "Kanchenjunga", path: "/documents/kanchenjunga" },
		{ name: "Giving-Back", path: "/documents/giving-back" },
		{ name: "Audit-Report", path: "/documents/audit-report" },
		{ name: "AGM-MOM", path: "/documents/agm-mom" },
	];

	// Desktop Navbar Scroll Logic
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const checkScroll = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			// Use a small threshold (e.g. 1px) to account for fractional pixel rounding errors
			setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
		}
	};

	useEffect(() => {
		checkScroll();
		window.addEventListener("resize", checkScroll);
		return () => window.removeEventListener("resize", checkScroll);
	}, []);

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -250, behavior: "smooth" });
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 250, behavior: "smooth" });
		}
	};

	return (
		<SidebarProvider>
			{/* Mobile Sidebar (Hidden on medium/large screens) */}
			<div className="md:hidden">
				<Sidebar collapsible="icon" className="border-r border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-[8px_0_30px_-15px_rgba(0,0,0,0.1)]">
					<SidebarContent>
						<SidebarGroup className="group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:group-hover:p-2 transition-all duration-300">
							<SidebarGroupLabel className="my-6 h-auto py-2 group-data-[collapsible=icon]:!mt-6 group-data-[collapsible=icon]:!opacity-100 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:group-hover:px-2 transition-all duration-300">
								<div className="flex items-center justify-between group w-full overflow-hidden whitespace-nowrap">
									<div className="flex gap-4 items-center cursor-pointer">
										<div className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/30 dark:ring-white/10 transition-all duration-500 shrink-0 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:group-hover:w-12 group-data-[collapsible=icon]:group-hover:h-12 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-md">
											<Image
												src="/assets/Logo.webp"
												height={60}
												width={60}
												alt="Jgec Alumni Logo"
												className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 drop-shadow-md"
											/>
										</div>
										<div className="flex flex-col truncate group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 transition-opacity duration-300">
											<span className="text-xl font-black tracking-tight bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent truncate drop-shadow-sm">
												JGEC Alumni
											</span>
											<span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Admin Portal</span>
										</div>
									</div>
									<MobileSidebarCloseButton />
								</div>
							</SidebarGroupLabel>
							<SidebarGroupContent className="px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:group-hover:px-3 transition-all duration-300">
								<ScrollArea type="hover" className="h-[calc(100vh-120px)] w-full pb-4">
									<SidebarMenu className="space-y-2 mt-2">
										{navItems.map((item) => {
											const isActive = pathname === item.path;
											return (
												<SidebarMenuItem key={item.name}>
													<SidebarMenuButton asChild className="h-auto">
														<Link
															href={item.path}
															className={`flex items-center gap-3.5 overflow-hidden whitespace-nowrap rounded-2xl px-3 py-3 transition-all duration-300 group hover:translate-x-1 ${isActive
																? "bg-white/60 dark:bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.04)] backdrop-blur-md ring-1 ring-white/40 dark:ring-white/10"
																: "hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-sm"
																}`}>
															<span className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-xl transition-all duration-500 shadow-sm bg-gradient-to-br ${item.gradient} text-white ${isActive ? `scale-110 shadow-lg shadow-${item.gradient.split('-')[1]}-500/30` : "group-hover:scale-110 group-hover:shadow-md"}`}>
																{item.icon}
															</span>
															<span className={`flex-1 truncate font-medium transition-all duration-300 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
																{item.name}
															</span>
															{isActive && <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.gradient} mr-2 shrink-0 shadow-sm`} />}
														</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											);
										})}

										{/* Mobile Documents Dropdown */}
										<SidebarMenuItem className="mt-2 pb-6">
											<DropdownMenu>
												<DropdownMenuTrigger className={`flex w-full items-center gap-3.5 overflow-hidden whitespace-nowrap rounded-2xl px-3 py-3 transition-all duration-300 group focus:outline-none hover:translate-x-1 ${pathname.includes('/documents') ? "bg-white/60 dark:bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md ring-1 ring-white/40 dark:ring-white/10" : "hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-sm"}`}>
													<span className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-xl transition-all duration-500 shadow-sm bg-gradient-to-br from-indigo-500 to-violet-500 text-white ${pathname.includes('/documents') ? "scale-110 shadow-lg shadow-indigo-500/30" : "group-hover:scale-110 group-hover:shadow-md"}`}>
														<Folder size={18} />
													</span>
													<span className={`flex-1 text-left truncate font-medium transition-all duration-300 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 ${pathname.includes('/documents') ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
														Documents
													</span>
													<ChevronRight size={16} className={`shrink-0 transition-all duration-300 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:group-hover:opacity-100 ${pathname.includes('/documents') ? 'text-indigo-500 rotate-90' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-56 p-2 border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl bg-white/70 dark:bg-black/70 backdrop-blur-xl" align="start" sideOffset={12}>
													{documentSections.map((doc) => {
														const isDocActive = pathname === doc.path;
														return (
															<DropdownMenuItem
																key={doc.name}
																asChild
																className={`rounded-xl cursor-pointer mb-1 last:mb-0 transition-all duration-200 ${isDocActive ? "bg-white/80 dark:bg-white/10 shadow-sm" : "hover:bg-white/50 dark:hover:bg-white/5"}`}
															>
																<Link
																	href={doc.path}
																	className="flex items-center gap-3 px-3 py-2.5">
																	<div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isDocActive ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "bg-slate-300 dark:bg-slate-600"}`} />
																	<span className={`font-medium ${isDocActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`}>{doc.name}</span>
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
			</div>

			<div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 dark:bg-[#0a0a0a] text-foreground relative overflow-hidden w-full">
				{/* Decorative background blobs */}
				<div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/4 pointer-events-none" />
				<div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

				{/* Mobile Header (Hidden on medium/large screens) */}
				<div className="p-4 pb-0 sticky top-0 z-30 md:hidden">
					<header className="flex h-16 w-full items-center justify-between rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-300">
						<div className="flex items-center gap-4">
							<SidebarTrigger className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors hover:bg-white/50 dark:hover:bg-white/10 p-2 rounded-xl" />
						</div>

						<div className="flex items-center gap-3">
							<ThemeToggle />
							<button
								className="flex items-center justify-center gap-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 p-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:text-red-400 focus:outline-none backdrop-blur-md"
								onClick={handleLogout}
								disabled={isLoading}>
								{!isLoading ? (
									<LogOut className="w-5 h-5" />
								) : (
									<Loader2 className="animate-spin w-5 h-5" />
								)}
							</button>
						</div>
					</header>
				</div>

				{/* Desktop Top Navbar (Hidden on small screens) */}
				<div className="hidden md:block sticky top-0 z-40 w-full border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
					<div className="flex h-16 items-center px-6">
						<div className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-800 shrink-0">
							<div className="flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-xl p-1 shadow-sm border border-white/40 dark:border-white/10">
								<Image
									src="/assets/Logo.webp"
									height={32}
									width={32}
									alt="Jgec Alumni Logo"
									className="object-cover drop-shadow-sm transition-transform duration-500 hover:scale-110"
								/>
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-black tracking-tight bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm leading-tight">
									JGEC Alumni
								</span>
								<span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Admin Portal</span>
							</div>
						</div>

						{/* Navigation Items with Scroll Buttons */}
						<div className="flex-1 flex items-center overflow-hidden ml-4 relative group/nav">
							{canScrollLeft && (
								<div className="absolute left-0 top-0 bottom-0 flex items-center bg-gradient-to-r from-white/90 via-white/80 to-transparent dark:from-black/90 dark:via-black/80 dark:to-transparent z-10 pr-6 pl-1 animate-in fade-in duration-300">
									<button 
										onClick={scrollLeft}
										className="p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-all focus:outline-none"
									>
										<ChevronLeft size={16} />
									</button>
								</div>
							)}
							
							<div 
								ref={scrollContainerRef}
								onScroll={checkScroll}
								className="flex w-full space-x-2 p-1 overflow-x-auto no-scrollbar scroll-smooth"
								style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
							>
								{navItems.map((item) => {
									const isActive = pathname === item.path;
									return (
										<Link
											key={item.name}
											href={item.path}
											className={`shrink-0 group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
												isActive
													? "bg-white/80 dark:bg-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-white"
													: "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
											}`}
										>
											<span className={`flex items-center justify-center shrink-0 w-6 h-6 rounded-lg transition-all duration-500 bg-gradient-to-br ${item.gradient} text-white shadow-sm ${isActive ? "scale-110 shadow-md" : "group-hover:scale-110"}`}>
												{item.icon}
											</span>
											<span>{item.name}</span>
										</Link>
									);
								})}

								{/* Documents Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger className={`shrink-0 group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 focus:outline-none ${
										pathname.includes('/documents')
											? "bg-white/80 dark:bg-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-white"
											: "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
									}`}>
										<span className={`flex items-center justify-center shrink-0 w-6 h-6 rounded-lg transition-all duration-500 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm ${pathname.includes('/documents') ? "scale-110 shadow-md" : "group-hover:scale-110"}`}>
											<Folder size={16} />
										</span>
										<span>Documents</span>
										<ChevronDown size={14} className={`ml-1 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180 ${pathname.includes('/documents') ? 'text-indigo-500' : ''}`} />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56 p-2 border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl bg-white/70 dark:bg-black/70 backdrop-blur-xl" sideOffset={8}>
										{documentSections.map((doc) => {
											const isDocActive = pathname === doc.path;
											return (
												<DropdownMenuItem
													key={doc.name}
													asChild
													className={`rounded-xl cursor-pointer mb-1 last:mb-0 transition-all duration-200 ${isDocActive ? "bg-white/80 dark:bg-white/10 shadow-sm" : "hover:bg-white/50 dark:hover:bg-white/5"}`}
												>
													<Link href={doc.path} className="flex items-center gap-3 px-3 py-2.5">
														<div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isDocActive ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "bg-slate-300 dark:bg-slate-600"}`} />
														<span className={`font-medium ${isDocActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`}>{doc.name}</span>
													</Link>
												</DropdownMenuItem>
											);
										})}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							{canScrollRight && (
								<div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-white/90 via-white/80 to-transparent dark:from-black/90 dark:via-black/80 dark:to-transparent z-10 pl-6 pr-1 animate-in fade-in duration-300">
									<button 
										onClick={scrollRight}
										className="p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-all focus:outline-none"
									>
										<ChevronRight size={16} />
									</button>
								</div>
							)}
						</div>

						<div className="flex items-center gap-3 ml-4 shrink-0 border-l border-slate-200 dark:border-slate-800 pl-4">
							<ThemeToggle />
							<button
								className="flex items-center justify-center gap-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30 focus:outline-none disabled:opacity-50 group hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md"
								onClick={handleLogout}
								disabled={isLoading}
								title="Sign Out"
							>
								<span>Sign Out</span>
								{!isLoading ? (
									<LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
								) : (
									<Loader2 className="w-4 h-4 animate-spin" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Main Content Area */}
				<main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col z-10 w-full">
					<div className="mx-auto w-full max-w-7xl flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
						{children}
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
