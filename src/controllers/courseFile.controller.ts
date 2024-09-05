import { NextFunction, Request, Response } from "express";
import BaseError from "../utils/base.error";
import courseFileService from "../services/courseFile.service";

class UserFileController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const file = req.file as unknown as Express.Multer.File;
      const user = req.user;
      if (!file) {
        return next(BaseError.BadRequest("NO file upload"));
      }
      const data = await courseFileService.upload(courseId, file, user);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  async getFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, fileId } = req.params;
      if (!courseId || !fileId) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid parametrs",
        });
      }
      const data = await courseFileService.getFile(courseId, fileId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, fileId } = req.params;
      const user = req.user;
      if (!courseId || !fileId) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid parametrs",
        });
      }

      const data = await courseFileService.delete(courseId, fileId, user);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
export default new UserFileController();
