"use client";
import React from "react";
import SectionHeader from "../section-header";
import Image from "next/image";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { useGetAllKanchenungaDocsQuery } from "@/store/feature/document-feature";
import Loading from "@/app/Loader";

const Kanchenjunga = () => {
	const {
		data: docsData,
		isLoading: docsLoading,
		isError: docsisError,
		error: docsError,
		refetch,
	} = useGetAllKanchenungaDocsQuery({});
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
		<div className="bg-white pb-20">
			<SectionHeader
				highlightTitle="Kanchen"
				normalTitle="junga"
				description="A private land inside the college campus purchased by Alumni Association"
			/>
			
			<div className="max-w-8xl mx-auto px-4 lg:px-8 mt-12 flex flex-col gap-12">
				
				{/* Main Content Card */}
				<div className="bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-3xl w-full overflow-hidden border border-neutral-100 p-8 lg:p-14">
					
					{/* Main Header */}
					<h2 className="lg:text-2xl md:text-3xl text-lg text-primary font-extrabold leading-snug tracking-tight mb-12 text-center uppercase max-w-4xl mx-auto">
						Jalpaiguri Government Engineering College Alumni Build
						Multipurpose "Kanchenjunga": A Hub for Learning, Collaboration,
						and Community
					</h2>

					<div className="flex flex-col gap-12">
						
						{/* About & History */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
							{/* About */}
							<div>
								<div className="inline-flex items-center gap-3 mb-6">
									<div className="w-1.5 h-8 bg-primary/100 rounded-full"></div>
									<h3 className="text-neutral-900 font-extrabold uppercase text-2xl lg:text-3xl tracking-tight">Kanchenjunga</h3>
								</div>
								<div className="space-y-4 text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed text-justify">
									<p>
										Kanchenjunga is the brainchild of our own Alumni - the
										Engineers of JGEC, who drive the Industry today. It is meant
										to facilitate students and act as a convention centre. A
										perfect venue to conduct conferences and seminars, meetings,
										interviews and group discussions or to house a start-up.
									</p>
									<p>
										Additionally, this Convention centre houses a Reading Corner
										- a state of the art library of fresh books of engineering
										with latest edition and many relevant journals.
									</p>
									<p>
										It also has a facility to lodge people who are associated
										with the facilitation of present students or their parents,
										Alumni or any company/institution representative who have
										arrived to train/interview our students.
									</p>
								</div>
							</div>

							{/* History */}
							<div>
								<div className="inline-flex items-center gap-3 mb-6">
									<div className="w-1.5 h-8 bg-primary/100 rounded-full"></div>
									<h3 className="text-neutral-900 font-extrabold uppercase text-2xl lg:text-3xl tracking-tight">Basic History</h3>
								</div>
								<div className="space-y-4 text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed text-justify">
									<p>
										Kanchenjunga is the brainchild of our own Alumni - the
										Engineers of JGEC, who drive the Industry today. It is meant
										to facilitate students and act as a convention centre. A
										perfect venue to conduct conferences and seminars, meetings,
										interviews and group discussions or to house a start-up.
									</p>
									<p>
										Additionally, this Convention centre houses a Reading Corner
										- a state of the art library of fresh books of engineering
										with latest edition and many relevant journals.
									</p>
									<p>
										It also has a facility to lodge people who are associated
										with the facilitation of present students or their parents,
										Alumni or any company/institution representative who have
										arrived to train/interview our students.
									</p>
								</div>
							</div>
						</div>

						<hr className="border-neutral-100" />

						{/* Floor Plans */}
						<div>
							<div className="inline-flex items-center gap-3 mb-8">
								<div className="w-1.5 h-8 bg-primary/100 rounded-full"></div>
								<h3 className="text-neutral-900 font-extrabold uppercase text-2xl lg:text-3xl tracking-tight">Floor Plans</h3>
							</div>
							<div className="flex flex-col lg:flex-row items-center justify-between gap-8">
								<Image
									src="/assets/Kanchenjunga-floor-plan-1.png"
									alt="Floor Plan 1"
									height={500}
									width={500}
									className="rounded-2xl shadow-sm border border-neutral-100 w-full lg:w-1/2 object-contain bg-neutral-50 p-4"
								/>
								<Image
									src="/assets/Kanchenjunga-floor-plan-2.png"
									alt="Floor Plan 2"
									height={500}
									width={500}
									className="rounded-2xl shadow-sm border border-neutral-100 w-full lg:w-1/2 object-contain bg-neutral-50 p-4"
								/>
							</div>
						</div>

						<hr className="border-neutral-100" />

						{/* Purpose */}
						<div>
							<div className="inline-flex items-center gap-3 mb-8">
								<div className="w-1.5 h-8 bg-primary/100 rounded-full"></div>
								<h3 className="text-neutral-900 font-extrabold uppercase text-2xl lg:text-3xl tracking-tight">Purpose of Kanchenjunga</h3>
							</div>
							
							<div className="flex flex-col gap-12">
								<div className="flex flex-col-reverse lg:flex-row items-center gap-8">
									<div className="w-full lg:w-1/2 space-y-4 text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed text-justify">
										<p>
											Kanchenjunga, a Knowledge & Development center shall offer
											Management & Technical Development programs, Seminars,
											Workshops for business houses both public & private
											enterprises & to other non-profit organizations.
										</p>
										<p>
											The Industry Achievers shall be invited to address &
											interact with our students, as well.
										</p>
									</div>
									<Image
										src="/assets/kanchenjunga-pic-2.png"
										alt="Purpose 1"
										height={500}
										width={500}
										className="rounded-2xl shadow-sm w-full lg:w-1/2 object-cover border border-neutral-100"
									/>
								</div>

								<div className="flex flex-col lg:flex-row items-center gap-8">
									<Image
										src="/assets/kanchenjunga-pic-1.png"
										alt="Purpose 2"
										height={500}
										width={500}
										className="rounded-2xl shadow-sm w-full lg:w-1/2 object-cover border border-neutral-100"
									/>
									<div className="w-full lg:w-1/2 space-y-4 text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed text-justify">
										<p>
											Kanchenjunga shall provide challenges to the loyal
											ex-students of JGEC to deliver lectures on their specialized
											subject on regular basis to the students of their Alma Mater.
										</p>
										<p>
											During the lean days of the year when no program, seminar,
											workshops are scheduled, specified rooms of Kanchenjunga
											shall be offered as Transit house to the ex-students during
											their holidays.
										</p>
									</div>
								</div>
							</div>
						</div>

						<hr className="border-neutral-100" />

						{/* Promoters */}
						<div>
							<div className="inline-flex items-center gap-3 mb-8">
								<div className="w-1.5 h-8 bg-primary/100 rounded-full"></div>
								<h3 className="text-neutral-900 font-extrabold uppercase text-2xl lg:text-3xl tracking-tight">Promoters</h3>
							</div>
							
							<div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-primary/10 p-8 rounded-3xl border border-primary/20">
								<Image
									src="/assets/kanchenjunga-pic-3.png"
									alt="Promoter 1"
									height={300}
									width={300}
									className="rounded-xl shadow-sm border border-white"
								/>
								<div className="text-center font-extrabold text-lg lg:text-xl text-primary px-4">
									ENGINEERING GRADUATES OF JGEC FROM 1966 – Recently Graduated Alumni
								</div>
								<Image
									src="/assets/kanchenjunga-pic-4.png"
									alt="Promoter 2"
									height={300}
									width={300}
									className="rounded-xl shadow-sm border border-white"
								/>
							</div>
						</div>

						<hr className="border-neutral-100" />

						{/* Features */}
						<div>
							<div className="inline-flex items-center gap-3 mb-8">
								<div className="w-1.5 h-8 bg-primary/100 rounded-full"></div>
								<h3 className="text-neutral-900 font-extrabold uppercase text-2xl lg:text-3xl tracking-tight">Building Features</h3>
							</div>
							<ul className="space-y-4 text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed">
								{[
									"One 1044 sq. ft. conference/ seminar hall.",
									"One 1044 sq. ft. development centre where each desk can be a work station as well.",
									"Around 300 sq. ft. discussion room for small meetings and discussions.",
									"Five/ six guest rooms for accommodation.",
									"One library & reading room.",
									"Two office room, etc in G+2 building."
								].map((feature, i) => (
									<li key={i} className="flex gap-4 items-start">
										<div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary/100 shrink-0"></div>
										<p>{feature}</p>
									</li>
								))}
							</ul>
						</div>

					</div>
				</div>

				{/* Documents Section */}
				{docsData?.response.length > 0 && (
					<div className="bg-[#f8fafc] rounded-3xl border border-neutral-100 p-8 lg:p-12 overflow-hidden shadow-sm">
						<div className="inline-flex items-center gap-3 mb-8">
							<div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
							<h3 className="text-neutral-900 font-bold uppercase text-xl lg:text-2xl tracking-tight">Documents</h3>
						</div>
						
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 max-h-[50vh] overflow-y-auto pr-2 pb-4">
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

export default Kanchenjunga;
