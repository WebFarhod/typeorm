import { AppDataSource } from "../config/typeorm";
import CourseFile from "../entities/courseFile.entity";
import Course from "../entities/course.entity";
import fs from "fs";
import path from "path";
import BaseError from "../utils/base.error";
import IJwtUser from "../types/user";

class CourseFileService {
  private courseFileRepository = AppDataSource.getRepository(CourseFile);
  private courseRepository = AppDataSource.getRepository(Course);

  async upload(courseId: string, file: Express.Multer.File, user: IJwtUser) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId, user: { id: user.sub } },
    });
    if (!course) {
      throw BaseError.NotFoundError("Course not found");
    }

    const courseFile = this.courseFileRepository.create({
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      course,
    });

    await this.courseFileRepository.save(courseFile);

    return { return: "upload" };
  }

  async getFile(courseId: string, fileId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ["files"],
    });

    if (!course) {
      throw BaseError.NotFoundError("Course not found");
    }
    const courseFile = await this.courseFileRepository.findOne({
      where: { id: fileId, course: { id: course.id } },
    });
    if (!courseFile) {
      throw BaseError.NotFoundError("File not found");
    }

    return courseFile;
  }

  async delete(courseId: string, fileId: string, user: IJwtUser) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId, user: { id: user.sub } },
      relations: ["files"],
    });

    if (!course) {
      throw BaseError.NotFoundError("Course not found");
    }
    const file = await this.courseFileRepository.findOne({
      where: { id: fileId, course: { id: course.id } },
    });

    if (file) {
      const filePath = path.join("uploads", file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });

      await this.courseFileRepository.remove(file);

      return { message: "File deleted successfully" };
    } else {
      throw BaseError.NotFoundError("File not found");
    }
  }
}

export default new CourseFileService();
