import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import BaseEntity from "./base.entity";
import bcrypt from "bcrypt";
import UserFile from "./userFile.entity";
import Course from "./course.entity";
import UserCourse from "./userCourse.entity";

@Entity()
class User extends BaseEntity {
  @Index("email_index")
  @Column({ unique: true, type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 255 })
  username: string;

  @OneToMany(() => UserFile, (file) => file.user)
  files: UserFile[];

  @OneToMany(() => Course, (course) => course.user)
  courses: Course[];

  @OneToMany(() => UserCourse, (course) => course.user)
  userCourses: UserCourse[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

export default User;
