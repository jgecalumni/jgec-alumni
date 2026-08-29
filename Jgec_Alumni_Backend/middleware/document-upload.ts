import multer from "multer";
import path from "path";
import fs from "fs";

// Create destination folder if it doesn't exist
const uploadDir = './public/documents';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed!"));
    }
};

export const documentUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB max file size
    }
});
