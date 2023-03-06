import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger, UseGuards } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { WsJwtGuard } from "../../auth/ws-jwt.guard";
import { CommentsService } from "./comments.service";
import { OnEvent } from "@nestjs/event-emitter";

export type Comment = { message: string; idNews: number; idComment?: number };

@WebSocketGateway()
export class SocketCommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");

  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("addComment")
  async handleMessage(client: Socket, comment: Comment): Promise<void> {
    const { idNews, message } = comment;
    const userId: number = client.data.user.id;
    const _comment = await this.commentsService.create(idNews, message, userId);
    this.server.to(idNews.toString()).emit("newComment", _comment);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("editComment")
  async handleMessageEditComment(
    client: Socket,
    comment: Comment,
  ): Promise<void> {
    const { idComment, idNews, message } = comment;
    const userId: number = client.data.user.id;
    await this.commentsService.edit(idComment, idNews, message, userId);
    const comments = await this.commentsService.findAll(idNews);

    console.log("comments:", comments);

    this.server.to(idNews.toString()).emit("editComment", { comments });
  }

  @OnEvent("comment.remove")
  handleRemoveCommentEvent(payload): void {
    const { idComment, idNews } = payload;
    this.server.to(idNews.toString()).emit("removeComment", { idComment });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): void {
    this.logger.log("Init");
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const { newsId } = client.handshake.query;
    // После подключения пользователя к веб-сокету, подключаем его в комнату
    client.join(newsId);
    this.logger.log(`Client connected: ${client.id}`);
  }
}
