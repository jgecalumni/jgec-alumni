import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface ModalApplicantDetailsProps {
	applicant: any;
	open: boolean;
	closed: () => void;
}

export const ModalApplicantDetails: React.FC<ModalApplicantDetailsProps> = ({
	applicant,
	open,
	closed,
}) => {
	if (!applicant) return null;

	const InfoItem = ({ label, value }: { label: string; value: any }) => (
		<div className="flex flex-col">
			<span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
				{label}
			</span>
			<span className="text-sm font-medium text-foreground bg-background/50 p-2.5 rounded-lg border border-border/50">
				{value || "-"}
			</span>
		</div>
	);

	return (
		<Dialog open={open} onOpenChange={closed}>
			<DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-border/50 bg-card rounded-2xl shadow-2xl backdrop-blur-xl">
				<div className="bg-muted/30 px-6 py-5 border-b border-border/50">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
							<div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-sm"></div>
							Applicant Details
						</DialogTitle>
					</DialogHeader>
				</div>

				<div className="px-6 py-6 max-h-[75vh] overflow-y-auto no-scrollbar space-y-8">
					{/* Personal Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
							Personal Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<InfoItem label="Full Name" value={applicant.name} />
							<InfoItem label="Email Address" value={applicant.email} />
							<InfoItem label="Mobile Number" value={applicant.contact} />
							<InfoItem label="Home Contact" value={applicant.contactHome} />
							<InfoItem label="Date of Birth" value={applicant.dob} />
							<InfoItem label="Student ID" value={applicant.studentId} />
							<InfoItem label="Department" value={applicant.department} />
							<InfoItem label="Intake Year" value={applicant.jgecIntakeYear} />
							<InfoItem label="Passing Year" value={applicant.jgecPassingYear} />
						</div>
						<div className="mt-4">
							<InfoItem label="Residential Address" value={applicant.residentialAddress} />
						</div>
					</div>

					{/* Family Background */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
							Family Background & Income
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<InfoItem label="Father's Occupation" value={applicant.fatherOccupation} />
							<InfoItem label="Total Family Members" value={applicant.numberofdirectfamilyMembers} />
							<InfoItem label="Earning Members" value={applicant.totalEarningMembers} />
							<InfoItem label="Total Family Income" value={applicant.totalFamilyIncome ? `₹${applicant.totalFamilyIncome}` : "-"} />
							<InfoItem label="Each Member Income" value={applicant.eachFamilyIncome ? `₹${applicant.eachFamilyIncome}` : "-"} />
						</div>
					</div>

					{/* Academic Performance */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
							Academic Performance
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<InfoItem label="12th Percentage" value={applicant.percentHigherSecondary ? `${applicant.percentHigherSecondary}%` : "-"} />
							<InfoItem label="1st Semester" value={applicant.sem_1st} />
							<InfoItem label="2nd Semester" value={applicant.sem_2nd} />
							<InfoItem label="3rd Semester" value={applicant.sem_3rd} />
							<InfoItem label="4th Semester" value={applicant.sem_4th} />
							<InfoItem label="5th Semester" value={applicant.sem_5th} />
							<InfoItem label="Average (SGPA/CGPA)" value={applicant.average} />
						</div>
					</div>

					{/* Additional Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
							Additional Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InfoItem label="Extracurricular Activities" value={applicant.extraCurricularActivities} />
							<InfoItem label="Special Achievement" value={applicant.specialAchievement} />
							<InfoItem label="Job Campusing" value={applicant.jobCampusing} />
						</div>
					</div>

					{/* Attached Document */}
					{applicant.document && (
						<div className="space-y-4">
							<h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
								Attached Document
							</h3>
							<Link
								href={
									applicant.document.startsWith('http')
										? applicant.document
										: `${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${applicant.document.startsWith('/') ? '' : '/'}${applicant.document}`
								}
								target="_blank"
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-medium text-sm"
							>
								<ExternalLink size={16} />
								View Submitted Document
							</Link>
						</div>
					)}
				</div>

				<div className="bg-muted/30 px-6 py-4 border-t border-border/50 flex justify-end">
					<Button
						variant="outline"
						onClick={closed}
						className="px-6 bg-background border-border hover:bg-muted font-semibold transition-all rounded-xl"
					>
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
