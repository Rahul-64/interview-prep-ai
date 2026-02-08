import express from "express";
import { signupUser, loginUser, getUserProfile } from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);

export default router;
