import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight, MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { FaRegCopyright } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const socialIcons = [
	{
		icon: <FaFacebookF size={18} />,
		link: 'https://www.facebook.com/groups/communicationcell.jgec/',
		label: 'Facebook'
	},
	{
		icon: <FaLinkedinIn size={18} />,
		link: 'https://www.linkedin.com/company/jgecaa/',
		label: 'LinkedIn'
	},
	{
		icon: <FaYoutube size={18} />,
		link: '',
		label: 'YouTube'
	},
	{
		icon: <FaInstagram size={18} />,
		link: '',
		label: 'Instagram'
	},
	{
		icon: <FaWhatsapp size={18} />,
		link: '',
		label: 'WhatsApp'
	}
]

const Footer: React.FC = () => {
	return (
		<footer className="w-full h-auto bg-gradient-to-b from-[#0B1120] to-[#020617] pt-10 pb-4 relative overflow-hidden border-t border-slate-800/80">
			{/* Subtle background glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
			
			<div className="w-full pb-8 max-w-screen-xl px-4 md:px-10 xl:px-0 mx-auto text-slate-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative z-10">
				
				{/* Brand Section */}
				<div className="flex flex-col w-full gap-4">
					<div className="bg-white/5 p-3 rounded-xl w-fit backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors duration-300">
						<Image
							src="/Logo.webp"
							width={90}
							height={90}
							alt="JGEC Alumni Logo"
							className="drop-shadow-lg"
						/>
					</div>
					<div className="text-sm text-slate-400 font-medium tracking-wide space-y-1">
						<p className="text-white text-base font-semibold">THE JALPAIGURI</p>
						<p>GOVT. ENGG. COLLEGE ALUMNI</p>
						<p>ASSOCIATION, JALPAIGURI.</p>
					</div>
				</div>
				
				{/* Useful Links */}
				<div className="flex flex-col">
					<h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
						<span className="w-6 h-1 bg-primary rounded-full"></span>
						Useful Links
					</h2>
					<div className="flex flex-col gap-3">
						{[
							{ name: 'Home', path: '/' },
							{ name: 'Constitution', path: '/assets/constitution_of_AA.pdf' },
							{ name: 'Take a Trip', path: '/take-a-trip' },
							{ name: 'Upcoming Events', path: '/upcoming-events' }
						].map((link, idx) => (
							<Link key={idx} href={link.path} className="group flex items-center hover:text-white transition-all duration-300 w-fit">
								<MdOutlineKeyboardArrowRight className="text-primary group-hover:translate-x-1 transition-transform duration-300" size={20} /> 
								<span className="ml-1 group-hover:ml-2 transition-all duration-300">{link.name}</span>
							</Link>
						))}
					</div>
				</div>
				
				{/* Policies */}
				<div className="flex flex-col">
					<h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
						<span className="w-6 h-1 bg-primary rounded-full"></span>
						Policies
					</h2>
					<div className="flex flex-col gap-3">
						{[
							{ name: 'Privacy Policy' },
							{ name: 'Terms & Conditions' }
						].map((policy, idx) => (
							<div key={idx} className="group flex items-center hover:text-white transition-all duration-300 cursor-pointer w-fit">
								<MdOutlineKeyboardArrowRight className="text-primary group-hover:translate-x-1 transition-transform duration-300" size={20} /> 
								<span className="ml-1 group-hover:ml-2 transition-all duration-300">{policy.name}</span>
							</div>
						))}
					</div>
				</div>
				
				{/* Contact Info */}
				<div className="flex flex-col gap-4 w-full">
					<h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
						<span className="w-6 h-1 bg-primary rounded-full"></span>
						Get In Touch
					</h2>
					
					<div className="flex items-start gap-3 text-sm text-slate-400 group cursor-default">
						<div className="mt-1 p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
							<MdLocationOn size={20} />
						</div>
						<p className="leading-relaxed">
							Jalpaiguri Government Engineering College Campus, P.O.: Denguajhar<br/>
							Dist.: Jalpaiguri West Bengal - 735102, India.
						</p>
					</div>

					<div className="flex flex-col gap-3 text-sm mt-2">
						<div className="flex items-center gap-3 text-slate-400 group">
							<div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
								<MdPhone size={18} />
							</div>
							<span className="group-hover:text-white transition-colors">+91 7439428480</span>
						</div>
						<div className="flex items-center gap-3 text-slate-400 group">
							<div className="p-2 rounded-lg bg-white/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
								<MdEmail size={18} />
							</div>
							<span className="group-hover:text-white transition-colors">jgecalum@gmail.com</span>
						</div>
					</div>

					<div className="flex mt-4 gap-3">
						{socialIcons.map((ele, i) => (
							<Link 
								key={i} 
								href={ele.link} 
								target="_blank" 
								aria-label={ele.label}
								className="h-10 w-10 rounded-full bg-white/5 hover:bg-primary text-slate-300 hover:text-white flex justify-center items-center hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 border border-white/10 hover:border-transparent"
							>
								{ele.icon}
							</Link>
						))}
					</div>
				</div>
			</div>

			{/* Copyright Banner */}
			<div className="relative z-10 w-full border-t border-slate-800/60 pt-4 mt-2">
				<div className="max-w-screen-xl mx-auto px-4 md:px-10 xl:px-0 flex flex-col md:flex-row items-center justify-between gap-4 text-xs lg:text-sm text-slate-500">
					<div className="flex items-center gap-2">
						<FaRegCopyright />
						<span>{new Date().getFullYear()} JGEC Alumni Association. All Rights Reserved.</span>
					</div>
					<div className="flex items-center gap-4">
						<span className="hover:text-slate-300 cursor-pointer transition-colors">Designed by JGEC Alumni Web Team</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
