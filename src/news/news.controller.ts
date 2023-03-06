import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  HttpStatus,
  HttpException,
  UseInterceptors,
  Render,
  UploadedFile,
  Query,
  Request,
} from "@nestjs/common";
import { NewsService } from "./news.service";
import { CommentsService } from "./comments/comments.service";
import { NewsIdDto } from "./dtos/news-id.dto";
import { NewsCreateDto } from "./dtos/news-create.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { HelperFileLoaderNews } from "../utils/helperFileLoaderNews";
import { imageFileFilter } from "../utils/imageFileFilter";
// import { MailService } from '../mail/mail.service';
import { NewsEntity } from "./news.entity";
import { CategoriesService } from "../categories/categories.service";
import { UsersService } from "../users/users.service";

const NEWS_PATH = "/news-static/";
const newsHelperFileLoader = new HelperFileLoaderNews();
newsHelperFileLoader.path = NEWS_PATH;

@Controller("news")
export class NewsController {
  constructor(
    private newsService: NewsService,
    private readonly commentsService: CommentsService,
    private usersService: UsersService,
    private categoriesService: CategoriesService, // private mailService: MailService,
  ) {}

  @Post("create")
  @UseInterceptors(
    FileInterceptor("cover", {
      storage: diskStorage({
        destination: newsHelperFileLoader.destinationPath,
        filename: newsHelperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Request() req,
    @Body() news: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    try {
      const cookies = req.cookies?.user ? await req.cookies : null;
      const _user = await this.usersService.findById(+cookies.user.id);
      if (!_user) {
        throw new HttpException(
          "Не существует такого автора",
          HttpStatus.BAD_REQUEST,
        );
      }
      const _category = await this.categoriesService.findById(news.categoryId);
      if (!_category) {
        throw new HttpException(
          "Не существует такой категории",
          HttpStatus.BAD_REQUEST,
        );
      }

      const _newsEntity = new NewsEntity();
      if (cover?.filename) {
        _newsEntity.cover = NEWS_PATH + cover.filename;
      }
      _newsEntity.title = news.title;
      _newsEntity.description = news.description;
      _newsEntity.user = _user;
      _newsEntity.category = _category;

      const _news = await this.newsService.create(_newsEntity);
      // await this.mailService.sendNewNewsForAdmins(
      //   ['egorlo@mail.ru', 'egorlo059@gmail.com'],
      //   _news,
      // );
      return _news;
    } catch (error) {
      console.log(error);
    }
  }

  @Post("edit")
  @UseInterceptors(
    FileInterceptor("cover", {
      storage: diskStorage({
        destination: newsHelperFileLoader.destinationPath,
        filename: newsHelperFileLoader.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async edit(
    @Query("idNews") idNews: string,
    @Body() news: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    try {
      const _newsPrevios = await this.newsService.findById(+idNews);
      if (!_newsPrevios) {
        throw new HttpException(
          "Не существует такой новости",
          HttpStatus.BAD_REQUEST,
        );
      }

      const _user = await this.usersService.findById(news.authorId);
      if (!_user) {
        throw new HttpException(
          "Не существует такого автора",
          HttpStatus.BAD_REQUEST,
        );
      }
      const _category = await this.categoriesService.findById(news.categoryId);
      if (!_category) {
        throw new HttpException(
          "Не существует такой категории",
          HttpStatus.BAD_REQUEST,
        );
      }

      const _newsEntity = new NewsEntity();
      if (cover?.filename) {
        _newsEntity.cover = NEWS_PATH + cover.filename;
      }
      _newsEntity.title = news.title;
      _newsEntity.description = news.description;
      _newsEntity.user = _user;
      _newsEntity.category = _category;

      const _newsNew = await this.newsService.edit(_newsEntity, +idNews);
      // await this.mailService.sendEditNewsForAdmins(
      //   ['egorlo@mail.ru', 'egorlo059@gmail.com'],
      //   _newsNew,
      //   _newsPrevios,
      // );
      return _newsNew;
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(":id")
  async delete(@Param() params: NewsIdDto): Promise<boolean> {
    return this.newsService.remove(+params.id);
    // &&
    // this.commentService.removeAll(params.id)
  }

  @Get()
  @Render("news-list")
  async getViewAll(
    @Request() req,
  ): Promise<{ news: NewsEntity[]; cookies: any }> {
    const news = await this.newsService.findAll();
    const cookies = req?.cookies?.user ? await req.cookies : null;
    return { ...news, cookies };
  }

  @Get(":id/detail")
  @Render("news-details")
  async getByIdDetail(@Param() params: NewsIdDto, @Request() req) {
    const cookies = req.cookies?.user ? await req.cookies : null;
    const news = await this.newsService.findById(+params.id);
    const comments = await this.commentsService.findAll(+params.id);
    return { news, comments, cookies };
  }
}
