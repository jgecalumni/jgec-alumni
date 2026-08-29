"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { Button } from "./ui/button";
import { Drawer, DrawerContent } from "./ui/drawer";
import { useAuth } from "@/store/AuthContext";

const Links = [
	{
		name: "Home",
		link: "/",
	},
	{
		name: "Vision & Mission",
		link: "/vision-mission",
	},
	
	{
		name: "Kanchenjunga",
		link: "/kanchenjunga",
	},
	{
		name: "Sathe Achi",
		link: "https://satheachi.org/site/index",
	},
	{
		name: "Scholarships",
		link: "/scholarships",
	},
	
];

const moreLinks = [
	// {
	// 	name: "Research & Internship",
	// 	link: "/research-internship",
	// },
	// {
	// 	name: "Contact",
	// 	link: "/contact",
	// },
	// {
	// 	name: "Digital Database",
	// 	link: "/digital-database",
	// },
	{
		name: "Giving Back",
		link: "/giving-back",
	},
	{
		name: "Rooms",
		link: "/rooms",
	},
	{
		name: "Take a trip",
		link: "/take-a-trip",
	},
	{
		name: "Upcoming Events",
		link: "/upcoming-events",
	},
	{
		name: "AGM MOM",
		link: "/agm-mom",
	},
	{
		name: "Bulletins",
		link: "/alumni-bulleins",
	},
	
];

