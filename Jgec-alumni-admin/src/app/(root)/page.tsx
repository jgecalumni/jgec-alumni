"use client";

import { FaUser } from "react-icons/fa6";
import { IoSchool } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { useGetCountQuery } from "@/store/feature/dashboard-feature";
import Loading from "../loading";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import DashboardChart from "@/components/Dashboard/DashboardChart";
import { useGetAllMembersQuery } from "@/store/feature/member-feature";
import { useGetAllNoticesQuery } from "@/store/feature/notice-feature";
import { useAllEventsQuery } from "@/store/feature/event-feature";
import { useAllScholarshipsQuery } from "@/store/feature/scholarship-feature";
import { ArrowRight, User, Calendar, FileText, Gift, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
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
			toast.error((error as any)?.data?.message || "Failed to fetch data");
		}
	}, [isError, error]);

	if (isLoading) return <Loading />;

	const counts = data?.data;

	return (
		<div className="w-full space-y-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold tracking-tight lg:text-3xl text-foreground">Welcome back, Admin</h1>
				<p className="text-muted-foreground">Here is an overview of your platform.</p>
			</div>
			
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Link href="/members" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
						<div className="flex items-center justify-between space-y-0 pb-4">
							<h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
								Total Members
							</h3>
							<div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
								<FaUser size={18} />
							</div>
						</div>
						<div className="text-3xl font-bold text-foreground">
							{counts?.members || 0}
						</div>
					</div>
				</Link>
				
				<Link href="/scholarship" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
						<div className="flex items-center justify-between space-y-0 pb-4">
							<h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
								Scholarships
							</h3>
							<div className="p-2 bg-indigo-500/10 rounded-full text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
								<IoSchool size={20} />
							</div>
						</div>
						<div className="text-3xl font-bold text-foreground">
							{counts?.scholarships || 0}
						</div>
					</div>
				</Link>
				
				<Link href="/notices" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
						<div className="flex items-center justify-between space-y-0 pb-4">
							<h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
								Active Notices
							</h3>
							<div className="p-2 bg-amber-500/10 rounded-full text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
								<IoIosCreate size={20} />
							</div>
						</div>
						<div className="text-3xl font-bold text-foreground">
							{counts?.notices || 0}
						</div>
					</div>
				</Link>
				
				<Link href="/events" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
						<div className="flex items-center justify-between space-y-0 pb-4">
							<h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
								Upcoming Events
							</h3>
							<div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
								<IoIosCreate size={20} />
							</div>
						</div>
						<div className="text-3xl font-bold text-foreground">
							{counts?.events || 0}
						</div>
					</div>
				</Link>

				<Link href="/payments" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl sm:col-span-2 lg:col-span-1 hidden lg:block xl:hidden 2xl:block">
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50 h-full">
						<div className="flex items-center justify-between space-y-0 pb-4">
							<h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
								Recent Payments
							</h3>
							<div className="p-2 bg-rose-500/10 rounded-full text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
								<FaMoneyCheckAlt size={20} />
							</div>
						</div>
						<div className="text-3xl font-bold text-foreground">
							View
						</div>
					</div>
				</Link>
			</div>

			<DashboardChart counts={counts} />

            {/* RECENT ACTIVITY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Members */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-primary"/>
                            <h3 className="font-semibold text-foreground">Recent Members</h3>
                        </div>
                        <Link href="/members" className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="p-0 flex-1">
                        {membersLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : membersData?.members?.length > 0 ? (
                            <div className="divide-y divide-border">
                                {membersData.members.slice(0, 5).map((member: any) => (
                                    <div key={member.id || member._id || member.email} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                {member?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground line-clamp-1">{member.name}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">
                                            {member.passingYear || 'N/A'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">No recent members</div>
                        )}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-emerald-500"/>
                            <h3 className="font-semibold text-foreground">Upcoming Events</h3>
                        </div>
                        <Link href="/events" className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="p-0 flex-1">
                        {eventsLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : eventsData?.events?.length > 0 ? (
                            <div className="divide-y divide-border">
                                {eventsData?.events.slice(0, 5).map((event: any) => (
                                    <div key={event.id || event._id || event.name || event.title} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex flex-col items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg w-12 h-12 shrink-0">
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(event.date || event.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-lg font-black leading-none">{new Date(event.date || event.createdAt || Date.now()).getDate()}</span>
                                        </div>
                                        <div className="flex-1 truncate">
                                            <p className="text-sm font-medium text-foreground truncate" title={event.name || event.title}>{event.name || event.title}</p>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">{event.location || 'Online'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">No upcoming events</div>
                        )}
                    </div>
                </div>

                {/* Recent Notices */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-amber-500"/>
                            <h3 className="font-semibold text-foreground">Recent Notices</h3>
                        </div>
                        <Link href="/notices" className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="p-0 flex-1">
                        {noticesLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : (noticesData?.notices?.length ?? 0) > 0 ? (
                            <div className="divide-y divide-border">
                                {noticesData?.notices?.slice(0, 5).map((notice: any, idx: number) => {
                                    const noticeId = notice.id || notice._id || idx.toString();
                                    const isExpanded = expandedNoticeId === noticeId;
                                    
                                    return (
                                        <div 
                                            key={noticeId} 
                                            className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                                            onClick={() => setExpandedNoticeId(isExpanded ? null : noticeId)}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors pr-4">{notice.title}</p>
                                                <svg
                                                    className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            <div 
                                                className={`relative text-xs text-muted-foreground overflow-hidden transition-all duration-300 [&_.ql-editor]:p-0 [&_.ql-editor]:text-xs [&_.ql-editor]:text-muted-foreground ${isExpanded ? 'max-h-[1000px]' : 'max-h-[2.8em] pointer-events-none'}`}
                                                onClick={(e) => { if (isExpanded) e.stopPropagation(); }}
                                            >
                                                <ReactQuill
                                                    value={notice.description}
                                                    readOnly={true}
                                                    theme="bubble"
                                                />
                                                {!isExpanded && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-card to-transparent opacity-90 pointer-events-none"></div>
                                                )}
                                            </div>
                                            <div className="text-[10px] font-semibold text-muted-foreground mt-2 uppercase tracking-wider">
                                                {new Date(notice.date || notice.createdAt || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">No recent notices</div>
                        )}
                    </div>
                </div>

                {/* Recent Scholarships */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Gift size={18} className="text-indigo-500"/>
                            <h3 className="font-semibold text-foreground">Scholarships</h3>
                        </div>
                        <Link href="/scholarship" className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="p-0 flex-1">
                        {scholarshipsLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : scholarshipsData?.scholarships?.length > 0 ? (
                            <div className="divide-y divide-border">
                                {scholarshipsData.scholarships.slice(0, 5).map((schol: any) => (
                                    <div key={schol.id || schol._id || schol.name} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex-1 truncate pr-4">
                                            <p className="text-sm font-medium text-foreground line-clamp-1">{schol.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 truncate">Provider: {schol.providerName}</p>
                                        </div>
                                        <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md shrink-0">
                                            {schol.amountDetails}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">No scholarships available</div>
                        )}
                    </div>
                </div>

            </div>
		</div>
	);
}
