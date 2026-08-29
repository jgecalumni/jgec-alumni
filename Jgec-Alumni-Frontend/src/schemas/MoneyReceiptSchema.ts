import * as Yup from "yup";

export const MoneyReceiptSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Required"),
	name: Yup.string()
		.min(2, "Too Short!")
		.max(70, "Too Long!")
		.required("Required"),
	phone: Yup.string().required("Required"),
	panId: Yup.string()
		.matches(/^[A-Z0-9]*$/, "Only uppercase letters and digits allowed")
		.max(10, "Must be 10 digits")
		.min(10, "Must be 10 digits")
		.required("Required"),
	amount: Yup.number()
		.min(499, "Amount must be greater than Rs.499")
		.required("Required"),
	passoutYear: Yup.string()
		.max(4, "Must be 4 digits")
		.required("Required")
		.typeError("Passing Year must be a number"),
	date: Yup.string().required("Required"),
	transactionId: Yup.string(),
	gender: Yup.string().required("Required"),
	donationFor: Yup.string().required("Required"),
});
