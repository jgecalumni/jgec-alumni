"use client";

import Image from "next/image";
import React from "react";
import { Presentation, Video, GraduationCap, Lightbulb, Building2, Award, Users, HeartHandshake, BookOpen, Briefcase, ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

const Takeatrip = () => {
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

	const activities = [
		{ 
			title: "Seminar & Workshops", 
			icon: <Presentation className="text-blue-500" size={28} />, 
			desc: "Regular seminars and workshops at Campus with Respected Alumnus and senior industry leaders visiting to guide students." 
		},
		{ 
			title: "Webinars", 
			icon: <Video className="text-indigo-500" size={28} />, 
			desc: "Online webinars led by alumni, alongside comprehensive Industry Meets connecting current students with professionals globally." 
		},
		{ 
			title: "Scholarship Program", 
			icon: <GraduationCap className="text-emerald-500" size={28} />, 
			desc: "Started in 2013, connecting students with campus through financial aid and face-to-face mentorship. (31 schemes benefiting 56 students in 2024)." 
		},
		{ 
			title: "Innovation Challenge", 
			icon: <Lightbulb className="text-amber-500" size={28} />, 
			desc: "Initiated in 2016 to encourage innovation and nurture young talents to showcase mathematical and physical models." 
		},
		{ 
			title: "Kanchenjunga", 
			icon: <Building2 className="text-rose-500" size={28} />, 
			desc: "A G+2 state-of-the-art convention center built by alumni to enhance Brand JGEC, featuring classrooms, conference halls, and guest rooms." 
		},
		{ 
			title: "Brand JGEC", 
			icon: <Award className="text-purple-500" size={28} />, 
			desc: "Supporting JGEC in audits, NAAC accreditation, media coverage, and green initiatives like Rain Water Harvesting." 
		},
		{ 
			title: "Social Platform", 
			icon: <Users className="text-cyan-500" size={28} />, 
			desc: "A centralized social platform for COVID-19 response, verifying alumni for jobs, and keeping the entire fraternity connected." 
		},
	];

	const milestones = [
		{ date: "April 2010", title: "Journey Begins", desc: "Alumni Association Journey Began At JGEC Campus." },
		{ date: "December 2011", title: "First Seminar", desc: "First National Level Seminar Organized at Campus." },
		{ date: "March 2012", title: "Statue Inauguration", desc: "Inauguration of statue of Prof. N. C. Bose, Respected Founder Principal of JGEC." },
		{ date: "August 2013", title: "Scholarship Launch", desc: "Launch of Scholarship Program to support students financially." },
		{ date: "January 2014", title: "Kanchenjunga Land", desc: "Purchased private land inside campus for Kanchenjunga." },
		{ date: "August 2016", title: "Golden Jubilee", desc: "Inauguration of Annexed Facility and Celebration of Golden Jubilee of 1st Batch." },
		{ date: "July 2018", title: "Welcome Sessions", desc: "Beginning of Experience Sharing Welcome Sessions with the first-year students." },
		{ date: "December 2020", title: "Phase-I Complete", desc: "Completion of Ground Floor of Kanchenjunga." },
	];

	const reasons = [
		{ 
			title: "Strategic Asset", 
			icon: <Building2 size={24} className="text-blue-500" />,
			desc: "Alumni are a reflection of an institution's past, representation of its present, and a link to its future. Centralized platforms harness the power of alumni networks." 
		},
		{ 
			title: "Most Loyal Ambassador", 
			icon: <HeartHandshake size={24} className="text-rose-500" />,
			desc: "Alumnus create a powerful positive impact on the campus as they are the most loyal ambassadors of the institution." 
		},
		{ 
			title: "Support System", 
			icon: <Users size={24} className="text-indigo-500" />,
			desc: "Engaged networks benefit the University through skills, support to students, and invaluable marketing across personal and professional networks." 
		},
		{ 
			title: "Offering Expertise", 
			icon: <BookOpen size={24} className="text-emerald-500" />,
			desc: "Alumni share a wealth of experience, skills, and practically support students in work placements to help them launch their careers." 
		},
		{ 
			title: "Mentorship", 
			icon: <GraduationCap size={24} className="text-amber-500" />,
			desc: "Active roles in voluntary programs to mentor students in their areas of expertise through 'Bridging the Gap' and 'Innovation Challenge'." 
		},
		{ 
			title: "Assistance in Employability", 
			icon: <Briefcase size={24} className="text-cyan-500" />,
			desc: "While not a placement agency, the alumni network connects students to vast opportunities and offers crucial career support in a tough job market." 
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
					alt="Take a Trip"
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
							Take a <span className="text-white">Trip</span>
						</h1>
						<p className="text-base md:text-lg lg:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed drop-shadow-md">
							A brief introduction to the journey, impact, and activities of the Jalpaiguri Government Engineering College Alumni Association.
						</p>
					</motion.div>
				</div>
			</motion.div>

			{/* Main Content Area */}
			<div className="w-full max-w-7xl mx-auto px-6  mt-12 relative z-20 flex flex-col gap-20">
				
				{/* Activities / Verticals */}
				<div className="flex flex-col gap-8">
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center max-w-4xl mx-auto"
					>
						<div className="inline-block bg-blue-100 text-blue-700 font-bold px-4 py-1 rounded-full text-xs mb-4">
							Bridging The Gap
						</div>
						<h2 className="text-2xl lg:text-3xl font-extrabold text-primary leading-tight mb-4 uppercase">
							Alumni Association Activities
						</h2>
						<p className="text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
							Since its registration in 2010, the JGEC Alumni Association has established multiple verticals to support the Alma Mater and society.
						</p>
					</motion.div>

					<motion.div 
						variants={containerVariants}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true, margin: "-50px" }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						{activities.map((activity, idx) => (
							<motion.div 
								variants={itemVariants}
								key={idx}
								className="bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-neutral-100 flex flex-col gap-4"
							>
								<div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner mb-1">
									{activity.icon}
								</div>
								<h3 className="text-lg font-bold text-slate-800">
									{activity.title}
								</h3>
								<p className="text-sm text-slate-600 leading-relaxed flex-grow">
									{activity.desc}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>

				{/* Milestones Timeline */}
				<div className="flex flex-col gap-10 bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-neutral-200">
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center max-w-3xl mx-auto"
					>
						<h2 className="text-2xl lg:text-3xl font-extrabold text-primary leading-tight mb-4 uppercase">
							Major Milestones
						</h2>
						<p className="text-base text-slate-600 leading-relaxed font-medium">
							A chronological journey of our most impactful moments at the JGEC Campus.
						</p>
					</motion.div>

					<div className="relative max-w-4xl mx-auto w-full">
						{/* Vertical Line */}
						<div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 transform md:-translate-x-1/2 rounded-full"></div>

						<div className="flex flex-col gap-8 lg:gap-12 relative z-10">
							{milestones.map((milestone, idx) => {
								const isEven = idx % 2 === 0;
								return (
									<motion.div 
										key={idx}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, margin: "-50px" }}
										transition={{ delay: idx * 0.1 }}
										className={`flex flex-col md:flex-row items-start md:items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
									>
										<div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-start pl-12 md:pl-8' : 'md:justify-end pl-12 md:pr-8'} pb-4 md:pb-0`}>
											<div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow w-full lg:max-w-sm">
												<div className="text-sm font-bold text-blue-600 mb-1">{milestone.date}</div>
												<h4 className="text-lg font-bold text-slate-800 mb-2">{milestone.title}</h4>
												<p className="text-sm text-slate-600">{milestone.desc}</p>
											</div>
										</div>
										
										{/* Center Dot */}
										<div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm mt-6 md:mt-0"></div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Where Shall I Study Section */}
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-50px" }}
					className="bg-primary text-white rounded-[2rem] p-8 lg:p-12 shadow-xl relative overflow-hidden"
				>
					{/* Decorative Elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
					<div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

					<div className="relative z-10 flex flex-col gap-10">
						<div className="text-center max-w-3xl mx-auto">
							<h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-4 uppercase">
								Where Shall I Study?
							</h2>
							<p className="text-base lg:text-lg text-blue-100 leading-relaxed">
								Why the Alumni Connection is a strategic asset for prospective students deciding on their future institution.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{reasons.map((reason, idx) => (
								<motion.div 
									variants={itemVariants}
									key={idx}
									className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[1.5rem] hover:bg-white/15 transition-colors flex flex-col gap-3"
								>
									<div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white mb-2">
										{reason.icon}
									</div>
									<h3 className="text-lg font-bold text-white">
										{reason.title}
									</h3>
									<p className="text-sm text-blue-50 leading-relaxed">
										{reason.desc}
									</p>
								</motion.div>
							))}
						</div>

						<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center mt-4">
							<p className="text-sm text-blue-100 mb-2">Best Regards from</p>
							<p className="text-lg font-bold text-white mb-1">THE JGEC ALUMNI ASSOCIATION</p>
							<p className="text-xs text-blue-200 mb-3">JGEC Campus, Jalpaiguri, WB, India</p>
							<div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold text-white tracking-wide">
								Driven by Gratitude, Bonded with Nostalgia
							</div>
						</div>
					</div>
				</motion.div>

			</div>
		</div>
	);
};

export default Takeatrip;
