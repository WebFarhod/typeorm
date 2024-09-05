import User from "../entities/user.entity";
import BaseError from "../utils/base.error";
import IJwtUser from "../types/user";
import { AppDataSource } from "../config/typeorm";
import UserFile from "../entities/userFile.entity";
import fs from "fs";
import path from "path";

class UserFileService {
  private readonly userFilesRepository = AppDataSource.getRepository(UserFile);
  private readonly userRepository = AppDataSource.getRepository(User);

  async upload(files: Express.Multer.File[], userData: IJwtUser) {
    const user = await this.userRepository.findOneBy({ id: userData.sub });
    if (!user) {
      throw BaseError.NotFoundError("User not found");
    }
    await Promise.all(
      files.map(async (file) => {
        const newFile = new UserFile();
        newFile.filename = file.filename;
        newFile.path = file.path;
        newFile.size = file.size;
        newFile.mimetype = file.mimetype;
        newFile.user = user;

        await this.userFilesRepository.save(newFile);
      })
    );
    return { message: "upload" };
  }

  async getAll(page: number, limit: number, userData: IJwtUser) {
    const startIndex = (page - 1) * limit;

    const userId = userData.sub;

    const files = await this.userFilesRepository.find({
      where: { user: { id: userId } },
      skip: startIndex,
      take: limit,
    });
    if (!files) {
      throw BaseError.NotFoundError("Files not found");
    }
    const totalFiles = await this.userFilesRepository.count({
      where: { user: { id: userId } },
    });

    return { files, totalFiles, page };
  }

  async getFile(id: string, userData: IJwtUser) {
    const files = await this.userFilesRepository.find({
      where: { user: { id: userData.sub }, id },
    });

    if (files) {
      return { files };
    } else {
      throw BaseError.NotFoundError("File not found");
    }
  }

  async download(id: string, userData: IJwtUser) {
    const file = await this.userFilesRepository.findOne({
      where: {
        id: id,
        user: { id: userData.sub },
      },
    });
    if (file) {
      return file.filename;
    } else {
      throw BaseError.NotFoundError("File not found");
    }
  }

  async update(id: string, newFilename: string, userData: IJwtUser) {
    const file = await this.userFilesRepository.findOne({
      where: {
        id,
        user: { id: userData.sub },
      },
    });

    if (!file) {
      throw BaseError.NotFoundError("File not found");
    }

    const oldFilePath = path.join("uploads", file.filename);

    const oldFileExtension = file.filename.split(".").pop();
    if (!oldFileExtension) {
      throw BaseError.BadRequest("Could not determine file extension");
    }

    const newFilePath = path.join(
      "uploads",
      `${newFilename}.${oldFileExtension}`
    );

    if (fs.existsSync(newFilePath)) {
      throw BaseError.BadRequest("A file with the new name already exists");
    }

    if (!fs.existsSync(oldFilePath)) {
      throw BaseError.NotFoundError("Old file not found");
    }

    try {
      fs.renameSync(oldFilePath, newFilePath);
    } catch (error) {
      throw BaseError.BadRequest("Error renaming file");
    }

    file.filename = `${newFilename}.${oldFileExtension}`;
    await this.userFilesRepository.save(file);

    return file;
  }

  async delete(id: string, userData: IJwtUser) {
    const file = await this.userFilesRepository.findOne({
      where: {
        id: id,
        user: { id: userData.sub },
      },
    });

    if (file) {
      const filePath = path.join("uploads", file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });

      await this.userFilesRepository.remove(file);

      return { message: "File deleted successfully" };
    } else {
      throw BaseError.NotFoundError("File not found");
    }
  }
}
export default new UserFileService();
