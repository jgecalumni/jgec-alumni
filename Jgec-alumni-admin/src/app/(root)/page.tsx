"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import {
	Users,
	GraduationCap,
	FileText,
	CalendarDays,
	CreditCard,
	Bell,
	ArrowUpRight,
	Plus,
	Building2,
	ChevronRight,
	Loader2,
	Clock,
	MapPin,
	ShieldCheck,
	Sparkles,
	ExternalLink,
	Award,
	CheckCircle2,
} from "lucide-react";

import { useGetCountQuery } from "@/store/feature/dashboard-feature";
import { useGetAllMembersQuery } from "@/store/feature/member-feature";
import { useGetAllNoticesQuery } from "@/store/feature/notice-feature";
import { useAllEventsQuery } from "@/store/feature/event-feature";
import { useAllScholarshipsQuery } from "@/store/feature/scholarship-feature";
import DashboardChart from "@/components/Dashboard/DashboardChart";
import Loading from "../loading";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Home() {
	const { data, error, isLoading, isError } = useGetCountQuery();
	const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

	const { data: membersData, isLoading: membersLoading } = useGetAllMembersQuery({ limit: 5, page: 1 });
	const { data: noticesData, isLoading: noticesLoading } = useGetAllNoticesQuery({ limit: 5, page: 1 });
	const { data: eventsData, isLoading: eventsLoading } = useAllEventsQuery({ limit: 5, page: 1 });
	const { data: scholarshipsData, isLoading: scholarshipsLoading } = useAllScholarshipsQuery({ limit: 5, page: 1 });

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to sync dashboard metrics");
		}
	}, [isError, error]);

	if (isLoading) return <Loading />;

	const counts = data?.data;

	const statCards = [
		{
			title: "Registered Alumni",
			value: counts?.members || 0,
			label: "Alumni Directory",
			description: "Graduates & faculty members",
			href: "/members",
			icon: Users,
			badge: "Members",
			accent: "text-blue-600 dark:text-blue-400",
			bgAccent: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
		},
		{
			title: "Endowed Scholarships",
			value: counts?.scholarships || 0,
			label: "Active Grants",
			description: "Batch & alumni sponsored funds",
			href: "/scholarship",
			icon: GraduationCap,
			badge: "Scholarships",
			accent: "text-emerald-600 dark:text-emerald-400",
			bgAccent: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
		},
		{
			title: "Grant Applications",
			value: counts?.scholarshipApplications || 0,
			label: "Submissions",
			description: "Student requests under review",
			href: "/scholarship/applications",
			icon: FileText,
			badge: "Applications",
			accent: "text-indigo-600 dark:text-indigo-400",
			bgAccent: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40",
		},
		{
			title: "Active Notices",
			value: counts?.notices || 0,
			label: "Announcements",
			description: "Published notices on web",
			href: "/notice",
			icon: Bell,
			badge: "Notices",
			accent: "text-amber-600 dark:text-amber-400",
			bgAccent: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
		},
		{
			title: "Upcoming Events",
			value: counts?.events || 0,
			label: "Reunions",
			description: "Campus meets & webinars",
			href: "/events",
			icon: CalendarDays,
			badge: "Scheduled",
			accent: "text-purple-600 dark:text-purple-400",
			bgAccent: "bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40",
		},
		{
			title: "Payment Records",
			value: (counts as any)?.payments ?? "Audited",
			label: "Transactions",
			description: "Alumni contributions & fees",
			href: "/payments",
			icon: CreditCard,
			badge: "Ledgers",
			accent: "text-teal-600 dark:text-teal-400",
			bgAccent: "bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/40",
		},
	];

	return (
		<div className="w-full space-y-8 animate-in fade-in duration-300">

			{/* Operational Header with Real Utility Actions */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
				<div>
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
						<Building2 className="w-3.5 h-3.5" />
						<span>JGEC Alumni Association Management Console</span>
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
						Executive Overview
					</h1>
					<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
						Real-time administrative metrics, verified member submissions, and institutional operations.
					</p>
				</div>

				{/* Primary Operational Action Buttons */}
				<div className="flex items-center gap-2.5 shrink-0 flex-wrap">
					<Link
						href="/notice"
						className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
					>
						<Plus className="w-4 h-4 text-slate-500" />
						<span>Publish Notice</span>
					</Link>
					<Link
						href="/events"
						className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors shadow-sm"
					>
						<Plus className="w-4 h-4" />
						<span>Schedule Event</span>
					</Link>
				</div>
			</div>

			{/* High-Density Structured KPI Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
				{statCards.map((stat) => {
					const Icon = stat.icon;
					return (
						<Link
							key={stat.title}
							href={stat.href}
							className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<div>
								<div className="flex items-center justify-between gap-2 mb-3">
									<div className={`p-2 rounded-xl border ${stat.bgAccent} ${stat.accent}`}>
										<Icon className="w-4 h-4" />
									</div>
									<span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
										{stat.badge}
									</span>
								</div>

								<div className="space-y-0.5">
									<span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
										{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
									</span>
									<h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
										{stat.title}
									</h2>
								</div>
							</div>

							<div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-primary transition-colors">
								<span>Manage</span>
								<ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</div>
						</Link>
					);
				})}
			</div>

			{/* Analytics & Volume Charts */}
			<div className="w-full">
				<DashboardChart counts={counts} />
			</div>

			{/* Operational Activity Grids (2x2 Balanced Layout) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

				{/* Feed 1: Recent Member Registrations */}
				<div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
					<div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
								<Users className="w-4 h-4" />
							</div>
							<div>
								<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
									Recent Member Registrations
								</h3>
								<p className="text-[11px] text-slate-500 dark:text-slate-400">
									Latest graduates joining the registry
								</p>
							</div>
						</div>
						<Link
							href="/members"
							className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
						>
							<span>Directory</span>
							<ChevronRight className="w-3.5 h-3.5" />
						</Link>
					</div>

					<div className="p-0 flex-1">
						{membersLoading ? (
							<div className="flex items-center justify-center p-10 text-slate-400 text-xs">
								<Loader2 className="w-5 h-5 animate-spin mr-2" />
								<span>Loading member records...</span>
							</div>
						) : membersData?.members?.length > 0 ? (
							<div className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{membersData.members.slice(0, 5).map((member: any) => (
									<div
										key={member.id || member._id || member.email}
										className="p-4 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
									>
										<div className="flex items-center gap-3 min-w-0 pr-3">
											<div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
												{member?.name ? member.name.charAt(0).toUpperCase() : "U"}
											</div>
											<div className="min-w-0">
												<p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
													{member.name || "Alumnus"}
												</p>
												<p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
													{member.email}
												</p>
											</div>
										</div>
										<div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md shrink-0 border border-slate-200 dark:border-slate-700">
											{member.passingYear ? `Batch '${String(member.passingYear).slice(-2)}` : "Verified"}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="p-8 text-center text-xs text-slate-400">
								No new members registered this week
							</div>
						)}
					</div>
				</div>

				{/* Feed 2: Upcoming College Events & Reunions */}
				<div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
					<div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
								<CalendarDays className="w-4 h-4" />
							</div>
							<div>
								<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
									Upcoming Events & Reunions
								</h3>
								<p className="text-[11px] text-slate-500 dark:text-slate-400">
									Campus meets, webinars & AGM calendar
								</p>
							</div>
						</div>
						<Link
							href="/events"
							className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
						>
							<span>Schedule</span>
							<ChevronRight className="w-3.5 h-3.5" />
						</Link>
					</div>

					<div className="p-0 flex-1">
						{eventsLoading ? (
							<div className="flex items-center justify-center p-10 text-slate-400 text-xs">
								<Loader2 className="w-5 h-5 animate-spin mr-2" />
								<span>Loading event schedule...</span>
							</div>
						) : eventsData?.events?.length > 0 ? (
							<div className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{eventsData.events.slice(0, 5).map((event: any) => {
									const dateObj = new Date(event.date || event.createdAt || Date.now());
									const monthStr = dateObj.toLocaleDateString("en-US", { month: "short" });
									const dayStr = dateObj.getDate();

									return (
										<div
											key={event.id || event._id || event.name || event.title}
											className="p-4 flex items-center gap-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
										>
											<div className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 rounded-xl w-11 h-11 shrink-0">
												<span className="text-[9px] font-bold uppercase tracking-wider">{monthStr}</span>
												<span className="text-base font-extrabold leading-none">{dayStr}</span>
											</div>
											<div className="flex-1 min-w-0 pr-2">
												<p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
													{event.name || event.title}
												</p>
												<div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
													<MapPin className="w-3 h-3 text-slate-400 shrink-0" />
													<span className="truncate">{event.location || "JGEC Campus / Online"}</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="p-8 text-center text-xs text-slate-400">
								No upcoming events scheduled
							</div>
						)}
					</div>
				</div>

				{/* Feed 3: Official Notices & Circulars */}
				<div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
					<div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
								<Bell className="w-4 h-4" />
							</div>
							<div>
								<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
									Recent Notices & Circulars
								</h3>
								<p className="text-[11px] text-slate-500 dark:text-slate-400">
									Official administrative announcements
								</p>
							</div>
						</div>
						<Link
							href="/notice"
							className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
						>
							<span>Notice Board</span>
							<ChevronRight className="w-3.5 h-3.5" />
						</Link>
					</div>

					<div className="p-0 flex-1">
						{noticesLoading ? (
							<div className="flex items-center justify-center p-10 text-slate-400 text-xs">
								<Loader2 className="w-5 h-5 animate-spin mr-2" />
								<span>Loading notice board...</span>
							</div>
						) : (noticesData?.notices?.length ?? 0) > 0 ? (
							<div className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{noticesData?.notices?.slice(0, 5).map((notice: any, idx: number) => {
									const noticeId = notice.id || notice._id || idx.toString();
									const isExpanded = expandedNoticeId === noticeId;

									return (
										<div
											key={noticeId}
											onClick={() => setExpandedNoticeId(isExpanded ? null : noticeId)}
											className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
										>
											<div className="flex items-start justify-between gap-3 mb-1">
												<p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-1">
													{notice.title}
												</p>
												<span className="text-[10px] font-medium text-slate-400 shrink-0">
													{new Date(notice.date || notice.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
												</span>
											</div>

											<div
												className={`text-xs text-slate-500 dark:text-slate-400 overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-[800px] mt-2 pt-2 border-t border-slate-100 dark:border-slate-800" : "max-h-6 line-clamp-1"
													}`}
											>
												<ReactQuill value={notice.description} readOnly={true} theme="bubble" />
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="p-8 text-center text-xs text-slate-400">
								No published notices at this moment
							</div>
						)}
					</div>
				</div>

				{/* Feed 4: Active Scholarships & Endowments */}
				<div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
					<div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
						<div className="flex items-center gap-2.5">
							<div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
								<GraduationCap className="w-4 h-4" />
							</div>
							<div>
								<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
									Active Scholarships & Grants
								</h3>
								<p className="text-[11px] text-slate-500 dark:text-slate-400">
									Sponsored funds for meritorious students
								</p>
							</div>
						</div>
						<Link
							href="/scholarship"
							className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
						>
							<span>Programs</span>
							<ChevronRight className="w-3.5 h-3.5" />
						</Link>
					</div>

					<div className="p-0 flex-1">
						{scholarshipsLoading ? (
							<div className="flex items-center justify-center p-10 text-slate-400 text-xs">
								<Loader2 className="w-5 h-5 animate-spin mr-2" />
								<span>Loading scholarship programs...</span>
							</div>
						) : scholarshipsData?.scholarships?.length > 0 ? (
							<div className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{scholarshipsData.scholarships.slice(0, 5).map((schol: any) => (
									<div
										key={schol.id || schol._id || schol.name}
										className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
									>
										<div className="min-w-0 pr-2">
											<p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
												{schol.name}
											</p>
											<p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
												Benefactor: {schol.providerName || "Alumni Batch Fund"}
											</p>
										</div>
										<div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md shrink-0 border border-emerald-200 dark:border-emerald-800/50">
											{schol.amountDetails || "Eligible Grant"}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="p-8 text-center text-xs text-slate-400">
								No active scholarships available
							</div>
						)}
					</div>
				</div>

			</div>
		</div>
	);
}
