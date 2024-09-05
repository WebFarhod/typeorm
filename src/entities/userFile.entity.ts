import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import BaseEntity from "./base.entity";
import User from "./user.entity";

@Entity()
export class UserFile  extends BaseEntity{

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn()
  user: User;
}

export default UserFile;
