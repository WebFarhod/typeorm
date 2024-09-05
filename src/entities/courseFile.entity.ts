import { Entity, Column, JoinColumn, OneToOne, ManyToOne } from "typeorm";
import BaseEntity from "./base.entity";
import Course from "./course.entity";

@Entity()
class CourseFile extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => Course, (course) => course.files, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  course: Course;
}
export default CourseFile;
