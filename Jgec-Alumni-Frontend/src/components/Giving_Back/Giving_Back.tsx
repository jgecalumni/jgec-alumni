"use client";

import Image from "next/image";
import React from "react";
import { Download, Eye, Building2, Users, Leaf, BedDouble, Mic, Lightbulb, MapPin, Target } from "lucide-react";
import Link from "next/link";
import { useGetAllGivingBackDocsQuery } from "@/store/feature/document-feature";
import Loading from "@/app/Loader";
import { motion, Variants } from "framer-motion";

const Giving_Back = () => {
	const {
		data: docsData,
		isLoading: docsLoading,
		isError: docsisError,
		error: docsError,
		refetch,
	} = useGetAllGivingBackDocsQuery({});

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
			transition: { staggerChildren: 0.1 }
		}
	};
	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
	};

	const features = [
		{
			icon: <MapPin className="text-blue-500" size={32} />,
			title: "Jalpaiguri, West Bengal",
			description: "In a testament to alumni spirit, the Jalpaiguri Government Engineering College (JGEC) Alumni Association has constructed a unique facility named \"Kanchenjunga\" on campus. This three-story building serves a dual purpose: a convention center fostering industry-academia interaction and a guest house offering affordable accommodation."
		},
		{
			icon: <Building2 className="text-blue-600" size={32} />,
			title: "A Dream Realized by Dedicated Alumni",
			description: "The project is the brainchild of Alumni Association. Notably, the land for the project was a private plot within the campus, purchased by the Alumni Association with the generous financial support of another alumnus, Mr. Premangshu Ghosh'79'."
		},
		{
			icon: <Users className="text-purple-500" size={32} />,
			title: "Beyond Bricks and Mortar",
			description: "A Platform for Growth: Kanchenjunga transcends its physical structure. The center will host diverse extracurricular activities and soft skill development programs for engineering students. Jyoti, an educational center for underprivileged children run by JGEC students, is already utilizing Kanchenjunga."
		},
		{
			icon: <Leaf className="text-blue-400" size={32} />,
			title: "Giving Back & Sustainability",
			description: "During the COVID-19 pandemic, Kanchenjunga supported 55 underprivileged families. Furthermore, the Alumni Association initiated a research-based composting program utilizing food waste from hostels, actively engaging students and promoting sustainable practices."
		},
		{
			icon: <BedDouble className="text-amber-500" size={32} />,
			title: "Affordable Comfort for Visitors",
			description: "Seven well-appointed guest rooms with air conditioning are operational. They provide a comfortable, affordable stay for visitors including guardians of current students (around Rs. 1,000/night with waivers for economically disadvantaged backgrounds)."
		},
		{
			icon: <Mic className="text-rose-500" size={32} />,
			title: "A State-of-the-Art Conference Hub",
			description: "The Alumni Association has ambitious plans to raise donations from ex-students to create a modern conference hall within the facility. This hall can be booked by local businesses and industries for workshops, seminars, and events, fostering stronger industry-academia collaboration."
		}
	];

	return (
		<div className="bg-[#edf1f4] min-h-screen pb-24 font-sans">
			{/* Cinematic Hero Section */}
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
				className="lg:mt-[5.5em] mt-[5em] h-[40vh] lg:h-[50vh] overflow-hidden relative z-10"
			>
				<Image
					loading="lazy"
					layout="fill"
					objectFit="cover"
					src="/assets/membership.jpg"
					alt="Giving Back"
					className="object-cover blur-[2px] opacity-70 scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/70 to-transparent"></div>
				
				<div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 lg:px-20 max-w-5xl mx-auto w-full">
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}
						className="flex flex-col items-center gap-4"
					>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-400 tracking-tight drop-shadow-2xl">
							Giving <span className="text-white">Back</span>
						</h1>
						<p className="text-base md:text-lg lg:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed drop-shadow-md">
							What can you donate to your alma mater? Empower the next generation and strengthen our community.
						</p>
					</motion.div>
				</div>
			</motion.div>

			{/* Main Content Area */}
			<div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mt-12 relative z-20 flex flex-col gap-12">
				
				{/* Kanchenjunga Spotlight */}
				<div className="flex flex-col gap-8">
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center max-w-4xl mx-auto"
					>
						<div className="inline-block bg-blue-100 text-blue-700 font-bold px-4 py-1 rounded-full text-xs mb-4">
							Our Pride
						</div>
						<h2 className="text-2xl lg:text-3xl font-extrabold text-primary leading-tight mb-4">
							Multipurpose "Kanchenjunga"
						</h2>
						<p className="text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
							A hub for learning, collaboration, and community. Built by the Alumni Association to enrich the lives of students and serve as a beacon of opportunity in North Bengal.
						</p>
					</motion.div>

					<motion.div 
						variants={containerVariants}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true, margin: "-50px" }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{features.map((feature, idx) => (
							<motion.div 
								variants={itemVariants}
								key={idx}
								className="bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-neutral-100 flex flex-col gap-4"
							>
								<div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner mb-1">
									{feature.icon}
								</div>
								<h3 className="text-lg font-bold text-slate-800">
									{feature.title}
								</h3>
								<p className="text-sm text-slate-600 leading-relaxed flex-grow">
									{feature.description}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>

				{/* History & Purpose Section */}
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-50px" }}
					className="bg-primary text-white rounded-[1.5rem] p-6 lg:p-12 shadow-xl relative overflow-hidden"
				>
					{/* Decorative Elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
					<div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

					<div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16">
						<div className="lg:w-1/3 flex flex-col gap-4">
							<div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md mb-2">
								<Lightbulb size={24} className="text-blue-200" />
							</div>
							<h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
								The Vision That Started It All
							</h2>
							<div className="w-16 h-1 bg-blue-300 rounded-full mt-1"></div>
						</div>
						
						<div className="lg:w-2/3 flex flex-col gap-6 text-slate-200 text-base leading-relaxed">
							<p>
								About 14 years ago, when the Alumni Association at the JGEC campus was at its forming stage, there was no visibility into how impactful it would be. While there were official procedures, this type of organization becomes successful only through the active participation of the right stakeholders.
							</p>

							<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 lg:p-6">
								<h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
									<Target size={20} />
									Our Clear Purpose
								</h3>
								<ul className="space-y-3">
									{[
										"Reconnect all the ex-students with the campus.",
										"Perform student-centric activities at JGEC Campus to support the maximum number of present students.",
										"Create a platform where all different JGEC groups get a 'home' at the campus and can function together at their own pace."
									].map((item, i) => (
										<li key={i} className="flex gap-3 items-start">
											<div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs mt-0.5">
												{i + 1}
											</div>
											<span className="font-medium text-sm">{item}</span>
										</li>
									))}
								</ul>
							</div>

							<p>
								The biggest challenge was raising awareness among ex-students scattered across the globe. The Alumni Association decided to utilize digital platforms to their fullest potential. Even in the early days of social media (2011), the foresight to use digital media—including blogs and emerging social networks—helped reintegrate countless alumni with their beloved campus.
							</p>
						</div>
					</div>
				</motion.div>

				{/* Documents Section (Moved to bottom & simplified) */}
				{docsData?.response?.length > 0 && (
					<motion.div 
						variants={containerVariants}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true, margin: "-50px" }}
						className="bg-white rounded-[1.5rem] shadow-sm border border-neutral-200 p-6 lg:p-10"
					>
						<div className="flex items-center gap-4 mb-6">
							<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
								<Download size={20} />
							</div>
							<h2 className="text-xl lg:text-2xl font-bold text-primary">
								Important Documents
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{docsData?.response.map((item: any) => (
								<motion.div
									variants={itemVariants}
									key={item.title}
									className="group flex items-center justify-between bg-slate-50 border border-slate-200 hover:border-primary/30 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
								>
									<div className="flex items-center gap-3 overflow-hidden pr-2">
										<Image 
											src="/assets/pdf.png" 
											width={32} 
											height={32} 
											alt="PDF" 
											className="flex-shrink-0" 
										/>
										<div className="text-sm font-semibold text-slate-700 line-clamp-2" title={item.title}>
											{item.title}
										</div>
									</div>
									
									<div className="flex items-center gap-1 flex-shrink-0">
										<Link
											href={item.link}
											target="_blank"
											className="p-2 text-slate-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
											title="View Document"
										>
											<Eye size={18} />
										</Link>
										<button
											onClick={() => handleDownload(item.link, `${item.title}.pdf`)}
											className="p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors"
											title="Download PDF"
										>
											<Download size={18} />
										</button>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}

			</div>
		</div>
	);
};

export default Giving_Back;
