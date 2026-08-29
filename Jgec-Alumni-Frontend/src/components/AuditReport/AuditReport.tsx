"use client";
import React from "react";
import SectionHeader from "../section-header";
import Loading from "@/app/Loader";
import { useGetAllAuditReportDocsQuery } from "@/store/feature/document-feature";
import Image from "next/image";
import Link from "next/link";
import { Download, Eye, Pointer } from "lucide-react";

const AuditReport = () => {
	const {
		data: docsData,
		isLoading: docsLoading,
		isError: docsisError,
		error: docsError,
		refetch,
	} = useGetAllAuditReportDocsQuery({});
	if (docsLoading) {
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
		<div className="min-h-screen bg-[#edf1f4] pb-24 pt-8">
			<SectionHeader
				highlightTitle="Audit"
				normalTitle="Reports"
				description="Access and download all official audit reports"
			/>
			
			<div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-12">
				{docsData?.response.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{docsData?.response.map((item: any) => (
							<div
								key={item.title}
								className="group bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
								
								{/* Card Content */}
								<div className="p-6 flex flex-col items-center text-center gap-4 flex-1">
									<div className="bg-red-50/50 p-5 rounded-full group-hover:scale-110 transition-transform duration-300">
										<Image
											src="/assets/pdf.png"
											width={48}
											height={48}
											alt="PDF Icon"
											className="object-contain"
										/>
									</div>
									<h3 className="font-bold text-neutral-900 text-lg leading-snug line-clamp-3">
										{item.title}
									</h3>
								</div>

								{/* Actions Footer */}
								<div className="bg-neutral-50 p-4 flex items-center justify-between border-t border-neutral-100">
									<Link
										href={item.link}
										target="_blank"
										className="flex items-center justify-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-800 bg-sky-100/50 hover:bg-sky-100 px-4 py-2.5 rounded-xl transition-colors flex-1 mr-2">
										<Eye size={18} />
										<span>View</span>
									</Link>
									<button
										onClick={() => handleDownload(item.link, `${item.title}.pdf`)}
										className="flex items-center justify-center gap-2 text-sm font-bold text-[#7db02b] hover:text-[#5d8a1c] bg-[#c4eb80]/30 hover:bg-[#c4eb80]/70 px-4 py-2.5 rounded-xl transition-colors flex-1 ml-2">
										<Download size={18} />
										<span>Download</span>
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="w-full flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-neutral-100">
						<div className="bg-neutral-100 p-6 rounded-full mb-4">
							<Pointer className="w-12 h-12 text-neutral-400" />
						</div>
						<h3 className="text-xl font-bold text-neutral-900">No Reports Found</h3>
						<p className="text-neutral-500 font-medium mt-2">Check back later for newly published audit reports.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AuditReport;
