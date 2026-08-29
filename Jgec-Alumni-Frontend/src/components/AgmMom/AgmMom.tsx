"use client";
import React from "react";
import SectionHeader from "../section-header";
import { Download, Eye, FileText } from "lucide-react";
import Link from "next/link";
import Loading from "@/app/Loader";
import { useGetAllAgmMomDocsQuery } from "@/store/feature/document-feature";
import { motion, Variants } from "framer-motion";

const AgmMom = () => {
	const {
		data: docsData,
		isLoading: docsLoading,
	} = useGetAllAgmMomDocsQuery({});

	if (docsLoading) {
		return <Loading />;
	}

	const handleDownload = async (url: string, filename: string) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = filename || "download.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
	};

	return (
		<div className="min-h-screen bg-gray-50/30 pb-24 pt-8">
			<SectionHeader
				highlightTitle="AGM"
				normalTitle="MOM"
				description="Get all AGM MOM documents here"
			/>
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
				{docsData?.response?.length > 0 ? (
					<motion.div 
						variants={containerVariants}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						{docsData?.response.map((item: any, index: number) => (
							<motion.div
								variants={itemVariants}
								key={index}
								className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full overflow-hidden"
							>
								{/* Decorative top gradient line */}
								<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								
								<div className="flex items-start gap-4 mb-6">
									<div className="p-3.5 bg-blue-50/80 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
										<FileText size={28} strokeWidth={1.5} />
									</div>
									<div className="flex-1 min-w-0 pt-1">
										<h3 className="text-gray-900 font-semibold text-base line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors duration-200">
											{item.title}
										</h3>
										<p className="text-xs font-medium text-gray-500 mt-1.5">PDF Document</p>
									</div>
								</div>

								<div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100/80">
									<Link
										href={item.link}
										target="_blank"
										className="flex items-center justify-center flex-1 gap-2 py-2.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
									>
										<Eye size={18} />
										<span>View</span>
									</Link>
									<div className="w-px h-8 bg-gray-100 mx-2" />
									<button
										onClick={() => handleDownload(item.link, `${item.title}.pdf`)}
										className="flex items-center justify-center flex-1 gap-2 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 cursor-pointer"
									>
										<Download size={18} />
										<span>Download</span>
									</button>
								</div>
							</motion.div>
						))}
					</motion.div>
				) : (
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-gray-100 border-dashed shadow-sm max-w-3xl mx-auto"
					>
						<div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-5">
							<FileText size={40} strokeWidth={1.5} />
						</div>
						<h3 className="text-xl font-semibold text-gray-900">No documents found</h3>
						<p className="text-sm text-gray-500 mt-2">Check back later for new AGM MOM documents.</p>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default AgmMom;
