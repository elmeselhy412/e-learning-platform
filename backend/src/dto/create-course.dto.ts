import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsArray()
  @IsOptional()
  readonly modules?: string[]; // Optional array of modules (e.g., videos, lectures)
}
