import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersEntity } from "./users.entity";
import { AuthModule } from "../auth/auth.module";
import { ProfileModule } from "./profile/profile.module";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    forwardRef(() => AuthModule),
    ProfileModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
