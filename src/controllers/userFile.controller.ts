import { NextFunction, Request, Response } from "express";
import userFileService from "../services/userFile.service";

class UserFileController {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const user = req.user;
      const data = await userFileService.upload(files, user);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const user = req.user;
      const data = await userFileService.getAll(page, limit, user);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  async getFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user;
      const data = await userFileService.getFile(id, user);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user;

      const filename = await userFileService.download(id, user);
      res.download(`uploads/${filename}`);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user;

      const data = await userFileService.delete(id, user);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid parametrs",
        });
      }
      const user = req.user;

      const data = await userFileService.update(id, filename, user);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
export default new UserFileController();