const Navbar = () => {
	const [open, setOpen] = useState(false);
	const [openNav, setOpenNav] = useState(false);
	const pathname = usePathname();
	const { token, handleLogout, user } = useAuth();

	return (
		<>
			<nav className="h-19 w-full z-50 lg:top-12 top-0 bg-white/95 backdrop-blur-md fixed shadow-sm border-b border-neutral-100 px-2 md:px-8 transition-all">
				<div className="w-full h-full max-w-screen-2xl mx-auto flex items-center justify-between">
					<div className="flex items-center w-fit gap-3">
						<Image
							src="/Logo.webp"
							height={64}
							width={64}
							alt="Alumni Logo"
							className="w-12 h-12 md:w-14 md:h-14 object-contain"
						/>
						<div className="flex flex-col max-w-[200px] sm:max-w-none">
							<h1 className="text-neutral-900 font-extrabold text-[13px] lg:text-[17px] leading-tight tracking-tight">
								The JGEC Alumni Association
							</h1>
							<p className="text-neutral-500 text-[9px] lg:text-[11px] font-semibold tracking-wider uppercase mt-0.5 hidden sm:block">
								Jalpaiguri Government Engineering College
							</p>
						</div>
					</div>
					<div
						onClick={() => setOpenNav(!openNav)}
						className="text-2xl lg:hidden p-2 cursor-pointer text-neutral-600 hover:text-neutral-900 transition-colors bg-neutral-50 rounded-md border border-neutral-100">
						<RxHamburgerMenu />
					</div>

					<div className="lg:flex hidden h-full lg:text-[13px] xl:text-[14px] items-center gap-1 xl:gap-3 font-bold w-auto">
						{Links.map((link) => (
							<Link
								key={link.name}
								href={link.link}
								className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
									pathname == link.link
										? "text-primary bg-primary/10 border border-primary/20 shadow-sm"
										: "text-neutral-600 hover:text-primary hover:bg-neutral-50 border border-transparent"
								}`}>
								{link.name}
							</Link>
						))}
						{/* More links */}
						<div
							className="relative flex cursor-pointer items-center gap-1 px-4 py-2 rounded-full text-neutral-600 hover:text-primary hover:bg-neutral-50 border border-transparent transition-all duration-300"
							onClick={() => setOpen(!open)}>
							<div className={open ? "text-primary" : ""}>
								More
							</div>
							<div className={`transition-transform duration-300 ${open ? "rotate-180 text-primary" : "rotate-0"}`}>
								<IoIosArrowDown />
							</div>
							
							{/* Dropdown */}
							<div
								className={`absolute top-full right-0 mt-3 w-56 bg-white border border-neutral-100 rounded-2xl shadow-xl transition-all duration-300 origin-top-right ${
									open
										? "opacity-100 scale-100 pointer-events-auto"
										: "opacity-0 scale-95 pointer-events-none"
								}`}>
								<div className="flex flex-col p-2 gap-1">
									{moreLinks.map((links) => (
										<Link
											key={links.name}
											href={links.link}
											onClick={(e) => e.stopPropagation()}
											className={`px-4 py-2.5 rounded-xl text-[13px] transition-colors ${
												pathname == links.link
													? "bg-primary/10 text-primary font-extrabold"
													: "text-neutral-600 hover:bg-neutral-50 hover:text-primary font-bold"
											}`}>
											{links.name}
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<Drawer
				open={openNav}
				onClose={() => setOpenNav(false)}
				direction="left">
				<DrawerContent className="overflow-hidden block lg:hidden">
					<div className="w-full h-full py-4 overflow-y-auto flex flex-col  items-center">
						<div className="flex flex-col justify-center items-center">
							<Image
								height={120}
								width={120}
								src="/Logo.webp"
								alt="Alumni Logo"
								className="w-24 h-24 object-contain"
							/>
							<div className="flex items-center w-full flex-col text-center px-4 mt-2">
								<h1 className="text-neutral-900 font-extrabold text-[18px] leading-tight mb-1">
									The JGEC Alumni Association
								</h1>
								<p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
									Jalpaiguri Government Engineering College
								</p>
							</div>
							<div
								onClick={() => setOpenNav(!openNav)}
								className="text-2xl absolute top-3 right-3 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer text-neutral-600">
								<RxCross2 />
							</div>
						</div>
						<div className="flex items-center mt-6 gap-3">
							{!!token ? (
								<>
									<Link
										href={`/profile/${user?.userId}`}
										onClick={() => setOpenNav(false)}>
										<Image
											src={user?.userPhoto || ""}
											width={40}
											height={40}
											className="rounded-full shadow-sm border border-neutral-200"
											alt=""
										/>
									</Link>
									<Button
										onClick={() => {
											handleLogout();
											setOpenNav(false);
										}}
										className="bg-red-50 text-red-600 hover:bg-red-100 px-5 font-bold rounded-full">
										Logout
									</Button>
								</>
							) : (
								<>
									<Link href="/login">
										<Button variant="outline" className="rounded-full font-bold px-6 border-neutral-200" onClick={() => setOpenNav(false)}>Login</Button>
									</Link>
									<Link href="/register">
										<Button
											className="bg-primary hover:bg-primary text-white rounded-full font-bold px-6"
											onClick={() => setOpenNav(false)}>
											Sign Up
										</Button>
									</Link>
								</>
							)}
						</div>
						
						<Link
							href="https://jgec.ac.in/"
							target="_blank"
							onClick={() => setOpenNav(false)}
							className="mt-3 w-full px-6">
							<Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-full font-bold">Visit College Website</Button>
						</Link>

						<hr className="mt-6 border-t border-neutral-100 w-full" />
						
						<div className="flex flex-col w-full p-4 gap-1">
							{[...Links, ...moreLinks].map((link) => (
								<Link
									key={link.name}
									href={link.link}
									onClick={() => setOpenNav(false)}
									className={`flex items-center px-4 py-3.5 rounded-xl text-[14px] font-bold transition-colors ${
										pathname == link.link
											? "bg-primary/10 text-primary"
											: "text-neutral-600 hover:bg-neutral-50 hover:text-primary"
									}`}>
									{link.name}
								</Link>
							))}
							{/* <div
								className="cursor-pointer   w-full  items-center  duration-200"
								onClick={() => setOpen(!open)}>
								<div
									className={`flex ${open ? "bg-[#dae5f2]" : ""} items-center `}>
									<div
										className={`hover:text-primary ${open ? "text-primary" : ""
											} duration-200 p-3 pl-4`}>
										More
									</div>
									<div
										className={`${open ? "rotate-180" : "rotate-0"
											} duration-200`}>
										{" "}
										<IoIosArrowDown />
									</div>
								</div>
								<div
									className={`${open
										? "h-full pl-4    right-[4em] bg-[#ffffff] rounded-sm shadow-lg "
										: "h-0 overflow-hidden pointer-events-none"
										} duration-200`}>
									<div className="flex flex-col justify-center">
										{moreLinks.map((links) => (
											<Link
												key={links.name}
												href={links.link}
												onClick={() => setOpenNav(false)}
												className={`border-b hover:text-primary border-b-[#ebeaea] ${pathname == links.link
													? "bg-[#dae5f2] border-l-4 border-l-[#3a60c8] text-white0"
													: ""
													} text-black `}>
												<div className="p-3">{links.name}</div>
											</Link>
										))}
									</div>
								</div>
							</div> */}
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default Navbar;
