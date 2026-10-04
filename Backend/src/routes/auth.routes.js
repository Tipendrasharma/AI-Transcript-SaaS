import express from "express";
import authcontroller from "../controllers/auth.controllers.js";
import validate from "../middleware/validate.middleware.js";
import { registerValidation , loginValidation } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/register",registerValidation, validate,   authcontroller.register);
router.post("/login", loginValidation,validate, authcontroller.login);

router.post("/logout", authenticate, authcontroller.logout);
router.post("/refresh", authcontroller.refreshAccessToken);
router.get("/me",authenticate,authcontroller.getMe);

export default router;