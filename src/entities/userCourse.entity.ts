import { Entity, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import BaseEntity from "./base.entity";
import User from "./user.entity";
import CourseFile from "./courseFile.entity";
import Course from "./course.entity";

@Entity()
class UserCourse extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userCourses)
  user: User;

  @ManyToOne(() => Course, (course) => course.userCourses)
  courses: Course;
}
export default UserCourse;
