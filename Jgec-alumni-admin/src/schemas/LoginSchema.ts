import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string()
		.required("No password provided.")
		.min(8, "Password is too short - should be 8 chars minimum."),
});
