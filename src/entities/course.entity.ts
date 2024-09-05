import { Entity, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import BaseEntity from "./base.entity";
import User from "./user.entity";
import CourseFile from "./courseFile.entity";
import UserCourse from "./userCourse.entity";

@Entity()
class Course extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => CourseFile, (file) => file.course, {
    cascade: true,
    onDelete: "CASCADE",
  })
  files: CourseFile[];

  @ManyToOne(() => User, (user) => user.courses)
  user: User;

  @OneToMany(() => UserCourse, (userCourse) => userCourse.user)
  userCourses: UserCourse[];
}
export default Course;
