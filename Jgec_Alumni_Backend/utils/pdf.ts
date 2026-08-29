import PDFDocument from "pdfkit";
import { format, parse } from "date-fns";
import { toWords } from "number-to-words";

export const generateReceiptPDF = async (receipt: any): Promise<Buffer> => {
	function convertNumberToWords(num: any) {
		let n: any;
		var ones = [
			"",
			"One ",
			"Two ",
			"Three ",
			"Four ",
			"Five ",
			"Six ",
			"Seven ",
			"Eight ",
			"Nine ",
			"Ten ",
			"Eleven ",
			"Twelve ",
			"Thirteen ",
			"Fourteen ",
			"Fifteen ",
			"Sixteen ",
			"Seventeen ",
			"Eighteen ",
			"Nineteen ",
		];
		var tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		if ((num = num.toString()).length > 9)
			return "Overflow: Maximum 9 digits supported";
		n = ("000000000" + num)
			.substr(-9)
			.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str = "";
		str +=
			n[1] != 0
				? (ones[Number(n[1])] || tens[n[1][0]] + " " + ones[n[1][1]]) + "Crore "
				: "";
		str +=
			n[2] != 0
				? (ones[Number(n[2])] || tens[n[2][0]] + " " + ones[n[2][1]]) + "Lakh "
				: "";
		str +=
			n[3] != 0
				? (ones[Number(n[3])] || tens[n[3][0]] + " " + ones[n[3][1]]) +
				  "Thousand "
				: "";
		str +=
			n[4] != 0
				? (ones[Number(n[4])] || tens[n[4][0]] + " " + ones[n[4][1]]) +
				  "Hundred "
				: "";
		str +=
			n[5] != 0
				? (str != "" ? "and " : "") +
				  (ones[Number(n[5])] || tens[n[5][0]] + " " + ones[n[5][1]])
				: "";
		return str;
	}

	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({ margin: 50, size: "A4" });
		const buffers: Buffer[] = [];

		doc.on("data", (chunk) => buffers.push(chunk));
		doc.on("end", () => resolve(Buffer.concat(buffers)));
		doc.on("error", (err) => reject(err));

		// Header
		doc.image("public/Logo.png", 40, 40, { width: 500 });
		doc.moveDown(10);

		doc
			.font("Helvetica-Bold")
			.fontSize(14)
			.text("Money Receipt", { align: "center" });
		doc.underline(248, 200, 100, 3);

		// Serial No and Date
		doc.font("Helvetica").fontSize(10.3).text(`Sl. No: ${receipt.id}`, 50, 250);
		doc.text(`Date: ${format(receipt.createdAt, "dd/MM/yyyy")}`, 430, 250);

		doc.moveDown(4);

		// Registration Number

		// Received from
		doc.text(
			`Received with thanks ${
				receipt.gender === "Company"
					? ""
					: receipt.gender === "Male"
					? "from Sri"
					: "from Smt"
			}: ${receipt.name}`,
			50,
			doc.y
		);
		// let receivedFromY = doc.y;
		// doc.underline(220, receivedFromY, 200, 1);

		doc.moveDown(2);

		{
			receipt.panId ? doc.text(`PAN: ${receipt.panId}`, 50, doc.y) : "";
		}

		// let receivedFromY = doc.y;
		// doc.underline(220, receivedFromY, 200, 1);

		doc.moveDown(2);

		// Sum of rupees
		doc.text(
			`Donation Amount: Rs.${receipt.amount}/- (${
				convertNumberToWords(receipt.amount) + " Rupees only."
			}) (Credited on: ${format(receipt.date, "dd/MM/yyyy")})`,
			50,
			doc.y
		);
		// let sumOfRupeesY = doc.y;
		// doc.text("_____________________________", 200, sumOfRupeesY);
		// doc.underline(200, sumOfRupeesY + 2, 150, 1);

		doc.moveDown(2);

		// Donation for
		doc.text(`Donation for: ${receipt.donationFor}`, 50, doc.y);
		// let donationForY = doc.y;
		// doc.text("_____________________________", 200, donationForY);
		// doc.underline(200, donationForY + 2, 350, 1);

		// let amountY = doc.y;
		// doc.text("_______________", { align: "right", x: 550 });
		// doc.underline(550, amountY + 2, 25, 1);

		doc.moveDown(5);
		doc
			.font("Helvetica")
			.text(
				`Note: This is a digitally generated receipt and does not require a physical signature.`
			);

		// Footer
		doc.moveDown(4);
		doc
			.font("Helvetica-Bold")
			.fontSize(10.3)
			.text(
				"Donations are exempted from Income Tax under section 80G(5) VI of the Income Tax Act, 1961 vide " +
					"Memo Number CIT (E)/10E/15/15-16/G-0162/2449-51 dated 9/10/2015 with effect from 17.04.2015 " +
					"PAN - AADAT3213C. Under schedule 1, Article 53, Exemption (b) of the Indian Stamp Act, charitable " +
					"institutions are not required to issue stamped receipts for donations.",
				50,
				doc.y,
				{ align: "justify", width: 500 }
			);

		doc.end();
	});
};

