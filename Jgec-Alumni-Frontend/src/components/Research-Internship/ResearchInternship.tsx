"use client";

import Image from "next/image";
import React from "react";

const Career = [
	{
		name: "Urgently Need Five Data Center Specialist",
		description:
			"Claritas est etiam procsus dymicus, qui sequitur mutationem Claritas est etiam procsus est etiam procsus dymicus.",
		imageUrl: "/assets/company-logo.png",
		active: false,
	},
	{
		name: "Urgently Need Five Data Center Specialist",
		description:
			"Claritas est etiam procsus dymicus, qui sequitur mutationem Claritas est etiam procsus est etiam procsus dymicus.",
		imageUrl: "/assets/company-logo.png",
		active: true,
	},
	{
		name: "Urgently Need Five Data Center Specialist",
		description:
			"Claritas est etiam procsus dymicus, qui sequitur mutationem Claritas est etiam procsus est etiam procsus dymicus.",
		imageUrl: "/assets/company-logo.png",
		active: true,
	},
	{
		name: "Urgently Need Five Data Center Specialist",
		description:
			"Claritas est etiam procsus dymicus, qui sequitur mutationem Claritas est etiam procsus est etiam procsus dymicus.",
		imageUrl: "/assets/company-logo.png",
		active: true,
	},
	{
		name: "Urgently Need Five Data Center Specialist",
		description:
			"Claritas est etiam procsus dymicus, qui sequitur mutationem Claritas est etiam procsus est etiam procsus dymicus.",
		imageUrl: "/assets/company-logo.png",
		active: true,
	},
];

const ResearchInternship: React.FC = () => {
	return (
		<div>
			<div className="lg:mt-[8em] w-full   mt-[6em] h-[50vh] lg:h-[60vh] overflow-hidden  ">
				<div className="h-full flex justify-center items-center bg-[#3a60c8]  rotate-0 w-full">
					<Image
						loading="lazy"
						width={800}
						height={800}
						src="/assets/careerbg.webp"
						alt=""
						className=""
					/>
				</div>
			</div>
			<div className="flex flex-col justify-center  bg-[#ecf0f4] items-center p-4">
				<div className="flex flex-col  py-4 justify-center items-center gap-1">
					<h2 className="text-center  text-2xl lg:text-4xl font-medium">
						Research and Internship
					</h2>
					<div className="w-1/2 border border-primary/100"></div>
				</div>
				<div className="grid gap-4 py-4 lg:p-14 md:px-4 justify-center items-center sm:grid-cols-2 lg:grid-cols-3">
					{Career.map((career, index) => (
						<div
							key={career.name}
							className="flex p-4 gap-8 bg-white rounded-[0.4rem] hover:-translate-y-3 duration-200  h-[55vh]  flex-col items-center justify-center">
							<Image
								src={career.imageUrl}
								alt={career.name}
								height={60}
								width={60}
							/>
							<h3 className="text-lg text-center font-semibold">
								{career.name}
							</h3>
							<p className="text-center text-sm px-3">{career.description}</p>
							{career.active ? (
								<button className=" p-4 px-6 mt-4 hover:bg-black duration-200 bg-green-400 font-medium text-lg text-white">
									Apply Now
								</button>
							) : (
								<button
									disabled
									className=" p-3 px-8 mt-4 border-2 border-[#7f7f80] text-[#7f7f80] font-medium text-lg ">
									Expired
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ResearchInternship;
