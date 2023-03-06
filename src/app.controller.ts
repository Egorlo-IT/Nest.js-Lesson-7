import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Request,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Render("index")
  async getHello(@Request() req): Promise<{ message; cookies }> {
    const cookies = req?.cookies?.user ? await req.cookies : null;
    const message = this.appService.sayHello();
    return { message, cookies };
  }

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.login(req.user);
    res.cookie("token", access_token, { httpOnly: true, secure: false });
    return access_token;
  }

  @Post("auth/logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("token");
    res.clearCookie("user");
    return true;
  }

  @Get("auth/token")
  async getCookies(@Request() req): Promise<{ token }> {
    const token = req.cookies?.token?.access_token
      ? await req.cookies.token.access_token
      : null;
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get("auth/user")
  getProfile(@Request() req, @Res({ passthrough: true }) res: Response) {
    res.cookie(
      "user",
      {
        id: req.user.id,
        avatar: req.user.avatar,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        exp: req.user.exp,
      },
      { httpOnly: true, secure: false },
    );
    return req.user;
  }
}
