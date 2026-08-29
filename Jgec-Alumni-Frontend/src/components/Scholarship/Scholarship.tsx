"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SectionHeader from "../section-header";
import { useAllScholarshipsQuery } from "@/store/feature/scholarship-feature";
import Loading from "@/app/Loader";
import toast from "react-hot-toast";
import { useGetAllScholDocsQuery } from "@/store/feature/document-feature";
import Image from "next/image";
import { Download, Eye, Search } from "lucide-react";

const Scholarship = () => {
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
		return () => clearTimeout(timer);
	}, [searchQuery]);
	const {
		data: docsData,
		isLoading: docsLoading,
		isError: docsisError,
		error: docsError,
		refetch,
	} = useGetAllScholDocsQuery({});

	const { data, error, isError, isLoading } = useAllScholarshipsQuery({
		page: page,
		search: debouncedSearch,
	});

	const filterData =
		data?.scholarships.filter((item) => item.isActive === true) || [];

	useEffect(() => {
		if (isError) {
			toast.error(
				(error as any)?.data?.message || "Failed to fetch scholarships",
			);
		}
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [data, isError, error]); // Runs whenever `data` updates

	if (isLoading && docsLoading) {
		return <Loading />;
	}

	const handleDownload = async (url: string, filename: string) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = filename || "download.pdf"; // Default filename
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	return (
		<div className="bg-white pb-20">
			<SectionHeader
				highlightTitle="Scholarships"
				normalTitle="Programs"
				description="We are committed to helping students achieve their academic goals by providing them with the necessary resources and scholarships."
			/>

			<div className="max-w-8xl mx-auto  lg:px-8 mt-12 flex flex-col gap-12">
				
				{/* Scholarship Journey Timeline */}
				<div className=" mx-auto w-full px-4 mb-10">
					<div className="relative border-l-4 border-primary/20 ml-4 md:ml-8 space-y-16 py-4">
						
						{/* Step 1: Origins */}
						<div className="relative pl-8 md:pl-14">
							<div className="absolute -left-[14px] top-1 w-6 h-6 bg-primary rounded-full ring-8 ring-white shadow-sm flex items-center justify-center">
								<div className="w-2 h-2 bg-white rounded-full"></div>
							</div>
							<h3 className="text-neutral-900 font-extrabold text-2xl lg:text-3xl tracking-tight mb-6">
								The Origins & Growth
							</h3>
							<div className="space-y-4 text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed text-justify">
								<p>
									The <span className="font-extrabold text-neutral-900">Jalpaiguri Government Engineering College Alumni Association (JGECAA)</span> began the Annual Scholarship for Scholastic Excellence in the year 2013, spearheaded by two alumni—<span className="font-extrabold text-neutral-900">Mr. Bibhas Bhowmik (CE, 1985)</span> and <span className="font-extrabold text-neutral-900">Mr. Premangshu Ghosh (EE, 1979)</span>—under their unwavering vision and guidance.
								</p>
								<p>
									JGECAA initiated this academic aid program to support students of high calibre as well as those facing financial constraints but possessing strong potential to achieve their professional goals.
								</p>
								<p>
									What began in 2013 with two sponsors supporting two students from each discipline with an amount of <span className="font-extrabold text-neutral-900 text-primary">(₹ 2 × 20,000) × 2 = ₹ 80,000 per annum</span>, has now grown into a full-fledged scholarship program with over <span className="font-extrabold text-neutral-900 text-primary">32 sponsors</span> from India and abroad.
								</p>
								<p>
									These scholarships are in addition to the schemes provided by the West Bengal Government that have existed for many years.
								</p>
							</div>
						</div>

						{/* Step 2: Objectives */}
						<div className="relative pl-8 md:pl-14">
							<div className="absolute -left-[14px] top-1 w-6 h-6 bg-primary rounded-full ring-8 ring-white shadow-sm flex items-center justify-center">
								<div className="w-2 h-2 bg-white rounded-full"></div>
							</div>
							<h3 className="text-neutral-900 font-extrabold text-2xl lg:text-3xl tracking-tight mb-6">
								Program Objectives
							</h3>
							<div className="bg-neutral-50 rounded-2xl p-6 md:p-8 border border-neutral-100">
								<p className="text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed">
									The Alumni Association works tirelessly to ensure that alumni from all parts of India and the world come together for the upliftment and expansion of the current student community.
								</p>
							</div>
						</div>

						{/* Step 3: Guidelines */}
						<div className="relative pl-8 md:pl-14">
							<div className="absolute -left-[14px] top-1 w-6 h-6 bg-primary rounded-full ring-8 ring-white shadow-sm flex items-center justify-center">
								<div className="w-2 h-2 bg-white rounded-full"></div>
							</div>
							<h3 className="text-neutral-900 font-extrabold text-2xl lg:text-3xl tracking-tight mb-6">
								Sponsorship Guidelines
							</h3>
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
								<div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-primary/40 transition-colors">
									<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg mb-4">1</div>
									<h4 className="font-bold text-neutral-900 mb-2">Selection Criteria</h4>
									<p className="text-neutral-600 text-[14px] leading-relaxed">Criteria (merit-based, need-based, etc.) are open to the sponsor’s choice. May be applied to any students from 1st to 4th year, or postgraduate aspirants.</p>
								</div>
								
								<div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-primary/40 transition-colors">
									<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg mb-4">2</div>
									<h4 className="font-bold text-neutral-900 mb-2">Interview Process</h4>
									<p className="text-neutral-600 text-[14px] leading-relaxed">Primarily based on a direct face-to-face or online interview conducted by the sponsor or designated senior members, generally during the AGM in August.</p>
								</div>

								<div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-primary/40 transition-colors">
									<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg mb-4">3</div>
									<h4 className="font-bold text-neutral-900 mb-2">Scholarship Amount</h4>
									<p className="text-neutral-600 text-[14px] leading-relaxed">The Scholarship amount is fully flexible and determined by the sponsor. There is no upper limit for the support you can provide.</p>
								</div>

								<div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-primary/40 transition-colors">
									<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg mb-4">4</div>
									<h4 className="font-bold text-neutral-900 mb-2">Disbursement</h4>
									<p className="text-neutral-600 text-[14px] leading-relaxed">Funds are collected annually and then disbursed directly to the selected students’ designated bank accounts.</p>
								</div>
							</div>

							<div className="mt-8 bg-primary rounded-2xl p-6 md:p-8 text-white shadow-lg">
								<h4 className="font-bold text-xl mb-3 flex items-center gap-2">
									<span className="text-blue-300/80">◆</span> Our Vision
								</h4>
								<p className="text-white leading-relaxed font-medium">
									JGECAA expects greater participation in such multidimensional and benevolent initiatives for the entire JGEC fraternity. With active participation from alumni across the globe, we aim to support an even larger cross-section of students in the coming years. Sponsors are encouraged to continue scholarships for 3–5 years to maximize impact.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Available Scholarship Programs */}
				<div className="w-full mx-auto px-4 mb-14">
					<div className="bg-[#7ec9ee] rounded-xl overflow-hidden shadow-md">
						<div className="bg-[#3fa3d5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="text-lg md:text-xl text-neutral-950 font-bold">
								Scholarship Programs
							</div>
							<div className="relative w-full sm:w-72">
								<input
									type="text"
									placeholder="Search scholarships..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-lg border-none focus:ring-2 focus:ring-white/50 bg-white/90 focus:bg-white text-sm outline-none transition-all placeholder:text-neutral-500 text-neutral-900 shadow-sm"
								/>
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
							</div>
						</div>
						<div className="p-2 sm:p-4 min-h-[100px]">
							{filterData.length > 0 ? (
								<ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
									{filterData.map((item) => (
										<li key={item.id} className="p-3 border-b border-blue-400/30 transition-colors hover:bg-blue-400/20 rounded-lg group">
											<Link
												href={`/scholarships/${item.id}`}
												className="flex flex-col gap-1"
											>
												<h4 className="text-[15px] font-bold text-neutral-900 group-hover:text-blue-900 transition-colors">
													{item.name}
												</h4>
												<div className="flex flex-col gap-0.5 mt-1">
													<span className="text-[12px] font-bold text-blue-900 uppercase tracking-wider">
														Sponsored by {item.providerName}
													</span>
													{item.subtitle && (
														<p className="text-[13px] text-neutral-800 line-clamp-1 mt-0.5">
															{item.subtitle}
														</p>
													)}
												</div>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<div className="flex flex-col items-center justify-center py-12 text-blue-900/60">
									<Search className="w-12 h-12 mb-3 opacity-20" />
									<p className="font-semibold text-lg">No scholarships found</p>
									<p className="text-sm mt-1">Try adjusting your search query</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Documents Section */}
				{docsData?.response.length > 0 && (
					<div className="bg-[#f8fafc] rounded-3xl border border-neutral-100 p-8 lg:p-12 overflow-hidden shadow-sm">
						<div className="inline-flex items-center gap-3 mb-8">
							<div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
							<h3 className="text-neutral-900 font-bold uppercase text-xl lg:text-2xl tracking-tight">Recipient Lists & Documents</h3>
						</div>
						
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 max-h-[50vh] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-neutral-200">
							{docsData?.response.map((item: any) => (
								<div
									key={item.title}
									className="group bg-white border border-neutral-200 shadow-sm hover:shadow-lg rounded-2xl flex flex-col items-center justify-between h-[180px] relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
									
									<div className="flex-1 w-full flex items-center justify-center bg-red-50/30 group-hover:bg-red-50/50 transition-colors h-[70%]">
										<Image
											src="/assets/pdf.png"
											width={48}
											height={48}
											alt="PDF"
											className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300"
										/>
									</div>

									<div className="bg-white w-full p-3 border-t border-neutral-100 absolute bottom-0 translate-y-[45%] group-hover:translate-y-0 transition-transform duration-300 z-10">
										<div className="flex gap-2 items-center text-xs font-bold text-neutral-800">
											<Image
												src="/assets/pdf.png"
												width={16}
												height={16}
												alt=""
												className="shrink-0"
											/>
											<div className="line-clamp-1 group-hover:line-clamp-2 transition-all">
												{item.title}
											</div>
										</div>
										<div className="mt-3 flex gap-4 justify-center items-center pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<Link
												href={item.link}
												target="_blank"
												className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
												<Eye size={16} />
											</Link>
											<button
												onClick={() => handleDownload(item.link, `${item.title}.pdf`)}
												className="p-2 bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer">
												<Download size={16} />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Scholarship;
