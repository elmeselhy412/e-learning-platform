import { IsString, IsNumber } from 'class-validator';

export class CourseProgressDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly courseId: string;

  @IsNumber()
  readonly completionPercentage: number;
}
