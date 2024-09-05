import { Request, Response, NextFunction } from "express";
import CourseService from "../services/course.service";
import userCourseService from "../services/userCourse.service";

class UserCourseController {
  async addCourseToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid parametrs",
        });
      }
      const data = await userCourseService.addCourseToUser(user, courseId);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getUserCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const courses = await userCourseService.getUserCourses(user);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async deleteUserCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user;
      const result = await userCourseService.deleteUserCourse(id, user);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserCourseController();
