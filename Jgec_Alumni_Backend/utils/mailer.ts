import nodemailer from "nodemailer";

export const sendMail = async (
	email: string,
	subject: string,
	message: string
) => {
	if (!email) {
		throw new Error("No email address provided.");
	}
	try {
		const transport = nodemailer.createTransport({
			service: "Gmail",
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
		const mailOption = {
			from: "JGEC Alumni Association",
			to: email,
			subject,
			html: message,
		};
		const mailResponse = await transport.sendMail(mailOption);
		return mailResponse;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const sendMailWithAttachment = async (
	email: string,
	subject: string,
	html: string,
	pdfBuffer: Buffer,
	name: string
) => {
	const transport = nodemailer.createTransport({
		service: "Gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: "JGEC Alumni Association",
		to: email,
		subject,
		html, // Send HTML email
		attachments: [
			{
				filename: "Receipt_" + name.replace(" ", "_") + ".pdf",
				content: pdfBuffer,
				encoding: "base64",
			},
		],
	};

	await transport.sendMail(mailOptions);
};
