import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid parametrs",
        });
      }
      await authService.register(email, password, username);
      return res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid parametrs",
        });
      }
      const data = await authService.login(email, password);
      res.cookie("refresh_token", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const data = await authService.getuserInfo(user);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    res.clearCookie("refresh_token");
    try {
      const { refresh_token } = req.cookies;
      const data = await authService.refresh(refresh_token);

      return res.json(data);
    } catch (error) {
      next(error);
    }
    return res.json("logout");
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await req.user;
      const data = await authService.logout(user);
      res.clearCookie("refresh_token");
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
export default new AuthController();
