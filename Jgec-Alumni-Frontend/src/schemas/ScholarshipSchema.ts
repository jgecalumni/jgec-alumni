import * as Yup from "yup";

export const ScholarshipSchema = Yup.object().shape({
	scholarshipName: Yup.string().required("Scholarship name is required"),
	name: Yup.string().required("Full name is required"),
	studentId: Yup.string()
		.matches(/^\d{11}$/, "Must be 11 digit")
		.required("Student ID is required"),
	dob: Yup.string().required("Date of birth is required"),
	contactHome: Yup.string()
		.matches(/^\d{10}$/, "Enter a valid phone number")
		.notOneOf([Yup.ref('contact')], "Parent's contact cannot be the same as personal contact"),
	contact: Yup.string().matches(/^\d{10}$/, "Enter a valid phone number"),
	email: Yup.string()
		.email("Enter a valid email")
		.required("Email is required"),
	numberofdirectfamilyMembers: Yup.number()
		.typeError("Must be a number")
		.required("Number of family members is required"),
	fatherOccupation: Yup.string().required("Father's occupation is required"),
	totalEarningMembers: Yup.number().required("Total earning members is required"),
	totalFamilyIncome: Yup.number().required("Total family income is required"),
	eachFamilyIncome: Yup.number().required("Each family income is required"),
	jgecIntakeYear: Yup.string().required("Jgec intake year is required"),
	jgecPassingYear: Yup.string().required("Jgec passing year is required"),
	extraCurricularActivities: Yup.string().optional(),
	percentHigherSecondary: Yup.string().required(
		"Enter your class 12 percentage"
	),
	percentSecondary: Yup.string().required("Enter your class 10 percentage"),
	department: Yup.string().required("Department is required"),
	residentialAddress: Yup.string().required("Address is required"),
	specialAchievement: Yup.string().optional(),
	jobCampusing: Yup.string().optional(),
	// average: Yup.string().required("Enter your average CGPA"),
	rank: Yup.number().required("Enter your wbjee rank"),
	// Dynamically validate semester CGPA fields
	// ...Object.fromEntries(
	// 	["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => [
	// 		`sem_${sem}`,
	// 		Yup.string()
	// 			.matches(/^\d+(\.\d{1,2})?$/, "Enter a valid CGPA")
	// 			.optional(),
	// 	])
	// ),
	document: Yup.mixed()
		.required("Document is required")
		.test(
			"fileSize",
			"File too large. Max size is 15MB",
			(value: any) => value && value.size <= 15 * 1024 * 1024
		)
		.test(
			"fileType",
			"Only PDF format is supported",
			(value: any) => value && value.type === "application/pdf"
		),
});
