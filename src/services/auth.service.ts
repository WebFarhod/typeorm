import { AppDataSource } from "../config/typeorm";
import UserJwtDto from "../dtos/user.dto";
import User from "../entities/user.entity";
import BaseError from "../utils/base.error";
import jwt from "../utils/jwt";
import IJwtUser from "../types/user";
// import redisClient from "../config/redis";

class AuthService {
  private readonly userRepository = AppDataSource.getRepository(User);

  async register(email: string, password: string, username: string) {
    const exitUser = await this.userRepository.findOneBy({ email });
    if (exitUser) {
      throw BaseError.BadRequest(
        `The user is already registered with this email ${email}`
      );
    }
    const create = this.userRepository.create({ email, password, username });
    return this.userRepository.save(create);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    const isMatched = await User.comparePasswords(
      password,
      user?.password ?? ""
    );
    if (!user || !isMatched) {
      throw BaseError.BadRequest("Invalid email or password");
    }
    const userDto = new UserJwtDto(user);
    const token = jwt.sign(userDto.data());
    // await redisClient.set(`refreshToken:${user.id}`, token.refreshToken);

    return { user: { ...userDto }, ...token };
  }

  async getuserInfo(userData: IJwtUser) {
    const user = await this.userRepository.findOne({
      where: { id: userData.sub },
      relations: ["files", "courses"],
    });

    if (!user) {
      throw BaseError.NotFoundError("User not fount");
    }

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw BaseError.UnauthorizedError();
    }

    const userPayload = jwt.validateRefreshToken(refreshToken);
    if (!userPayload || typeof userPayload === "string") {
      throw BaseError.UnauthorizedError();
    }

    // const storedToken = await redisClient.get(
    //   `refreshToken:${userPayload.sub}`
    // );

    // if (refreshToken !== storedToken) {
    //   throw BaseError.UnauthorizedError();
    // }

    const user = await this.userRepository.findOneBy({
      email: userPayload.email,
    });

    if (!user) {
      throw BaseError.UnauthorizedError();
    }
    const userDto = new UserJwtDto(user);
    const token = jwt.sign(userDto.data());
    // await redisClient.set(`refreshToken:${user.id}`, token.refreshToken);

    return { accessToken: token.accessToken };
  }

  async logout(userData: IJwtUser) {
    // await redisClient.del(`refreshToken:${userData.sub}`);
    return { message: "logout" };
  }

  async findById(id: User["id"]): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }
}
export default new AuthService();
