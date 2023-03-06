import { IsNotEmpty, IsString } from "class-validator";
export class CommentIdDto {
  @IsString()
  @IsNotEmpty()
  idComment: number;
  @IsString()
  @IsNotEmpty()
  idNews: number;
}
