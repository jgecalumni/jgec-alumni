import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
	try {
		if (!localFilePath) return null;

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "image",
			timeout: 10000, // 10 seconds
		});
		//after upload image on cloudinary remove the image from public folder
		fs.unlinkSync(localFilePath);
		return response;
	} catch (error) {
		console.log("Error while uploading image on cloudinary", error);
		// fs.unlinkSync(localFilePath)
		return null;
	}
};

export const deleteFromCloudinary = async (publicId: string) => {
	try {
		if (!publicId) return null;

		await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
	} catch (error) {
		console.log("Error while deleting image from cloudinary", error);
		return error;
	}
};

export const uploadMultipleOnCloudinary = async (
	files: Express.Multer.File[]
) => {
	try {
		const uploadPromises = files.map((file) => uploadOnCloudinary(file.path));
		const results = await Promise.all(uploadPromises);
		return results.filter((result) => result !== null);
	} catch (error) {
		console.error("Cloudinary Multiple Upload Error:", error);
		return [];
	}
};
export const uploadReceiptToCloudinary = (
	buffer: Buffer
): Promise<{ secure_url: string; public_id: string }> => {
	return new Promise((resolve, reject) => {
		const now = new Date();
		const month = now.toLocaleString("default", { month: "long" }); // e.g., "May"
		const year = now.getFullYear(); // e.g., 2025
		const folderName = `receipts/${year}-${month}`; // e.g., "receipts/2025-May"

		const stream = cloudinary.uploader.upload_stream(
			{ resource_type: "auto", folder: folderName },
			(error, result) => {
				if (error) return reject(error);
				if (result && result.secure_url) {
					resolve({ secure_url: result.secure_url, public_id: result.public_id });
				} else {
					reject(
						new Error(
							"Upload failed: result is undefined or missing secure_url"
						)
					);
				}
			}
		);

		streamifier.createReadStream(buffer).pipe(stream);
	});
};
export const uploadContriReceiptToCloudinary = (
	buffer: Buffer,
	name: string // 👈 pass contributor name
): Promise<{ secure_url: string; public_id: string }> => {
	return new Promise((resolve, reject) => {
		const now = new Date();
		const month = now.toLocaleString("default", { month: "long" }); 
		const year = now.getFullYear(); // e.g., 2025
		const folderName = `receipts/${year}-${month}`; 

		const safeName = name
			.replace(/[^a-z0-9]/gi, "_") 
			.toLowerCase();

		
		const publicId = `${safeName}_${Date.now()}`;

		const stream = cloudinary.uploader.upload_stream(
			{
				resource_type: "auto",
				folder: folderName,
				public_id: publicId,
			},
			(error, result) => {
				if (error) return reject(error);
				if (result && result.secure_url) {
					resolve({
						secure_url: result.secure_url,
						public_id: result.public_id,
					});
				} else {
					reject(
						new Error(
							"Upload failed: result is undefined or missing secure_url"
						)
					);
				}
			}
		);

		streamifier.createReadStream(buffer).pipe(stream);
	});
};

export const uploadMediaPressFileToCloudinary = async (filePath: string) => {
    const now = new Date();
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();
    const folderName = `media_press/${year}-${month}`;

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            folder: folderName,
        });

        // Delete the file from your local ./public folder after upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return { secure_url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        // Still try to clean up the local file if upload fails
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw error;
    }
};