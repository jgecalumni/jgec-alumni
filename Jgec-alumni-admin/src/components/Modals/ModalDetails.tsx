import React, { memo } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ErrorMessage, Form, Formik } from "formik";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { format, parse } from "date-fns";

interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}
export const ModalMemberDetails: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		return (
			<div>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-3xl modal-scrollbar p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl bg-card">
						<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border/50 m-0 shrink-0">
							<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
								<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
								</div>
								Member Details
							</DialogTitle>
						</DialogHeader>
						<div className="px-6 py-4 text-[14px] lg:text-[16px] text-muted-foreground">
							<div className="flex justify-between items-center">
								<div className="space-y-1">
									<div>
										<span className="font-semibold text-foreground">Name</span> : {details.name}
									</div>
									<div>
										<span className="font-semibold text-foreground">Email</span> : {details.email}
									</div>
									<div>
										<span className="font-semibold text-foreground">Student ID</span> :{" "}
										{details.studentId}
									</div>
									<div>
										<span className="font-semibold text-foreground">Department</span> :{" "}
										{details.department}
									</div>
									<div>
										<span className="font-semibold text-foreground">Passing Year</span> :{" "}
										{details.passingYear}
									</div>
								</div>
								<Link
									href={details.photo}
									target="_blank">
									<Image
										src={details.photo}
										alt={details.name}
										height={120}
										width={120}
									/>
								</Link>
							</div>
							<div className="border-t border-border/50 my-4"></div>
							<div className="flex justify-between items-center">
								<div className="space-y-1 mt-1">
									<div>
										<span className="font-semibold text-foreground">Residential Address</span> :{" "}
										{details.residentialAddress}
									</div>
									<div>
										<span className="font-semibold text-foreground">Professional Address</span> :{" "}
										{details.professionalAddress}
									</div>
								</div>
								<Link
									href={details.receipt}
									target="_blank">
									<Image
										src={details.receipt}
										alt={details.name}
										height={120}
										width={120}
									/>
								</Link>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);
ModalMemberDetails.displayName = "ModalMemberDetails";

