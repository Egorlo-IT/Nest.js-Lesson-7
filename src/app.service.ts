import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  sayHello(): { message: string } {
    return {
      message:
        "Практическое задание - Урок 6. Авторизация через Guard. Helmet, CSRF Protection, защита веб-сервера",
    };
  }
}
