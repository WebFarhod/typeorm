import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = Router();


router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/get-user-info", AuthMiddleware, AuthController.getUserInfo);
router.get("/refresh", AuthMiddleware, AuthController.refresh);
router.get("/logout", AuthMiddleware, AuthController.logout);

export default router;
