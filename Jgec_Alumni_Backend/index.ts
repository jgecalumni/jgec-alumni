import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// router imports
import AuthRoute from "./router/auth.route";
import ScholarshipRoute from "./router/scholarship.route";
import NoticeRoute from "./router/notice.route";
import EventRoute from "./router/event.route";
import DocRoute from "./router/document.route";
import GalleryRoute from "./router/gallery.route";
import ReceiptRoute from "./router/receipt.route";
import ContributionRoute from "./router/contribution.route";
import Media_pressRoute from "./router/media_press.route";
import SettingsRoute from "./router/settings.route";

import { allCounts } from "./controller/count.controller";
import authentication from "./middleware/authentication";
import path from "path";
import { connectRedis } from "./utils/redis";
import { cacheMiddleware } from "./middleware/redisCache";
import { clearCacheMiddleware } from "./middleware/clearCache";
import { setupSwagger } from "./utils/swagger";

// Connect to Redis
connectRedis();

// configure middlewares
app.use(cookieParser());
app.use(
	"/public",
	cors({
		origin: [
			process.env.FORNTEND_URI_DEV as string,
			process.env.FORNTEND_URI_PROD as string,
			process.env.FORNTEND_URI_MAIN as string,
			process.env.FORNTEND_URI_MAIN_TWO as string,
			process.env.FORNTEND_URI_ADMIN_DEV as string,
		],
	}),
	express.static(path.join(process.cwd(), "public"))
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
	cors({
		origin: [
			process.env.FORNTEND_URI_DEV as string,
			process.env.FORNTEND_URI_PROD as string,
			process.env.FORNTEND_URI_MAIN as string,
			process.env.FORNTEND_URI_MAIN_TWO as string,
			process.env.FORNTEND_URI_ADMIN_DEV as string,
		],
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	})
);

app.use(cacheMiddleware(300));
app.use(clearCacheMiddleware());

setupSwagger(app);

// declare routes
app.get("/", (req, res) => {
	res.send("Hello World!");
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the status of the API
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/api/health", (req, res) => {
    if (req.accepts('html')) {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API Health Status | JGEC Alumni</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
                
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Outfit', sans-serif;
                    background: linear-gradient(135deg, #f6f8fb 0%, #e5ebf0 100%);
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    overflow: hidden;
                }
                
                .bg-shapes {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    z-index: -1;
                    overflow: hidden;
                }
                .shape1, .shape2 {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.6;
                }
                .shape1 {
                    background: #93c5fd;
                    width: 400px; height: 400px;
                    top: -100px; left: -100px;
                }
                .shape2 {
                    background: #fcd34d;
                    width: 300px; height: 300px;
                    bottom: -50px; right: -50px;
                }

                .container {
                    text-align: center;
                    background: rgba(255, 255, 255, 0.55);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 3.5rem;
                    border-radius: 2rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.4);
                    max-width: 420px;
                    width: 90%;
                    transition: transform 0.3s ease;
                }

                .container:hover {
                    transform: translateY(-5px);
                }

                .logo {
                    max-height: 80px;
                    margin-bottom: 2.5rem;
                    animation: float 6s ease-in-out infinite;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(34, 197, 94, 0.1);
                    color: #16a34a;
                    padding: 0.5rem 1.25rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .status-badge .dot {
                    width: 8px;
                    height: 8px;
                    background-color: #22c55e;
                    border-radius: 50%;
                    margin-right: 10px;
                    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                    animation: pulse-dot 2s infinite;
                }

                h1 {
                    margin: 0 0 0.75rem 0;
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: #0f172a;
                    letter-spacing: -0.025em;
                }
                
                p {
                    margin: 0 0 2.5rem 0;
                    color: #64748b;
                    font-size: 1.05rem;
                    line-height: 1.5;
                }

                .details {
                    background: rgba(255, 255, 255, 0.7);
                    padding: 1.25rem;
                    border-radius: 1rem;
                    color: #334155;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }

                .details-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #94a3b8;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .details-time {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #0f172a;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                    100% { transform: translateY(0px); }
                }

                @keyframes pulse-dot {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }
            </style>
        </head>
        <body>
            <div class="bg-shapes">
                <div class="shape1"></div>
                <div class="shape2"></div>
            </div>
            <div class="container">
                <img src="https://res.cloudinary.com/daanphoru/image/upload/v1788075752/Logo_f6moef.webp" alt="JGEC Alumni Logo" class="logo">
                
                <div>
                    <div class="status-badge">
                        <div class="dot"></div>
                        API Operational
                    </div>
                </div>

                <h1>Systems Normal</h1>
                <p>The JGEC Alumni Backend API is running smoothly without any interruptions.</p>
                
                <div class="details">
                    <div class="details-label">Last Checked</div>
                    <div class="details-time">
                        ${new Date().toLocaleString('en-IN', { 
                            timeZone: 'Asia/Kolkata', 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            second: '2-digit',
                            timeZoneName: 'short'
                        })}
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
        return res.status(200).send(html);
    }
    
    // Return standard JSON for programmatic API clients
	res.status(200).json({ status: "UP", timestamp: new Date() });
});

// routes
app.use("/v1/api/auth/member", AuthRoute);
app.use("/v1/api/scholarships", ScholarshipRoute);
app.use("/v1/api/notice", NoticeRoute);
app.use("/v1/api/events", EventRoute);
app.use("/v1/api/documents", DocRoute);
app.use("/v1/api/gallery", GalleryRoute);
app.use("/v1/api/all-count", authentication, allCounts);
app.use("/v1/api/receipt", ReceiptRoute);
app.use("/v1/api/contributions", ContributionRoute);
app.use("/v1/api/media_press", Media_pressRoute);
app.use("/v1/api/settings", SettingsRoute);

app.listen(port, () => console.log("🚀[Server]: listening on port " + port));
