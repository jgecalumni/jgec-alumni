"use client"
import { useGetAllNoticesQuery } from "@/store/feature/notice-feature";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

import { FaChevronCircleRight } from "react-icons/fa";
import { FaCircleChevronRight } from "react-icons/fa6";
import ReactQuill from "react-quill-new";
import { ScrollArea } from "@/components/ui/scroll-area";

const data = [
	{
		post: "Ex-Officio Chairman",
		member: [
			{
				name: "Dr. Amitava Ray",
				timeline: "Principal, JGEC",
				image: "/assets/Members/ex-officio.jpg",
			},
		],
	},
	{
		post: "President",
		member: [
			{
				name: "Mr. Bhaskar Dasgupta",
				timeline: "(1979-1983)",
				image: "/assets/Members/BhaskarDasgupta.jpg",
			},
		],
	},
	{
		post: "Vice President",
		member: [
			{
				name: "Mr. Biplob Kanti Roy",
				timeline: "(1992-1996)",
				image: "/assets/Members/person-icon-8.png",
			},
		],
	},
	{
		post: "Secretary",
		member: [
			{
				name: "Mr. Partha Halder",
				timeline: "(1989-1993)",
				image: "/assets/Members/person-icon-8.png",
			},
		],
	},
	{
		post: "Treasurer",
		member: [
			{
				name: "Dr. Mousam Chatterjee",
				timeline: "(2000-2004)",
				image: "/assets/Members/MousamChatterjee.jpg",
			},
		],
	},
	{
		post: "Governing Body Member",
		member: [
			{
				name: "Dr. Mala De",
				timeline: "(1996-2000)",
				image: "/assets/Members/MalaDe.jpg",
			},
		],
	},
	{
		post: "Governing Body Member",
		member: [
			{
				name: "Mr. Tufan Dutta",
				timeline: "(1996-2000)",
				image: "/assets/Members/TufanDutta.jpg",
			},
		],
	},
	{
		post: "Governing Body Member",
		member: [
			{
				name: "Mr. Soumyajit Das",
				timeline: "(2007-2011)",
				image: "/assets/Members/SoumyajitDas.jpg",
			},
		],
	},
	{
		post: "Governing Body Member",
		member: [
			{
				name: "Ms. Durba Shil",
				timeline: "(2019-2023)",
				image: "/assets/Members/DurbaShil.jpg",
			},
		],
	},
	{
		post: "Internal Auditor",
		member: [
			{
				name: "Mr. Bithin Basu",
				timeline: "(1989-1993)",
				image: "/assets/Members/BithinBasu.jpg",
			},
		],
	},
	{
		post: "Project Director (Kanchenjunga Construction and Operations)",
		member: [
			{
				name: "Mr. Rajib Bhattacharya",
				timeline: "(1996-2000)",
				image: "/assets/Members/RajibBhattacharya.jpg",
			},
		],
	},
];

const bottomLinks = [
	{
		name: "Gallery",
		link: "/gallery",
	},
	{
		name: "Audit Report",
		link: "/audit-report",
	},
	{
		name: "Constitution",
		link: "/assets/constitution_of_AA.pdf",
	},
	{
		name: "Alumni Activities",
		link: "/alumni-activities",
	},
	{
		name: "Money Receipt",
		link: "/money-receipt",
	},
	{
		name: "Media & Press Release",
		link: "/media&press-release",
	},
	{
		name: "Bulletins",
		link: "/alumni-bulleins",
	},
];

const notices = [
	{
		title: "SCHOLARSHIP PROGRAM - 2024",
		subtitle:
			"Scholarship Program for the year 2024 has been announced. Click here to know more.",
		link: "/notice-1",
	},
	{
		title: "1) Opening date of application by students of JGEC: 1st June, 2024",
		subtitle: "",
		link: "/notice-2",
	},
	{
		title: "SCHOLARSHIP PROGRAM - 2024",
		subtitle:
			"Scholarship Program for the year 2024 has been announced. Click here to know more.",
		link: "/notice-1",
	},
	{
		title: "1) Opening date of application by students of JGEC: 1st June, 2024",
		subtitle: "",
		link: "/notice-2",
	},
	{
		title: "SCHOLARSHIP PROGRAM - 2024",
		subtitle:
			"Scholarship Program for the year 2024 has been announced. Click here to know more.",
		link: "/notice-1",
	},
	{
		title: "1) Opening date of application by students of JGEC: 1st June, 2024",
		subtitle: "",
		link: "/notice-2",
	},
	{
		title: "SCHOLARSHIP PROGRAM - 2024",
		subtitle:
			"Scholarship Program for the year 2024 has been announced. Click here to know more.",
		link: "/notice-1",
	},
	{
		title: "1) Opening date of application by students of JGEC: 1st June, 2024",
		subtitle: "",
		link: "/notice-2",
	},
];

