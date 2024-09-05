import { AppDataSource } from "../config/typeorm";
import Course from "../entities/course.entity";
import User from "../entities/user.entity";
import UserCourse from "../entities/userCourse.entity";
import IJwtUser from "../types/user";
import BaseError from "../utils/base.error";
import fs from "fs";
import path from "path";

class UserCourseService {
  private userRepository = AppDataSource.getRepository(User);
  private courseRepository = AppDataSource.getRepository(Course);
  private userCourseRepository = AppDataSource.getRepository(UserCourse);

  async addCourseToUser(userData: IJwtUser, courseId: string) {
    const course = await this.courseRepository.findOneBy({ id: courseId });

    if (!course) {
      throw BaseError.NotFoundError("Course not found");
    }
    const user = await this.userRepository.findOneBy({ id: userData.sub });

    if (!user) {
      throw BaseError.NotFoundError("User not found");
    }

    const existingUserCourse = await this.userCourseRepository.findOne({
      where: { user: { id: user.id }, courses: { id: course.id } },
    });

    if (existingUserCourse) {
      throw BaseError.BadRequest("Course already assigned to the use");
    }

    const userCourse = new UserCourse();
    userCourse.user = user;
    userCourse.courses = course;

    await this.userCourseRepository.save(userCourse);

    return { message: "Course added to user successfully" };
  }

  async getUserCourses(userData: IJwtUser) {
    const courses = await this.userCourseRepository.find({
      where: { user: { id: userData.sub } },
      relations: ["courses"],
    });

    return courses;
  }

  async deleteUserCourse(id: string, userData: IJwtUser) {
    const userCourse = await this.userCourseRepository.findOne({
      where: {
        user: { id: userData.sub },
        courses: { id },
      },
      relations: ["user", "courses"],
    });

    if (!userCourse) {
      throw BaseError.NotFoundError("UserCourse not found");
    }

    await this.userCourseRepository.remove(userCourse);

    return { message: "UserCourse deleted successfully" };
  }
}

export default new UserCourseService();