// Generate PDF for contribution receipt
export const generateContributionReceiptPDF = async (
	contribution: any
): Promise<Buffer> => {
	function convertNumberToWords(num: any) {
		let n: any;
		var ones = [
			"",
			"One ",
			"Two ",
			"Three ",
			"Four ",
			"Five ",
			"Six ",
			"Seven ",
			"Eight ",
			"Nine ",
			"Ten ",
			"Eleven ",
			"Twelve ",
			"Thirteen ",
			"Fourteen ",
			"Fifteen ",
			"Sixteen ",
			"Seventeen ",
			"Eighteen ",
			"Nineteen ",
		];
		var tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		if ((num = num.toString()).length > 9)
			return "Overflow: Maximum 9 digits supported";
		n = ("000000000" + num)
			.substr(-9)
			.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return;
		var str = "";
		str +=
			n[1] != 0
				? (ones[Number(n[1])] || tens[n[1][0]] + " " + ones[n[1][1]]) + "Crore "
				: "";
		str +=
			n[2] != 0
				? (ones[Number(n[2])] || tens[n[2][0]] + " " + ones[n[2][1]]) + "Lakh "
				: "";
		str +=
			n[3] != 0
				? (ones[Number(n[3])] || tens[n[3][0]] + " " + ones[n[3][1]]) +
				  "Thousand "
				: "";
		str +=
			n[4] != 0
				? (ones[Number(n[4])] || tens[n[4][0]] + " " + ones[n[4][1]]) +
				  "Hundred "
				: "";
		str +=
			n[5] != 0
				? (str != "" ? "and " : "") +
				  (ones[Number(n[5])] || tens[n[5][0]] + " " + ones[n[5][1]])
				: "";
		return str;
	}

	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({ margin: 50, size: "A4" });
		const buffers: Buffer[] = [];

		doc.on("data", (chunk) => buffers.push(chunk));
		doc.on("end", () => resolve(Buffer.concat(buffers)));
		doc.on("error", (err) => reject(err));

		// Header
		doc.image("public/Logo.png", 40, 40, { width: 500 });
		doc.moveDown(10);

		doc
			.font("Helvetica-Bold")
			.fontSize(14)
			.text("Money Receipt", { align: "center" });
		doc.underline(248, 200, 100, 3);

		// Serial No and Date
		doc
			.font("Helvetica")
			.fontSize(10.3)
			.text(`Receipt No: ${contribution.id}`, 50, 250);
		doc.text(`Date: ${format(contribution.createdAt, "dd/MM/yyyy")}`, 430, 250);

		doc.moveDown(4);

		// Received from
		doc.text(
			`Received with thanks from: ${contribution.nameOfAluminus}`,
			50,
			doc.y
		);

		doc.moveDown(2);

		// Mobile number
		if (contribution.mobileNo !== "null") {
			doc.text(`Mobile No: ${contribution.mobileNo}`, 50, doc.y);
			doc.moveDown(2);
		}

		// Graduation Year
		doc.text(`Graduation Year: ${contribution.graduationYear}`, 50, doc.y);

		doc.moveDown(2);

		// Sum of rupees
		doc.text(
			`Contribution Amount: Rs.${contribution.amount}/- (${
				convertNumberToWords(contribution.amount) + " Rupees only."
			}) ${
				contribution.depositedOn && contribution.depositedOn !== "null"
					? `(Deposited on: ${format(
							parse(contribution.depositedOn, "dd-MM-yyyy", new Date()),
							"dd/MM/yyyy"
					  )})`
					: ""
			}`,
			50,
			doc.y
		);

		doc.moveDown(5);
		doc
			.font("Helvetica")
			.text(
				`Note: This is a digitally generated receipt and does not require a physical signature.`
			);

		// Footer
		doc.moveDown(4);
		doc
			.font("Helvetica-Bold")
			.fontSize(10.3)
			.text(
				"Contributions are exempted from Income Tax under section 80G(5) VI of the Income Tax Act, 1961 vide " +
					"Memo Number CIT (E)/10E/15/15-16/G-0162/2449-51 dated 9/10/2015 with effect from 17.04.2015 " +
					"PAN - AADAT3213C. Under schedule 1, Article 53, Exemption (b) of the Indian Stamp Act, charitable " +
					"institutions are not required to issue stamped receipts for donations.",
				50,
				doc.y,
				{ align: "justify", width: 500 }
			);

		doc.end();
	});
};

