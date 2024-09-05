import { AppDataSource } from "../config/typeorm";
import Course from "../entities/course.entity";
import IJwtUser from "../types/user";
import BaseError from "../utils/base.error";
import fs from "fs";
import path from "path";

class CourseService {
  private courseRepository = AppDataSource.getRepository(Course);

  async create(user: IJwtUser, title: string, description: string) {
    const course = this.courseRepository.create({
      title,
      description,
      user: { id: user.sub },
    });
    await this.courseRepository.save(course);
    return { message: "created" };
  }

  async getAll(page: number, limit: number) {
    const [courses, total] = await this.courseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      courses,
      total,
      page,
      limit,
    };
  }

  async getCourseInfo(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });
    if (!course) {
      throw BaseError.NotFoundError("Course not found");
    }
    return course;
  }

  async update(id: string, user: IJwtUser, title: string, description: string) {
    const course = await this.courseRepository.findOne({
      where: { id, user: { id: user.sub } },
    });
    if (!course) {
      throw BaseError.NotFoundError("Course not found");
    }

    course.title = title;
    course.description = description;
    const UpdateCourse = await this.courseRepository.save(course);
    return { message: "update", course: UpdateCourse };
  }

  async delete(id: string, user: IJwtUser) {
    const course = await this.courseRepository.findOne({
      where: { id, user: { id: user.sub } },
      relations: ["files"],
    });
    if (!course) {
      throw BaseError.NotFoundError("Course not found");
    }

    if (course.files && course.files.length > 0) {
      for (const file of course.files) {
        const filePath = path.join("uploads", file.filename);
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }
    }

    await this.courseRepository.remove(course);
    return { message: "Course deleted successfully" };
  }
}

export default new CourseService();
