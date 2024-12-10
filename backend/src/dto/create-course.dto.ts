import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  difficultyLevel: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string; // This would be the user ID of the instructor or creator
}
