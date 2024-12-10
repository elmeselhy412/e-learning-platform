import { IsInt, IsOptional, Min } from 'class-validator';

export class UserPerformanceDto {
  @IsInt()
  @Min(0)
  streak: number;

  @IsInt()
  @Min(0)
  correctAnswersCount: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  averageTimePerAnswer?: number; // Optional field for time-based difficulty adjustment
}