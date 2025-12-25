import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post('/signup',authController.createUser);
router.post('/signin',authController.loginUser);

export const authRoutes = router