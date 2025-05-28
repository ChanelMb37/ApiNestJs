import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, Min, Max } from "class-validator";

export class UpdateCvDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  firstname: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(15)
  @Max(65)
  age: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cin: number;

  @IsOptional()
  @IsString()
  job: string;

  @IsOptional()
  @IsString()
  path: string;
}
