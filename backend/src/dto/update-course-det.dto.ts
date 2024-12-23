import { IsString, IsOptional } from 'class-validator';

export class UpdateCoursedetDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  difficultyLevel?: string;
}
