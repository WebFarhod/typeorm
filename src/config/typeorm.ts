import { DataSource } from "typeorm";
import User from "../entities/user.entity";
import UserFile from "../entities/userFile.entity";
import Course from "../entities/course.entity";
import CourseFile from "../entities/courseFile.entity";
import UserCourse from "../entities/userCourse.entity";
const port = process.env.DB_PORT as number | undefined;
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  ssl: {
    rejectUnauthorized: false // Yoki kerakli SSL konfiguratsiyasini kiriting
  },
  entities: [User, UserFile, Course, CourseFile, UserCourse],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source initialized successfully");
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization:", err);
//   });
