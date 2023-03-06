import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { NewsService } from "../news.service";
import { CommentsEntity } from "./comments.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly userService: UsersService,
    private readonly newsService: NewsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(id: number): Promise<CommentsEntity[]> {
    const data = await this.commentsRepository
      .find({
        relations: ["user", "news"],
      })
      .then((result) => {
        const filterData = result.filter((item) => item.news.id === id);
        return filterData;
      });
    return data;
  }

  async findById(id: number): Promise<CommentsEntity> {
    const data = await this.commentsRepository.find({
      where: {
        id: id,
      },
      relations: ["user", "news"],
    });
    return data[0];
  }

  async create(
    idNews: number,
    message: string,
    userId: number,
  ): Promise<CommentsEntity | HttpException> {
    const _news = await this.newsService.findById(idNews);
    const _user = await this.userService.findById(userId);
    if (!_news || !_user) {
      throw new HttpException(
        "Не существует такой новости или пользователя",
        HttpStatus.BAD_REQUEST,
      );
    }
    const _commentEntity = new CommentsEntity();
    _commentEntity.message = message;
    _commentEntity.news = _news;
    _commentEntity.user = _user;
    return await this.commentsRepository.save(_commentEntity);
  }

  async remove(idComment: number, idNews: number) {
    const _comment = await this.findById(idComment);
    this.eventEmitter.emit("comment.remove", {
      idComment: _comment.id,
      idNews: idNews,
    });
    return await this.commentsRepository.remove(_comment);
  }

  async removeAll(idNews) {
    const _comments = await this.findAll(idNews);
    return await this.commentsRepository.remove(_comments);
  }

  async edit(
    idComment: number,
    idNews: number,
    message: string,
    userId: number,
  ): Promise<CommentsEntity> {
    const _news = await this.newsService.findById(idNews);
    const _user = await this.userService.findById(userId);
    if (!_news || !_user) {
      throw new HttpException(
        "Не существует такой новости или пользователя",
        HttpStatus.BAD_REQUEST,
      );
    }
    const _commentEntity = new CommentsEntity();
    _commentEntity.message = message;
    _commentEntity.news = _news;
    _commentEntity.user = _user;
    await this.commentsRepository.update(idComment, _commentEntity);
    return _commentEntity;
  }
}
