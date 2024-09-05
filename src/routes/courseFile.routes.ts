import { Router } from "express";
import upload from "../middlewares/multer.middleware";
import AuthMiddleware from "../middlewares/auth.middleware";
import courseFileController from "../controllers/courseFile.controller";

const router = Router();

router.post(
  "/:courseId",
  AuthMiddleware,
  upload.single("file"),
  courseFileController.upload
);
router.get(
  "/:courseId/file/:fileId",
  AuthMiddleware,
  courseFileController.getFile
);
router.delete(
  "/:courseId/file/:fileId",
  AuthMiddleware,
  courseFileController.delete
);

export default router;
