import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class AddTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: "La taille minimale du champ name est de 6 caractères" })
  @MaxLength(25)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}
