import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const body = await req.json();

		const {
			scholarshipName,
			name,
			studentId,
			dob,
			contactHome,
			contact,
			email,
			numberofdirectfamilyMembers,
			fatherOccupation,
			totalEarningMembers,
			totalFamilyIncome,
			eachFamilyIncome,
			jgecIntakeYear,
			jgecPassingYear,
			department,
			extraCurricularActivities,
			percentHigherSecondary,
			percentSecondary,
			rank,
			sem_1st,
			sem_2nd,
			sem_3rd,
			sem_4th,
			sem_5th,
			average,
			residentialAddress,
			specialAchievement,
			document,
		} = body;

		console.log(`Processing scholarship: ${scholarshipName}`);

		// Authenticate with Google Sheets API
		const auth = new google.auth.GoogleAuth({
			credentials: {
				client_email: process.env.CLIENT_EMAIL,
				client_id: process.env.CLIENT_ID,
				private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix for newlines in private key
			},
			scopes: [
				"https://www.googleapis.com/auth/drive",
				"https://www.googleapis.com/auth/drive.file",
				"https://www.googleapis.com/auth/spreadsheets",
			],
		});

		const sheets = google.sheets({ auth, version: "v4" });
		const spreadsheetId = process.env.SPREADSHEET_ID; // Ensure this is set correctly

		const sheetname = scholarshipName.substring(0, 100);

		// Check if the sheet with scholarshipName exists
		const sheetMetadata = await sheets.spreadsheets.get({
			spreadsheetId,
		});

		const sheetExists = sheetMetadata.data.sheets.some(
			(sheet) => sheet.properties.title === sheetname
		);

		// If sheet doesn't exist, create it and add headings
		if (!sheetExists) {
			await sheets.spreadsheets.batchUpdate({
				spreadsheetId,
				requestBody: {
					requests: [
						{
							addSheet: {
								properties: {
									title: sheetname,
								},
							},
						},
					],
				},
			});

			// Define column headings
			const headers = [
				"Name",
				"Student ID",
				"Date of Birth",
				"Home Contact",
				"Personal Contact",
				"Email",
				"Family Members",
				"Father's Occupation",
				"Earning Members",
				"Total Family Income",
				"Each Family Income",
				"Wbjee Rank",
				"JGEC Intake Year",
				"JGEC Passing Year",
				"Department",
				"Extra Curricular Activities",
				"Secondary %",
				"Higher Secondary %",
				"Grade Sem 1",
				"Grade Sem 2",
				"Grade Sem 3",
				"Grade Sem 4",
				"Grade Sem 5",
				"Average Grade",
				"Residential Address",
				"Special Achievements",
				"Document Link",
			];

			// Insert the headers into the new sheet
			await sheets.spreadsheets.values.update({
				spreadsheetId,
				range: `${sheetname}!A1`,
				valueInputOption: "USER_ENTERED",
				requestBody: {
					values: [headers],
				},
			});
		}

		// Append the actual student data to the spreadsheet
		await sheets.spreadsheets.values.append({
			spreadsheetId,
			range: `${sheetname}!A2`, // Start appending data from the second row
			valueInputOption: "USER_ENTERED",
			requestBody: {
				values: [
					[
						name,
						studentId,
						dob,
						contactHome,
						contact,
						email,
						numberofdirectfamilyMembers,
						fatherOccupation,
						totalEarningMembers,
						totalFamilyIncome,
						eachFamilyIncome,
						rank,
						jgecIntakeYear,
						jgecPassingYear,
						department,
						extraCurricularActivities,
						percentSecondary,
						percentHigherSecondary,
						sem_1st,
						sem_2nd,
						sem_3rd,
						sem_4th,
						sem_5th,
						average,
						residentialAddress,
						specialAchievement,
						document,
					],
				],
			},
		});

		return NextResponse.json(
			{ message: `Data added to ${scholarshipName} successfully!` },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error occurred:", error);
		return NextResponse.json(
			{ error: "Failed to add data to Google Sheets." },
			{ status: 500 }
		);
	}
}
