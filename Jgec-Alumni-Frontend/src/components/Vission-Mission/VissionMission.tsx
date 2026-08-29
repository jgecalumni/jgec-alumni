import Image from "next/image";
import AnimatedCounter from "./animated-counter";
import Testimonials from "./testimonials";
import SectionHeader from "../section-header";

const VisionMission: React.FC = () => {
	return (
		<>
			<SectionHeader
				highlightTitle="Vision "
				normalTitle="& Mission"
				description="Alumni Needs enables you to harness the power of your alumni network. Whatever may be the need"
			/>
			{/* About Details */}
			<div className="flex flex-col lg:p-16 p-4 gap-12 lg:gap-16 items-center justify-center max-w-7xl mx-auto w-full mb-12">
				
				{/* Vision Card */}
				<div className="bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-3xl w-full flex flex-col lg:flex-row items-stretch overflow-hidden border border-neutral-100">
					<div className="w-full lg:w-1/3 bg-primary/10 flex items-center justify-center p-12 border-b lg:border-b-0 lg:border-r border-neutral-100 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full opacity-50"></div>
						<div className="w-40 h-40 md:w-48 md:h-48 relative z-10 bg-white rounded-full p-4 shadow-sm border border-neutral-100 flex items-center justify-center">
							<Image
								src="/assets/JGEC-Logo.jpg"
								alt="JGEC Logo"
								height={200}
								width={200}
								className="w-full h-full object-contain"
							/>
						</div>
					</div>
					<div className="w-full lg:w-2/3 p-8 lg:p-14">
						<div className="inline-flex items-center gap-3 mb-8">
							<div className="w-1.5 h-8 bg-primary/100 rounded-full"></div>
							<h3 className="text-neutral-900 font-extrabold uppercase text-2xl lg:text-3xl tracking-tight">
								Vision
							</h3>
						</div>
						<ul className="space-y-6 text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed">
							<li className="flex gap-4 items-start">
								<div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary/100 shrink-0"></div>
								<p>To emerge as a strong co-ordination and healthy interaction between the college and its Alumni.</p>
							</li>
							<li className="flex gap-4 items-start">
								<div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary/100 shrink-0"></div>
								<p>To promote development of healthy socio-technical interaction with ethical values for creative engineering solutions commensurate with global challenges.</p>
							</li>
						</ul>
					</div>
				</div>

				{/* Mission Card */}
				<div className="bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-3xl w-full flex flex-col lg:flex-row-reverse items-stretch overflow-hidden border border-neutral-100">
					<div className="w-full lg:w-1/3 bg-[#f8fafc] flex items-center justify-center p-12 border-b lg:border-b-0 lg:border-l border-neutral-100 relative overflow-hidden">
						<div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-200 rounded-tr-full opacity-30"></div>
						<div className="w-40 h-40 md:w-48 md:h-48 relative z-10 bg-white rounded-full p-4 shadow-sm border border-neutral-100 flex items-center justify-center">
							<Image
								src="/assets/JGECAA.jpg"
								alt="JGECAA Logo"
								height={200}
								width={200}
								className="w-full h-full object-contain rounded-full"
							/>
						</div>
					</div>
					<div className="w-full lg:w-2/3 p-8 lg:p-14">
						<div className="inline-flex items-center gap-3 mb-8">
							<div className="w-1.5 h-8 bg-green-500 rounded-full"></div>
							<h3 className="text-neutral-900 font-extrabold uppercase text-2xl lg:text-3xl tracking-tight">
								Mission
							</h3>
						</div>
						<ul className="space-y-6 text-neutral-600 font-medium text-[14px] lg:text-[15px] leading-relaxed">
							<li className="flex gap-4 items-start">
								<div className="mt-2 w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
								<p>Fostering an inspiring and conductive learning environment to prepare skilled and competent engineers and entrepreneurs for sustainable development of the society.</p>
							</li>
							<li className="flex gap-4 items-start">
								<div className="mt-2 w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
								<p>Imparting innovative educational process through Bridging the Gap program for meeting the growing challenges between Academia and Industry.</p>
							</li>
							<li className="flex gap-4 items-start">
								<div className="mt-2 w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
								<p>Creating a knowledge centre of advanced technologies committed to societal growth using environment-friendly technologies as far as practicable.</p>
							</li>
							<li className="flex gap-4 items-start">
								<div className="mt-2 w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></div>
								<p>Distributing study materials and extending assistances to poor and/or needy students as far as permissible.</p>
							</li>
						</ul>
					</div>
				</div>
			</div>
			{/*  */}
		</>
	);
};

export default VisionMission;
