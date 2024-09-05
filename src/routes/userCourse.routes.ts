import { Router } from "express";
import upload from "../middlewares/multer.middleware";
import AuthMiddleware from "../middlewares/auth.middleware";
import userCourseController from "../controllers/userCourse.controller";

const router = Router();

router.post("", AuthMiddleware, userCourseController.addCourseToUser);
router.get("", AuthMiddleware, userCourseController.getUserCourses);
router.delete(
  "/:courseId",
  AuthMiddleware,
  userCourseController.deleteUserCourse
);

export default router;
