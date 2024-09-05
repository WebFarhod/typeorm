import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import courseController from "../controllers/course.controller";

const router = Router();

router.post("", AuthMiddleware, courseController.create);
router.get("", AuthMiddleware, courseController.getAll);
router.get("/:id", AuthMiddleware, courseController.getCourse);
router.put("/:id", AuthMiddleware, courseController.update);
router.delete("/:id", AuthMiddleware, courseController.delete);

export default router;
