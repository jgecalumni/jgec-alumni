import React from "react";
import SectionHeader from "../section-header";
import Link from "next/link";

const DigitalDatabase: React.FC = () => {
	return (
		<div>
			<SectionHeader
				highlightTitle="Digital"
				normalTitle="Database"
				description="Why we use digital database?"
			/>
			<div className="lg:px-14  lg:p-8 p-2">
				<div className="flex items-center gap-2">
					<div className="border-2 rounded border-primary/40 h-10"></div>
					<h3 className="text-[#364150] font-semibold uppercase text-[20px] lg:text-[24px]">
						Digital Database
					</h3>
				</div>
				<div className="p-4 space-y-4">
					<h3 className="text-primary font-semibold lg:text-[20px] text-[19px]">
						Why really should you care to enter your details in this JGEC Alumni
						digital database?
					</h3>
					<p className="text-[16px] lg:text-[18px]">Here's a piece meal food for thought.</p>
					<ul className="text-[14px] lg:text-[16px] space-y-4">
						<li>
							<span className="font-medium">Medical needs first - </span>What if
							your family member is in need of blood & you don’t know whom to
							reach out to? Additionally, what if you are not present in the
							location physically? JGEC has an alumni base of 10k+ spread across
							most locations globally. Do you really think blood donation will
							be a challenge if we have a single web portal, more reliable than
							market sources? That solution is a click away!
						</li>
						<li>
							<span className="font-medium">Next comes Profession - </span>
							Require a reference to a job which you desperately need or have
							been dreaming of? It’s tough these days. Let's identify top-heads
							in MNCs who are JGEC Alumnus? Again, a one click-solution!
							Potentially very helpful in Post-Covid market, both for business
							to grow and individuals to prosper.
						</li>
						<li>
							<span className="font-medium">Some Fun too - </span>What if you
							are staying in some corner of the world but never knew that you
							might be within walking distance of your lost-contact hostel mate
							with whom you had very fond memories in JGEC? wouldn't you want to
							reconnect once more? Have you seen the movie Chichhore, or 3
							idiots?
						</li>
						<li>
							<span className="font-medium">
								Some Analytics, Data Management & Professional Competence in use
								-{" "}
							</span>
							When we have an analytical view of the types of industries we are
							spreaded across, the types of projects we do, the types of clients
							we have served, then don’t we think that we can create a solid
							foundational platform for JGEC freshers to step into the
							corporate? Would it not be a win-win situation even for alumni?
						</li>
						<li>
							<span className="font-medium">
								Finally, Connections & Networking -{" "}
							</span>
							The most buzz word of today's era. It'll be difficult but not
							impossible to organize & arrange all batches into a connected
							network of interaction where access to long-lost connections can
							be re-established digitally. An organized & reliable digital
							platform. Let’s call this the new normal!
						</li>
						<li>
							<span className="font-medium">
								Last but not the least, Gratitude and Gratefulness towards JGEC
								-{" "}
							</span>
							We are enjoying life as professional engineers because of the
							learnings gained in JGEC Campus. The least we can do is to help it
							grow better, can't we?
						</li>
					</ul>
					<p className="text-sm">
						Some learnings taken from top tier institutes.
					</p>
					<p className="font-medium text-sm">
						If you think these add value? Do enter your personal details below
						and do share it within your JGEC connections too: (
						<Link
							href="/login"
							className="text-red-500 font-medium ">
							Apply Here
						</Link>
						)
					</p>
				</div>
			</div>
		</div>
	);
};

export default DigitalDatabase;
