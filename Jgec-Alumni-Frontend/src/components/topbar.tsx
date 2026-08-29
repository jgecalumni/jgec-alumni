"use client";
import { useAuth } from "@/store/AuthContext";
import { LogOutIcon, ExternalLink, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Topbar = () => {
	const { token, handleLogout, user } = useAuth();
	
	return (
		<nav className="text-white fixed top-0 z-[200] w-full bg-[#0f172a] border-b border-white/10 shadow-sm backdrop-blur-md bg-opacity-95">
			<div className="w-full max-w-screen-xl mx-auto lg:flex hidden justify-between items-center px-4 md:px-8 py-2">
				<div className="flex items-center gap-6 text-xs md:text-sm text-slate-300">
					<div className="flex items-center gap-2 font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
						<ShieldCheck size={16} className="text-emerald-400" />
						<span className="tracking-wide">Reg. No: <span className="text-white font-semibold">AADAT3213CF20251</span></span>
					</div>
					<Link
						href="https://jgec.ac.in/"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-blue-300 hover:text-white transition-colors duration-300 font-medium group"
					>
						JGEC Official Website
						<ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
					</Link>
				</div>

				<div className="flex items-center gap-4 text-sm">
					{!!token ? (
						<div className="flex items-center gap-4">
							<Link href={`/profile/${user?.userId}`} className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all duration-300 cursor-pointer shadow-sm">
								<Image
									src={user?.userPhoto || "/assets/placeholder-user.png"}
									layout="fill"
									objectFit="cover"
									alt="User Profile"
								/>
							</Link>
							<button
								onClick={handleLogout}
								className="flex items-center justify-center w-9 h-9 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors duration-300"
								title="Logout"
							>
								<LogOutIcon size={16} />
							</button>
						</div>
					) : (
						<div className="flex items-center gap-3">
							<Link href="/login">
								<button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full font-medium transition-all duration-300 border border-white/10">
									<LogIn size={14} />
									Login
								</button>
							</Link>
							<Link href="/register">
								<button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full font-medium transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
									<UserPlus size={14} />
									Sign Up
								</button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Topbar;
