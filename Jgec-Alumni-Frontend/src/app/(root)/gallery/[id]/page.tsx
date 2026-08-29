"use client";
import Loading from "@/app/Loader";
import { useGetCategoryByIdQuery } from "@/store/feature/gallery-feature";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface EventParams {
	params: Promise<{ id: string }>;
}

const Page = ({ params }: EventParams) => {
	const { id } = React.use(params);
	const { data, isLoading, isError, error } = useGetCategoryByIdQuery(id);
	
	// Lightbox state
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);

	// Handle Keyboard Navigation
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (selectedIndex === -1) return;
		
		const imagesLength = data?.data?.images?.length || 0;
		if (e.key === "Escape") setSelectedIndex(-1);
		if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev + 1) % imagesLength);
		if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
	}, [selectedIndex, data]);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		// Prevent body scroll when modal is open
		if (selectedIndex !== -1) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "auto";
		};
	}, [handleKeyDown, selectedIndex]);

	if (isLoading) {
		return <Loading />;
	}

	const images = data?.data?.images || [];
	
	const handleDownload = async (url: string, filename: string) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = filename || "gallery_image.jpg";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	const nextImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	// Animation Variants
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

	return (
		<div className="bg-[#edf1f4] min-h-screen pb-24">
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
				className="lg:mt-[5.5em] mt-[5em] h-[40vh] lg:h-[45vh] overflow-hidden relative"
			>
				<Image
					layout="fill"
					objectFit="cover"
					src={images[0]?.image || "/assets/placeholder.jpg"}
					alt="Album Banner"
					className="object-cover"
				/>
				{/* Sleek Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/60 to-transparent"></div>
				
				<div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 max-w-6xl mx-auto w-full">
					<motion.h1 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md"
					>
						<span className="text-[#c4eb80]">{data?.data?.name || "Album"}</span>
					</motion.h1>
					<motion.p 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="text-base lg:text-xl text-neutral-200 font-medium max-w-xl drop-shadow-sm leading-relaxed"
					>
						Explore all the incredible moments from this event.
					</motion.p>
				</div>
			</motion.div>

			{images.length === 0 ? (
				<div className="text-center h-[40vh] flex flex-col justify-center items-center text-2xl">
					<div className="font-bold text-neutral-800">No images found</div>
					<p className="text-neutral-500 font-medium text-lg mt-2">This album is currently empty.</p>
				</div>
			) : (
				<motion.div 
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 columns-2 sm:columns-2 md:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6"
				>
					{images.map((item: any, idx: number) => (
						<motion.div
							variants={itemVariants}
							onClick={() => setSelectedIndex(idx)}
							key={item.id}
							className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-[1.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 break-inside-avoid border-4 border-white bg-neutral-200">
							<img
								loading="lazy"
								src={item.image}
								alt={`Gallery Image ${idx + 1}`}
								className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03] block"
							/>
							{/* Hover Overlay */}
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
								<div className="opacity-0 group-hover:opacity-100 bg-white/30 backdrop-blur-md p-3 rounded-full text-white transition-opacity duration-300 transform scale-90 group-hover:scale-100">
									<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Lightbox Modal */}
			<AnimatePresence>
				{selectedIndex !== -1 && (
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-[9999] bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-center"
						onClick={() => setSelectedIndex(-1)}
					>
						{/* Top bar */}
						<div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[10000] bg-gradient-to-b from-[#0f172a] to-transparent">
							<div className="font-bold bg-[#c4eb80]/20 text-[#c4eb80] border border-[#c4eb80]/30 px-5 py-2 rounded-full text-sm tracking-widest shadow-lg backdrop-blur-sm">
								{selectedIndex + 1} / {images.length}
							</div>
							<div className="flex gap-4">
								<button 
									onClick={(e) => {
										e.stopPropagation();
										handleDownload(images[selectedIndex].image, `jgec_gallery_${selectedIndex + 1}.jpg`);
									}}
									className="text-white hover:text-white transition-all p-3 bg-sky-500/40 hover:bg-sky-500 border border-sky-400/50 rounded-full shadow-lg backdrop-blur-sm hover:scale-105"
									title="Download Image"
								>
									<Download size={22} strokeWidth={2.5} />
								</button>
								<button 
									onClick={(e) => {
										e.stopPropagation();
										setSelectedIndex(-1);
									}}
									className="text-white hover:text-white transition-all p-3 bg-red-500/40 hover:bg-red-500 border border-red-400/50 rounded-full shadow-lg backdrop-blur-sm hover:scale-105"
									title="Close (Esc)"
								>
									<X size={22} strokeWidth={2.5} />
								</button>
							</div>
						</div>

						{/* Image Container */}
						<div className="relative w-full h-full flex flex-col items-center justify-center pt-20 pb-20 px-4 md:px-16 lg:px-24">
							{/* Main Image */}
							<AnimatePresence mode="wait">
								<motion.div 
									key={selectedIndex}
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.2, ease: "easeOut" }}
									className="relative max-w-full max-h-full flex-1 flex items-center justify-center z-[9999]"
									onClick={(e) => e.stopPropagation()} 
								>
									<img 
										src={images[selectedIndex].image} 
										alt={`Gallery Image ${selectedIndex + 1}`}
										className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-lg md:rounded-xl shadow-2xl ring-1 ring-white/10"
									/>
								</motion.div>
							</AnimatePresence>

							{/* Mobile Navigation controls at bottom */}
							<div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 md:hidden z-[10000]">
								<button 
									onClick={prevImage}
									className="text-white/70 hover:text-white p-3 bg-[#1e293b]/60 border border-white/10 backdrop-blur-md rounded-full transition-all shadow-xl"
								>
									<ChevronLeft size={28} />
								</button>
								<button 
									onClick={nextImage}
									className="text-white/70 hover:text-white p-3 bg-[#1e293b]/60 border border-white/10 backdrop-blur-md rounded-full transition-all shadow-xl"
								>
									<ChevronRight size={28} />
								</button>
							</div>

							{/* Desktop Navigation controls */}
							<button 
								onClick={prevImage}
								className="hidden md:flex absolute left-4 lg:left-8 text-white/70 hover:text-white p-3 lg:p-4 bg-[#1e293b]/60 hover:bg-[#c4eb80] hover:text-[#0f172a] border border-white/10 hover:border-[#c4eb80] backdrop-blur-md rounded-full transition-all hover:scale-110 z-[10000] shadow-xl"
							>
								<ChevronLeft size={32} />
							</button>
							<button 
								onClick={nextImage}
								className="hidden md:flex absolute right-4 lg:right-8 text-white/70 hover:text-white p-3 lg:p-4 bg-[#1e293b]/60 hover:bg-[#c4eb80] hover:text-[#0f172a] border border-white/10 hover:border-[#c4eb80] backdrop-blur-md rounded-full transition-all hover:scale-110 z-[10000] shadow-xl"
							>
								<ChevronRight size={32} />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Page;
