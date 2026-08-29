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

// declare routes
app.get("/", (req, res) => {
	res.send("Hello World!");
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
