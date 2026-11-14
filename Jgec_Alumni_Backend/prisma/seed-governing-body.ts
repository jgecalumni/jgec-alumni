import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../../.env") });

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const seedData = [
	{
		post: "Ex-Officio Chairman",
		name: "Dr. Amitava Ray",
		timeline: "Principal, JGEC",
		imageFile: "ex-officio.jpg",
	},
	{
		post: "President",
		name: "Mr. Dilip Kumar Roy,",
		timeline: "(1980-1984)",
		imageFile: "DilipKumarRoy.jpg",
	},
	{
		post: "Vice President",
		name: "Mr. Biplob Kanti Roy",
		timeline: "(1992-1996)",
		imageFile: "person-icon-8.png",
	},
	{
		post: "Secretary",
		name: "Dr. Mousam Chatterjee",
		timeline: "(2000-2004)",
		imageFile: "MousamChatterjee.jpg",
	},
	{
		post: "Joint Secretary",
		name: "Mr. Pinaki Ranjan Sanyal",
		timeline: "(1983-1987)",
		imageFile: "PinakiRanjanSanyal.jpeg",
	},
	{
		post: "Treasurer",
		name: "Mr. Arkaprava Das Choudhury",
		timeline: "(2012-2016)",
		imageFile: "ArkapravaDas.jpeg",
	},
	{
		post: "Spokesperson",
		name: "Mr. Gautam Bhaduri",
		timeline: "(1979-1983)",
		imageFile: "GautamBhaduri.jpeg",
	},
	{
		post: "Governing Body Member",
		name: "Dr. Mala De",
		timeline: "(1996-2000)",
		imageFile: "MalaDe.jpg",
	},
	{
		post: "Governing Body Member",
		name: "Mr. Debashish Chatterjee",
		timeline: "(1991-1995)",
		imageFile: "DebasishChatterjee.jpeg",
	},
	{
		post: "Governing Body Member",
		name: "Ms. Durba Shil",
		timeline: "(2019-2023)",
		imageFile: "DurbaShil.jpg",
	},
	{
		post: "Internal Auditor",
		name: "Mr. Bithin Basu",
		timeline: "(1989-1993)",
		imageFile: "BithinBasu.jpg",
	},
	{
		post: "Project Director (Kanchenjunga Construction and Operations)",
		name: "Mr. Rajib Bhattacharya",
		timeline: "(1996-2000)",
		imageFile: "RajibBhattacharya.jpg",
	},
];

async function main() {
	console.log("Checking if Governing Body already exists in DB...");
	const existingCount = await prisma.governingBodyPost.count();
	if (existingCount > 0) {
		console.log(`Governing Body already has ${existingCount} posts. Skipping seed.`);
		return;
	}

	console.log("Seeding initial Governing Body posts and members...");
	const localMembersDir = path.join(__dirname, "../../Jgec-Alumni-Frontend/public/assets/Members");

	for (let i = 0; i < seedData.length; i++) {
		const item = seedData[i];
		console.log(`[${i + 1}/${seedData.length}] Creating Post: "${item.post}" for "${item.name}"...`);

		// Create post
		const post = await prisma.governingBodyPost.create({
			data: {
				title: item.post,
				order: i + 1,
			},
		});

		let imageUrl = `/assets/Members/${item.imageFile}`;
		let imagePublicId: string | null = null;

		// Try uploading local image to Cloudinary folder "Governing Body"
		const localImagePath = path.join(localMembersDir, item.imageFile);
		if (fs.existsSync(localImagePath)) {
			try {
				const uploadRes = await cloudinary.uploader.upload(localImagePath, {
					resource_type: "image",
					folder: "Governing Body",
				});
				imageUrl = uploadRes.secure_url;
				imagePublicId = uploadRes.public_id;
				console.log(`  Uploaded ${item.imageFile} to Cloudinary folder "Governing Body": ${imageUrl}`);
			} catch (uploadErr) {
				console.warn(`  Cloudinary upload failed for ${item.imageFile}, using local path fallback:`, uploadErr);
			}
		}

		await prisma.governingBodyMember.create({
			data: {
				postId: post.id,
				name: item.name,
				timeline: item.timeline,
				image: imageUrl,
				image_public_id: imagePublicId,
				order: 1,
			},
		});
	}

	console.log("Seeding Governing Body completed successfully!");
}

main()
	.catch((e) => {
		console.error("Error seeding governing body:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
