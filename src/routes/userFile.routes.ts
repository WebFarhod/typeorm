import { Router } from "express";
import upload from "../middlewares/multer.middleware";
import AuthMiddleware from "../middlewares/auth.middleware";
import userFileController from "../controllers/userFile.controller";

const router = Router();

router.post(
  "",
  AuthMiddleware,
  upload.array("files", 10),
  userFileController.upload
);
router.get("", AuthMiddleware, userFileController.getAll);
router.get("/:id", AuthMiddleware, userFileController.getFile);
router.get("/download/:id", AuthMiddleware, userFileController.download);
router.put("/:id", AuthMiddleware, userFileController.update);
router.delete("/:id", AuthMiddleware, userFileController.delete);

export default router;
