import { forwardRef, Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { SocketCommentsGateway } from "./socket-comments.gateway";
import { CommentsController } from "./comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentsEntity } from "./comments.entity";
import { UsersModule } from "src/users/users.module";
import { NewsModule } from "../news.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  providers: [CommentsService, SocketCommentsGateway],
  controllers: [CommentsController],
  imports: [
    forwardRef(() => NewsModule),
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([CommentsEntity]),
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
