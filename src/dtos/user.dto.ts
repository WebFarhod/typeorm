import User from "../entities/user.entity";

class UserJwtDto {
  sub: string;
  username: string;
  email: string;

  constructor(payload: User) {
    this.sub = payload.id;
    this.username = payload.username;
    this.email = payload.email;
  }

  data() {
    return {
      sub: this.sub,
      username: this.username,
      email: this.email,
    };
  }
}

export default UserJwtDto;
