"use client";
import Loading from "@/app/Loader";
import { useGetCategoryQuery } from "@/store/feature/gallery-feature";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect } from "react";
import toast from "react-hot-toast";

const photos = [
	{
		id: 1,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
	},
	{
		id: 2,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
	},
	{
		id: 3,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
	},
	{
		id: 4,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
	},
	{
		id: 5,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
	},
	{
		id: 6,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
	},
	{
		id: 7,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
	},
	{
		id: 8,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
	},
	{
		id: 9,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
	},
	{
		id: 10,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
	},
	{
		id: 11,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg",
	},
	{
		id: 12,
		url: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg",
	},
];

const MasonryGallery = () => {
	const { data, isLoading, isError, error } = useGetCategoryQuery({});
	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch events");
		}
	}, [isError, error]);
	if (isLoading) {
		return <Loading />;
	}
	return (
		<>
			<div className="lg:mt-[5.5em] mt-[5em] h-[40vh] lg:h-[45vh] overflow-hidden relative">
				<Image
					layout="fill"
					objectFit="cover"
					src="/assets/membership.jpg"
					alt="Gallery Banner"
					className="object-cover"
				/>
				{/* Sleek Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/60 to-transparent"></div>
				
				<div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 max-w-6xl mx-auto w-full">
					<h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
						<span className="text-[#c4eb80]">Photo</span> Gallery
					</h1>
					<p className="text-base lg:text-xl text-neutral-200 font-medium max-w-xl drop-shadow-sm leading-relaxed">
						Explore the moments, events, and memories that bring our alumni community together.
					</p>
				</div>
			</div>
			
			<div className="bg-[#edf1f4] min-h-[50vh]">
				{data?.data.length === 0 ? (
					<div className="flex flex-col justify-center items-center h-[40vh] gap-4">
						<div className="text-2xl font-bold text-neutral-800">No Albums Found</div>
						<p className="text-neutral-500 font-medium">Check back later for newly published photo albums.</p>
					</div>
				) : (
					<div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{data?.data.map((item: any) => (
							<Link
								href={`/gallery/${item.id}`}
								key={item.id}
								className="group relative flex flex-col justify-end h-[35vh] lg:h-[40vh] rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-4 border-white">
								
								{/* Image with smooth zoom effect */}
								<Image
									layout="fill"
									objectFit="cover"
									src={item?.images?.[0]?.image || "/assets/placeholder.jpg"}
									alt={item.name}
									className="object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								
								{/* Clean Bottom Gradient for readable text */}
								<div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
								
								{/* Content (Anchored to bottom-left) */}
								<div className="relative z-10 p-6 lg:p-8 w-full flex flex-col gap-3">
									<h2 className="text-white text-2xl lg:text-3xl font-extrabold leading-tight group-hover:text-[#c4eb80] transition-colors duration-300 line-clamp-2">
										{item.name}
									</h2>
									<div className="flex items-center gap-2 text-xs lg:text-sm font-bold text-neutral-300 group-hover:text-white transition-colors duration-300 uppercase tracking-widest mt-1">
										<span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-md">View Album</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default MasonryGallery;
