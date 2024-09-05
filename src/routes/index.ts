import { Router } from "express";
import authRoutes from "./auth.routes";
import userFileRoutes from "./userFile.routes";
import courseRoutes from "./course.routes";
import courseFileRoutes from "./courseFile.routes";
import userCourseRoutes from "./userCourse.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user-file", userFileRoutes);
router.use("/course", courseRoutes);
router.use("/course-file", courseFileRoutes);
router.use("/user-course", userCourseRoutes);

export default router;
