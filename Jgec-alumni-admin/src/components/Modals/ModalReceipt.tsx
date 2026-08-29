import { ErrorMessage, Form, Formik } from "formik";
import { memo, use, useEffect } from "react";
import { Input } from "../ui/input";
import { Select, SelectField } from "../ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useAddReceiptMutation } from "@/store/feature/receipt-feature";

const MoneyReceiptSchema = Yup.object().shape({
	// email: Yup.string().email("Invalid email").required("Required"),
	name: Yup.string()
		.min(2, "Too Short!")
		.max(70, "Too Long!")
		.required("Required"),
	// phone: Yup.string().required("Required"),
	// panId: Yup.string()
	// 	.matches(/^[A-Z0-9]*$/, "Only uppercase letters and digits allowed")
	// 	.max(10, "Must be 10 digits")
	// 	.min(10, "Must be 10 digits")
	// 	.required("Required"),
	amount: Yup.number()
		.min(499, "Amount must be greater than Rs.499")
		.required("Required"),
	// passoutYear: Yup.string()
	// 	.max(4, "Must be 4 digits")
	// 	.required("Required")
	// 	.typeError("Passing Year must be a number"),
	date: Yup.string().required("Required"),
	transactionId: Yup.string(),
	gender: Yup.string().required("Required"),
	donationFor: Yup.string().required("Required"),
});

export const ModalReceipt: React.FC<IProps> = memo(({ open, closed }) => {
	//add receipt
	const [addReceipt, { isError, error, isLoading }] = useAddReceiptMutation();

	const handleAddReceipt = async (data: any) => {
		try {
			const response = await addReceipt(data);
			if (response.data?.success) {
				toast.success("Receipt request sent successfully");
				closed();
			}
			console.log(response);
			
		} catch (error) {
			toast.error("Failed to add receipt");
		}
	};
	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to add receipt");
		}
	}, [isError, error]);
	return (
		<Dialog
			open={open}
			onOpenChange={closed}>
			<DialogContent className="sm:max-w-2xl modal-scrollbar p-0 overflow-hidden border-border/60 shadow-2xl rounded-2xl bg-card max-h-[85vh] flex flex-col">
				<DialogHeader className="bg-muted/30 px-6 py-5 border-b border-border/50 m-0 shrink-0">
					<DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
						<div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 14h-6"/><path d="M16 10h-6"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
						</div>
						Add New Receipt
					</DialogTitle>
				</DialogHeader>
				<div className="px-6 py-4 overflow-y-auto no-scrollbar flex-1 w-full max-w-screen-lg mx-auto">
					<div className="w-full">
						<Formik
							initialValues={{
								email: "",
								name: "",
								amount: 0,
								passoutYear: "",
								date: "",
								gender: "",
								transactionId: "",
								panId: "",
								phone: "",
								donationFor: "",
							}}
							validationSchema={MoneyReceiptSchema}
							onSubmit={(values: any) => {
								handleAddReceipt(values);
							}}>
							{({ handleChange, values, setFieldValue }) => (
								<Form>
									<div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Email</Label>
											<Input
												type="email"
												name="email"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												placeholder="Enter your email"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="email"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>

										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Name</Label>
											<Input
												name="name"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												placeholder="Enter your full name"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="name"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Gender</Label>
											<SelectField
												name="gender"
												defaultValue="Select your gender"
												data={[
													{ label: "Company", value: "Company" },
													{ label: "Male", value: "Male" },
													{ label: "Female", value: "Female" },
												]}
												onValueChange={(value) =>
													setFieldValue("gender", value)
												}
												value={values.gender}
											/>
											<ErrorMessage
												name="gender"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										{/* <div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Phone No.</Label>
											<Input
												name="phone"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												placeholder="Phone No."
												onChange={handleChange}
											/>
											<ErrorMessage
												name="phone"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div> */}
										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">PAN ID</Label>
											<Input
												name="panId"
												placeholder="PAN"
												onChange={handleChange}
												className="uppercase text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
											/>
											<ErrorMessage
												name="panId"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Passout Year</Label>
											<Input
												name="passoutYear"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												placeholder="Passout Year"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="passoutYear"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Amount</Label>
											<Input
												name="amount"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												placeholder="Amount"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="amount"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Transaction ID</Label>
											<Input
												name="transactionId"
												className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full"
												placeholder="Transaction ID"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="transactionId"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Date</Label>
											<Input name="date" type="date" onChange={handleChange} className="text-sm rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-colors px-4 py-2 w-full" />
											<ErrorMessage
												name="date"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label className="font-semibold text-foreground">Donation For</Label>
											<SelectField
												name="donationFor"
												defaultValue="Select reason for Donation"
												data={[
													{
														label: "Building construction",
														value: "Building construction",
													},
													{
														label: "Students scholarship",
														value: "Students scholarship",
													},
													{ label: "Events", value: "Events" },
													{
														label: "Students services",
														value: "Students services",
													},
													{
														label: "Social awareness",
														value: "Social awareness",
													},
													{
														label: "Alumni Activities",
														value: "Alumni Activities",
													},
													{ label: "Others", value: "Others" },
													{
														label: "Financial Support for ICPC Regional Contest",
														value: "Financial Support for ICPC Regional Contest",
													},
													{
														label: "Seminar @ campus on 21st February 2026",
														value: "Seminar @ campus on 21st February 2026",
													},
													{
														label: "Donation for Kanchenjunga",
														value: "Donation for Kanchenjunga",
													},
													{
														label: "Scholarship 2026 and Seminar",
														value: "Scholarship 2026 and Seminar",
													},
													{
														label: "Scholarship 2026",
														value: "Scholarship 2026",
													},
													{
														label: "Seminar",
														value: "Seminar",
													},
												]}
												onValueChange={(value) =>
													setFieldValue("donationFor", value)
												}
												value={values.donationFor}
											/>
											<ErrorMessage
												name="donationFor"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
									</div>
									<div className="flex justify-end gap-3 items-center w-full pt-6 pb-2 border-t border-border/50 mt-8">
										<Button 
											type="button" 
											variant="outline" 
											onClick={closed} 
											className="rounded-xl font-medium px-5"
										>
											Cancel
										</Button>
										<Button
											type="submit"
											className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 font-medium px-6 flex items-center gap-2"
											disabled={isLoading}
										>
											{isLoading ? (
												<><Loader2 className="animate-spin" size={16} /> Submitting...</>
											) : (
												<>Submit Receipt</>
											)}
										</Button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
});
ModalReceipt.displayName = "ModalReceipt";