export const ModalScholarshipDetails: React.FC<IProps> = memo(
	({ details, open, closed }) => {
		console.log(details);

		return (
			<div>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-3xl modal-scrollbar p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl bg-card max-h-[85vh] flex flex-col">
						<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border/50 m-0 shrink-0">
							<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
								<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
								</div>
								Scholarship Details
							</DialogTitle>
						</DialogHeader>
						<div className="px-6 py-4 overflow-y-auto no-scrollbar text-[14px] lg:text-[14px] text-muted-foreground flex-1">
							<div className="flex justify-between items-center">
								<div className="space-y-3">
									<div>
										<span className="font-semibold text-foreground">Name</span> : {details.name}
									</div>
									<div>
										<span className="font-semibold text-foreground">Subtitle</span> :{" "}
										{details.subtitle}
									</div>
									<div className="flex gap-1 items-start">
										<span className="font-semibold text-foreground">Description</span> :{" "}
										<ReactQuill
											theme="bubble"
											value={details.description}
											readOnly={true}
											className="scholarship_view_editor"
										/>
									</div>
									<div>
										<span className="font-semibold text-foreground">Who can apply?</span> :{" "}
										{details.whoCanApply}
									</div>
									<div>
										<span className="font-semibold text-foreground">Amount</span> :{" "}
										{details.amountDetails}
									</div>
									{/* <div>
										<span className="font-semibold text-foreground">When to apply?</span> :{" "}
										{details.whenToApply}
									</div> */}
								</div>
							</div>
							<div className="border-t border-border/50 my-4"></div>
							<div className="text-lg font-semibold">Provider Details</div>
							<div className="flex  gap-8 items-center">
								<div className="mt-1 text-[14px] w-2/3">
									<div className="space-y-1 ">
										<div>
											<span className="font-semibold text-foreground">Name</span> :{" "}
											{details.providerName}
										</div>
										<div>
											<span className="font-semibold text-foreground">Department</span> :{" "}
											{details.providerDepartment}
										</div>
										<div>
											<span className="font-semibold text-foreground">Passing Year</span> :{" "}
											{details.providerPassingYear}
										</div>
									</div>
								</div>
								<div className="">
									<Image
										src={details.providerImage}
										alt="provider photo"
										width={160}
										height={160}
										className="rounded"
									/>
								</div>
							</div>
							<div>
								<span className="font-semibold text-foreground">Provider Description</span> :{" "}
								<ReactQuill
									theme="bubble"
									value={details.providerDescription}
									readOnly={true}
									className="scholarship_view_editor"
								/>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);
ModalScholarshipDetails.displayName = "ModalScholarshipDetails";

export const ModalEventDetails: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		return (
			<div>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-3xl modal-scrollbar p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl bg-card max-h-[85vh] flex flex-col">
						<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border/50 m-0 shrink-0">
							<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
								<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
								</div>
								Event Details
							</DialogTitle>
						</DialogHeader>
						<div className="px-6 py-4 overflow-y-auto no-scrollbar text-[14px] lg:text-[14px] text-muted-foreground flex-1">
							<div className="flex justify-between items-center">
								<div className="space-y-3">
									<div className="flex items-center justify-between ">
										<div className="space-y-3">
											<div>
												<span className="font-semibold text-foreground">Name</span> :{" "}
												{details.name}
											</div>
											<div>
												<span className="font-semibold text-foreground">Short Description</span> :{" "}
												{details.shortDescription}
											</div>
										</div>
										<Link
											href={details.event_thumbnail}
											target="_blank">
											<Image
												src={details.event_thumbnail}
												height={120}
												width={120}
												alt=""
												className="rounded mr-4"
											/>
										</Link>
									</div>
									<div className="flex gap-1 items-start">
										<span className="font-semibold text-foreground">Details</span> :{" "}
										<ReactQuill
											theme="bubble"
											value={details.details}
											readOnly={true}
											className="scholarship_view_editor"
										/>
									</div>
									<div>
										<span className="font-semibold text-foreground">Venue</span> :{" "}
										{details.location}
									</div>
									<div>
										<span className="font-semibold text-foreground">Date</span> :{" "}
										{format(new Date(details.date), "dd MMM, yyyy")}
									</div>
									<div>
										<span className="font-semibold text-foreground">Time</span> :{" "}
										{format(parse(details.time, "HH:mm", new Date()), "h:mm a")}
									</div>
									<div>
										<span className="font-semibold text-foreground">Host Name</span> :{" "}
										{details.hostName}
									</div>
									<div className="flex gap-1 items-start">
										<span className="font-semibold text-foreground">Host Details</span> :{" "}
										<ReactQuill
											theme="bubble"
											value={details.hostDetails}
											readOnly={true}
											className="scholarship_view_editor"
										/>
									</div>
								</div>
							</div>
							<div className="border-t border-border/50 my-4"></div>
							<div className="space-y-3">
								<div className="text-foreground font-semibold text-lg">Schedule</div>
								{details.schedule.map((schedule: any) => (
									<div
										key={schedule.id}
										className="bg-card flex items-center gap-3 rounded-xl h-12 shadow-sm border border-border/50">
										<div className="h-full text-white flex items-center justify-center p-3 text-[12px] lg:text-[14px] rounded-l-md bg-primary">
											{format(
												parse(schedule.startTime, "HH:mm", new Date()),
												"h:mm a"
											)}
											-{" "}
											{format(
												parse(schedule.endTime, "HH:mm", new Date()),
												"h:mm a"
											)}
										</div>
										<div className="font-medium">{schedule.activity}</div>
									</div>
								))}
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);

ModalEventDetails.displayName = "ModalEventDetails";

export const ModalReceiptDetails: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		console.log(details);
		return (
			<div>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-3xl modal-scrollbar p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl bg-card">
						<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border/50 m-0 shrink-0">
							<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
								<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
								</div>
								Receipt Details
							</DialogTitle>
						</DialogHeader>
						<div className="px-6 py-4 text-[14px] lg:text-[14px] text-muted-foreground">
							<div className="flex justify-between items-center w-full ">
								<div className="space-y-3 w-full">
									<div className="flex gap-8 w-full  items-center justify-between ">
										<div className="space-y-3 ">
											<div>
												<span className="font-semibold text-foreground">Name</span> :{" "}
												{details.name}
											</div>
											<div>
												<span className="font-semibold text-foreground">Email</span> :{" "}
												{details.email}
											</div>
											<div>
												<span className="font-semibold text-foreground">Phone No.</span> :{" "}
												{details.phone}
											</div>
											<div>
												<span className="font-semibold text-foreground">Passout Year:</span> :{" "}
												{details.passoutYear}
											</div>
											<div>
												<span className="font-semibold text-foreground">Transaction ID</span> :{" "}
												{details.transactionId}
											</div>
											<div>
												<span className="font-semibold text-foreground">Donation For</span> :{" "}
												{details.donationFor}
											</div>
										</div>
										{/* <div className="">
											<Link
												href={details.receipt}
												target="_blank">
												<Image
													src={details.receipt}
													height={120}
													width={120}
													className="rounded mr-4"
													alt=""
												/>
											</Link>
										</div> */}
									</div>
									<div>
										<span className="font-semibold text-foreground">Status</span> :{" "}
										{details.paymentStatus === "Pending" ? (
											<span className="px-2 py-1 rounded-md text-[12px] font-bold bg-yellow-100 text-yellow-600">
												Pending
											</span>
										) : details.paymentStatus === "APPROVED" ? (
											<span className="px-2 py-1 rounded-md text-[12px] font-bold bg-green-100 text-green-600">
												Approved
											</span>
										) : (
											<span className="px-2 py-1 rounded-md text-[12px] font-bold bg-red-100 text-red-600">
												Deny
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="border-t border-border/50 my-4"></div>
							{details.generatedReceipt ? (
								<div className="mt-2 border rounded-lg p-2 relative">
									<iframe
										src={details.generatedReceipt || ""}
										className="w-full h-64 border rounded"
										title="PDF Preview"
									/>
								</div>
							) : (
								<div>No receipt generated.</div>
							)}
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);
ModalReceiptDetails.displayName = "ModalReceiptDetails";
