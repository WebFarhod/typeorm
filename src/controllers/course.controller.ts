import { Request, Response, NextFunction } from "express";
import CourseService from "../services/course.service";

class CourseController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid parametrs",
        });
      }

      const user = req.user;
      const course = await CourseService.create(user, title, description);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const courses = await CourseService.getAll(
        Number(page),
        Number(limit)
      );
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const course = await CourseService.getCourseInfo(id);
      res.json(course);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const user = req.user;
      const course = await CourseService.update(id, user, title, description);
      res.json(course);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user;
      const result = await CourseService.delete(id, user);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CourseController();
