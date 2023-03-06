import { forwardRef, Module } from "@nestjs/common";
import { UsersModule } from "../users.module";
import { ProfileController } from "./profile.controller";

@Module({
  controllers: [ProfileController],
  imports: [forwardRef(() => UsersModule)],
})
export class ProfileModule {}
