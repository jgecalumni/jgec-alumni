import * as Yup from "yup";
export const ContactSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Too Short!")
        .max(70, "Too Long!")
        .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    studentId: Yup.number()
        .max(11, "Must be 11 digits")
        .required("Required")
        .typeError("Student ID must be a number"),
    passingYear: Yup.number()
        .max(4, "Must be 4 digits")
        .required("Required")
        .typeError("Passing Year must be a number"),
    message: Yup.string().required("Required"),
    department: Yup.string().required("Required"),
});