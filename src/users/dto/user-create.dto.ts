import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { Role } from "src/auth/role/role.enum";

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  role: Role;
}
