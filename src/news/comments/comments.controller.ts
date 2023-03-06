import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentIdDto } from "./dtos/comment-id.dto";
import { CommentCreateDto } from "./dtos/comment-create.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { NewsIdDto } from "../dtos/news-id.dto";
import { ParseIntPipe } from "@nestjs/common/pipes";

@Controller("news-comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create/:idNews")
  create(
    @Param("idNews", ParseIntPipe) idNews: number,
    @Body() comment: CommentCreateDto,
  ) {
    return this.commentsService.create(
      idNews,
      comment.message,
      +comment.userId,
    );
  }

  // @Post("create")
  // @UseGuards(JwtAuthGuard)
  // async create(
  //   @Request() req,
  //   @Query("idNews") idNews: string,
  //   @Body() comment: CommentCreateDto,
  // ) {
  //   try {
  //     const jwtUserId = req.user.userId;
  //     console.log("jwtUserId:", jwtUserId);

  //     // const cookies = req.cookies?.user ? await req.cookies : null;
  //     const _user = await this.usersService.findById(+jwtUserId);
  //     // const _user = await this.usersService.findById(+cookies.user.id);
  //     if (!_user) {
  //       throw new HttpException(
  //         "Не существует такого автора",
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const _news = await this.newsService.findById(+idNews);
  //     if (!_news) {
  //       throw new HttpException(
  //         "Не существует такой категории",
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //     const _comment = await this.commentsService.create(
  //       +idNews,
  //       comment.message,
  //       +_user.id,
  //     );
  //     return _comment;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // @Post("edit")
  // async edit(
  //   @Query("idComment") idComment: string,
  //   @Body() comment: CommentEditDto,
  // ) {
  //   const _commentPrevios = await this.commentsService.findById(+idComment);

  //   if (!_commentPrevios) {
  //     throw new HttpException(
  //       "Не существует такого комментария",
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const _commentsEntity = new CommentsEntity();

  //   _commentsEntity.message = comment.message;

  //   const _commentNew = await this.commentsService.edit(
  //     _commentsEntity,
  //     +idComment,
  //   );

  //   return _commentNew;
  // }

  @Post("edit/:idComment/:idNews")
  @UseGuards(JwtAuthGuard)
  async edit(
    @Param("idComment", ParseIntPipe) idComment: number,
    @Param("idNews", ParseIntPipe) idNews: number,
    @Body() comment: CommentCreateDto,
  ) {
    return this.commentsService.edit(
      +idComment,
      +idNews,
      comment.message,
      +comment.userId,
    );
  }

  @Delete(":idComment/:idNews")
  @UseGuards(JwtAuthGuard)
  async remove(@Param() params: CommentIdDto) {
    const { idComment, idNews } = params;
    return this.commentsService.remove(idComment, idNews);
  }

  @Get("all/news/:id")
  async getAll(@Param() params: NewsIdDto) {
    const comments = await this.commentsService.findAll(+params.id);
    return comments;
  }
}
