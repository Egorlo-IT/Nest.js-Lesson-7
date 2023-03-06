import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { engine as expressHbs } from "express-handlebars";
import { join } from "path";
import * as hbs from "hbs";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.engine(
    "hbs",
    expressHbs({
      layoutsDir: join(__dirname, "..", "views/layouts"),
      defaultLayout: "layout",
      extname: "hbs",
      helpers: {
        dateLocal: function (date: string | number | Date) {
          return new Date(date).toLocaleDateString();
        },
        getValue: function (value: string) {
          return JSON.stringify(value);
        },
      },
    }),
  );
  hbs.registerPartials(__dirname + "/views/partials");
  app.setViewEngine("hbs");
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