// Generate combined PDF for multiple contributions
export const generateSingleContributionReceiptPDF = async (
	contributions: any
): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({ margin: 50, size: "A4" });
		const buffers: Buffer[] = [];

		doc.on("data", (chunk) => buffers.push(chunk));
		doc.on("end", () => resolve(Buffer.concat(buffers)));
		doc.on("error", (err) => reject(err));

		// Title page
		doc.image("public/Logo.png", 40, 40, { width: 500 });
		doc.moveDown(10);

		doc
			.font("Helvetica-Bold")
			.fontSize(18)
			.text("Alumni Contribution Report", { align: "center" });

		doc.moveDown(2);

		doc
			.font("Helvetica")
			.fontSize(12)
			.text(`Generated on: ${format(new Date(), "dd/MM/yyyy")}`, {
				align: "center",
			});

		doc.moveDown(2);

		doc.text(`Total Contributors: ${contributions.length}`, {
			align: "center",
		});

		doc.text(`Total Amount: Rs. ${contributions.amount}/-`, {
			align: "center",
		});

		doc.moveDown(4);

		// Table headers
		const startY = doc.y;
		const rowHeight = 25;

		doc.font("Helvetica-Bold").fontSize(10);
		doc.text("Sl.", 50, startY);
		doc.text("Name", 80, startY);
		doc.text("Year", 250, startY);
		doc.text("Amount (Rs.)", 300, startY);
		doc.text("Date", 380, startY);
		doc.text("Mobile", 450, startY);

		// Draw header line
		doc
			.moveTo(50, startY + 15)
			.lineTo(550, startY + 15)
			.stroke();

		let currentY = startY + rowHeight;

		// Add contribution data
		// 	contributions.forEach((contribution:a, index) => {
		// 		if (currentY > 700) { // Start new page if needed
		// 			doc.addPage();
		// 			currentY = 50;
		// 		}

		// 		doc.font("Helvetica").fontSize(9);
		// 		doc.text((index + 1).toString(), 50, currentY);
		// 		doc.text(contribution.nameOfAluminus.substring(0, 20), 80, currentY);
		// 		doc.text(contribution.graduationYear.toString(), 250, currentY);
		// 		doc.text(contribution.amount.toString(), 300, currentY);
		// 		doc.text(contribution.depositedOn, 380, currentY);
		// 		doc.text(contribution.mobileNo.substring(0, 10), 450, currentY);

		// 		currentY += rowHeight;
		// 	});

		doc.end();
	});
};
