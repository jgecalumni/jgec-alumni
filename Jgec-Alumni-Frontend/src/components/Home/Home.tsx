"use client";
import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
import { useAllScholarshipsQuery } from "@/store/feature/scholarship-feature";
import Loading from "@/app/Loader";
const Home: React.FC = () => {
	const { data, error, isError, isLoading } = useAllScholarshipsQuery({
		page: 1,
		search: "",
	});
	if (isLoading) return <Loading />;
	return (
		<>
			<div className="w-full">
				{/* <div className="text-neutral-950  flex justify-center  relative h-[30vh] xs:h-[50vh] md:h-[60vh] lg:h-[70vh] lg:mt-[8em] mt-[6em] ">
					<Swiper
						direction={"vertical"}
						pagination={{
							clickable: false,
						}}
						loop={true}
						autoplay={{
							delay: 5000,
							disableOnInteraction: true,
						}}
						modules={[Pagination, Autoplay]}
						className="mySwiper">
						{[0, 1, 2].map((ele) => (
							<SwiperSlide key={ele}>
								<div className="h-full relative w-full">
									<div className="absolute z-20 rotate-0 h-full  flex flex-col gap-4 lg:gap-10 justify-center max-w-xs xs:max-w-sm sm:max-w-xl  w-full left-[1em]  lg:left-[13.5em]">
										<div className="text-yellow-400 text-left font-medium lg:text-3xl sm:text-xl text-base">
											<h1 className="text-wrap break-words">
												The Jalpaiguri Government Engineering College Alumini
												Association, Jalpaiguri
											</h1>
										</div>
										<div className="flex gap-8">
											<Link href="/vision-mission">
												<Button className="lg:text-base text-white lg:p-3 lg:px-5  p-2">
													Our Mission
												</Button>
											</Link>
											<Link href="/upcoming-events">
												<Button className="lg:text-base bg-white text-neutral-950 lg:p-3 lg:px-5  p-2 hover:bg-slate-100">
													Upcoming Events
												</Button>
											</Link>
										</div>
									</div>
									<Image
										src="/assets/Banner.png"
										alt="slide-1"
										width={1000}
										height={300}
										className="w-full h-full object-cover"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div> */}

				<div className="w-full bg-white py-16 md:py-24 px-4 md:px-10 flex justify-center items-center">
					<div className="max-w-6xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
						{/* Image Section */}
						<div className="w-full max-w-sm lg:w-1/3 shrink-0 relative group mx-auto lg:mx-0">
							<div className="absolute inset-0 bg-[#c4eb80]/40 rounded-3xl transform translate-x-3 translate-y-3 -z-10 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"></div>
							<div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-neutral-100 bg-white">
								<Image
									src="/assets/Members/BhaskarDasgupta.jpg"
									alt="President Bhaskar Dasgupta"
									width={400}
									height={500}
									className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
								/>
							</div>
						</div>

						{/* Text Section */}
						<div className="text-center lg:text-left flex-1 lg:pt-4">
							<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 shadow-sm">
								Message from the President
							</div>
							
							<div className="text-justify  text-[15px] lg:text-[16px] text-neutral-600 space-y-5 leading-relaxed font-medium">
								<p className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">Dear Alumni and Friends,</p>
								<p>
									It is an honor to welcome you to the official website of the
									Jalpaiguri Government Engineering College Alumni Association.
									Our alma mater has been a pillar of excellence, shaping
									engineers who have made a mark across industries and
									continents. As proud alumni, we carry forward its legacy,
									strengthening bonds and creating opportunities for the
									generations to come.
								</p>
								<p>
									Through this platform, we aim to foster connections, celebrate
									achievements, and extend support to both our fellow alumni and
									the budding engineers of JGEC. Whether it’s professional
									networking, mentorship, or collaborative initiatives, your
									involvement makes a difference.
								</p>
								<p>
									Let us continue to uphold the values of our college and
									contribute to its growth. Together, we can inspire, innovate,
									and make a lasting impact.
								</p>
							</div>
							<div className="mt-10 border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
								<div className="text-center lg:text-left space-y-1">
									<p className="text-neutral-500 italic text-sm">With warm regards,</p>
									<p className="font-bold text-lg text-neutral-900">Bhaskar Dasgupta, 1983</p>
									<p className="text-primary font-semibold text-sm uppercase tracking-wider mt-1">
										President, JGEC Alumni Association
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* <div className="w-full  h-auto px-4 md:px-10">
					<div className="w-full h-auto lg:h-80 mt-10 mb-6  sm:-mt-16 rounded-md flex max-w-4xl mx-auto  justify-center  items-center p-4 pr-0 max-sm:pt-6 md:p-8 md:pb-4 md:pr-4 z-10  bg-primary relative">
						<div className="bg-white absolute rounded-full -top-5 right-5 px-4 py-2 text-sm font-semibold shadow-md border border-neutral-200">
							Scholarship
						</div>
						<div className="w-full h-full relative ">
							<Swiper
								slidesPerView={1}
								spaceBetween={30}
								loop={true}
								pagination={{
									clickable: false,
								}}
								// navigation={true}
								modules={[Navigation]}
								className="mySwiper">
								{data?.scholarships.map((ele: any, index: number) => (
									<SwiperSlide key={index}>
										<div className="w-full h-full flex flex-col lg:flex-row gap-6 pb-4 pr-4 ">
											<div className="h-auto sm:h-60 w-full lg:w-1/2 lg:h-full">
												<Image
													src={ele.providerImage}
													alt={ele.providerName}
													width={150}
													height={150}
													className="w-full h-full !object-contain lg:!object-cover rounded-sm"
												/>
											</div>
											<div className="flex flex-col justify-start  gap-6  w-full text-white lg:pt-8">
												<div className="text-base md:text-lg lg:text-xl uppercase font-medium w-full text-center">
													{ele.name}
												</div>
												<div className="flex flex-col text-[14px] lg:text-[18px] md:text-base justify-center items-center text-slate-200 gap-2">
													{ele.subtitle}
												</div>
											</div>
										</div>
									</SwiperSlide>
								))}
								<SwiperButtons />
							</Swiper>
						</div>
					</div>
				</div> */}
				<div className="bg-primary p-4 h-auto w-full flex items-center justify-center relative overflow-hidden py-12 md:py-20">
					<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
					<div className="w-full max-w-6xl h-full mx-auto relative z-10">
						<div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
							<h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Featured Scholarships</h2>
							<p className="text-white/90 font-medium mt-4 text-[15px] md:text-lg leading-relaxed">
								Empowering the next generation of engineers. The JGEC Alumni Association is proud to support our brightest minds through various scholarship programs funded by our generous alumni network.
							</p>
						</div>
						<Swiper
							slidesPerView={1}
							spaceBetween={30}
							loop={true}
							pagination={{ clickable: false }}
							autoplay={{ delay: 5000, disableOnInteraction: false }}
							modules={[Navigation, Autoplay]}
							className="mySwiper px-4 pb-16">
							{data?.scholarships.map((ele: any, index: number) => (
								<SwiperSlide key={index} className="pt-2 pb-8 px-4">
									<div className="w-full bg-white/10 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 md:p-10 transform hover:-translate-y-1 hover:bg-white/15 transition-all duration-300 mx-auto max-w-4xl">
										{/* Logo */}
										<div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden p-3 border-4 border-white/20">
											<Image
												src={ele.providerImage}
												alt={ele.providerName}
												width={128}
												height={128}
												className="w-full h-full object-contain"
											/>
										</div>
										{/* Content */}
										<div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 gap-3 text-white">
											<div className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
												Scholarship Program
											</div>
											<h3 className="text-xl md:text-3xl font-bold leading-snug drop-shadow-sm">
												{ele.name}
											</h3>
											<p className="font-medium text-white/90 text-sm md:text-base">
												Sponsored by <span className="font-bold text-white">{ele.providerName}</span>
											</p>
											<p className="text-[14px] md:text-[16px] text-white leading-relaxed max-w-2xl mt-1">
												{ele.subtitle}
											</p>
										</div>
									</div>
								</SwiperSlide>
							))}
							<SwiperButtons />
						</Swiper>
					</div>
				</div>
			</div>
		</>
	);
};

const SwiperButtons = () => {
	const swiper = useSwiper();
	return (
		<div className="flex  justify-end items-center gap-2 sm:absolute bottom-0 right-4 sm:right-0 z-50 pe-4">
			<button
				onClick={() => swiper.slidePrev()}
				className="bg-[#5580ff] hover:bg-primary transition-colors ease-linear duration-300 text-white p-3 text-lg rounded-full">
				<FaChevronLeft />
			</button>

			<button
				onClick={() => swiper.slideNext()}
				className="bg-[#5580ff] hover:bg-primary transition-colors ease-linear duration-300 text-white p-3 text-lg rounded-full ">
				<FaChevronRight />
			</button>
		</div>
	);
};

export default Home;