const GoverningBody = () => {
	const {
		data: noticeData,
		isError,
		isLoading,
		error,
	} = useGetAllNoticesQuery({
		limit: 1000,
		page: 1,
	});

	const scrollRef = useRef<HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		let animationFrameId: number;

		const scroll = () => {
			if (scrollRef.current && !isHovered) {
				const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
				if (viewport) {
					viewport.scrollTop += 0.5;
					// If we have scrolled past the first half of the duplicated list
					if (viewport.scrollTop >= viewport.scrollHeight / 2) {
						viewport.scrollTop -= viewport.scrollHeight / 2;
					}
				}
			}
			animationFrameId = requestAnimationFrame(scroll);
		};

		animationFrameId = requestAnimationFrame(scroll);

		return () => cancelAnimationFrame(animationFrameId);
	}, [isHovered]);

	return (
		<section className="w-full px-4 md:px-10 py-8 md:py-16 bg-white">
			<div className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-6 justify-center">
				{/* Governing Body Section */}
				<div className="w-full lg:w-2/3 bg-[#c4eb80] h-full shadow-sm rounded-md overflow-hidden border border-neutral-200">
					<h1 className="text-lg md:text-xl bg-[#91c837] text-neutral-950 p-3 font-semibold border-b border-neutral-300">
						Governing Body
					</h1>
					<div className="grid text-center text-neutral-950 lg:grid-cols-3 grid-cols-2 w-full h-full">
						{data.map((item, index) => (
							<div
								key={index}
								className="border-r border-b flex flex-col items-center justify-start w-full border-[#91c837]/30 h-auto md:h-72 max-md:py-4 max-md:px-2 p-4">
								<h1 className="lg:text-[17px] text-base font-semibold mb-4 text-green-900">
									{item.post}
								</h1>
								{item.member.map((member, idx) => (
									<div
										key={idx}
										className="text-neutral-800 font-normal mb-4 flex flex-col items-center">
										<Image
											src={member.image}
											alt={member.name}
											width={100}
											height={100}
											className="object-cover w-[6rem] h-[6rem] overflow-hidden rounded-full border-2 border-white shadow-sm mb-2"
										/>
										<div className="text-[14px] font-medium capitalize">{member.name}</div>
										<h4 className="text-xs md:text-sm text-neutral-700">{member.timeline}</h4>
									</div>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Sidebar: Noticeboard & Links */}
				<div className="w-full lg:w-1/3 flex flex-col gap-6">
					{/* Noticeboard */}
					<div className="bg-sky-50 h-[70vh] shadow-xl rounded-2xl overflow-hidden border border-sky-100">
						<div className="bg-blue-900 text-white text-lg md:text-xl px-6 py-4 font-bold tracking-wide border-b-4 ">
							Noticeboard
						</div>
						<ScrollArea 
							ref={scrollRef}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
							className="w-full h-[calc(70vh-4rem)]">
							{noticeData?.notices.length === 0 && (
								<div className="flex items-center justify-center h-full">
									<p className="text-blue-800/60 font-medium text-sm">
										No notices available
									</p>
								</div>
							)}
							<ul className="flex flex-col bg-sky-50">
								{/* Render notices twice for seamless infinite scrolling */}
								{[...(noticeData?.notices || []), ...(noticeData?.notices || [])].map((item: any, index: number) => (
									<li
										key={index}
										className="px-5 py-4 border-b border-sky-200/60 hover:bg-sky-100/50 transition-colors duration-200">
										<Link
											href={item.link}
											className="flex flex-col gap-1.5">
											<h4 className="text-[14px] font-bold leading-snug text-blue-950">{item.title}</h4>
											<div>
												<ReactQuill
													theme="bubble"
													value={item.description}
													readOnly={true}
													className="view_editor1 text-[13px] text-neutral-700"
												/>
											</div>
											<p className="text-[11px] font-semibold text-blue-700/70 text-right mt-1 uppercase tracking-wider">
												published on {format(item.date, "dd MMM, yyyy")}
											</p>
										</Link>
									</li>
								))}
							</ul>
						</ScrollArea>
					</div>

					{/* Quick Links */}
					<div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-neutral-100 mt-2">
						<div className="bg-gradient-to-r from-blue-50 to-white text-blue-950 px-6 py-4 font-bold border-b border-blue-100 text-lg md:text-xl tracking-wide flex items-center gap-2">
							Quick Links
						</div>
						<ul className="flex flex-col p-3 gap-1">
							{bottomLinks.map((item, index) => (
								<li key={index}>
									<Link
										href={item.link}
										className="group flex text-neutral-600 hover:bg-blue-50 hover:text-blue-700 transition-all font-semibold gap-3 items-center px-4 py-3 rounded-xl border border-transparent hover:border-blue-100">
										<FaCircleChevronRight className="text-blue-300 group-hover:text-blue-600 transition-colors text-sm shrink-0" />
										<span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default GoverningBody;
