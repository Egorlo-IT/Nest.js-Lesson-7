import { IsNotEmpty, IsString } from "class-validator";
export class CommentCreateDto {
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsString()
  userId: number;
}
