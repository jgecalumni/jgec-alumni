import { Router } from "express";
import { getGlobalSettings, updateGlobalSettings } from "../controller/settings.controller";
import authentication from "../middleware/authentication";

const router = Router();

router.get("/get", getGlobalSettings);
router.post("/update", authentication, updateGlobalSettings);

export default router;
