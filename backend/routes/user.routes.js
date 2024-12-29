import { Router } from "express";
import * as userController from "../controllers/users.controllers.js";
import { body } from "express-validator";
import * as authMiddleware from "../middlewares/auth.middlewres.js";

const router = Router();

router.post("/register",
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be a 3 character long'),
    userController.createUserController);

router.post("/login",
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be a 3 character long'),
    userController.loginController);

router.get("/profile", authMiddleware.authUser, userController.profileController);

router.get("/logout", authMiddleware.authUser, userController.logoutController);

export default router;