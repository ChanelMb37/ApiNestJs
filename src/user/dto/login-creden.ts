import { IsEmail, IsNotEmpty } from "class-validator";

export class UserSubscribeDto {
  @IsNotEmpty()
  username: string; // Username of the user

  @IsEmail()
  @IsNotEmpty()
  email: string; // Email of the user

  @IsNotEmpty()
  password: string; // Password of the user, should be hashed before storing
}
