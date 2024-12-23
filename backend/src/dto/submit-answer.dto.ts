import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsString()
  quizId: string;

  @IsNotEmpty()
  @IsString()
  selectedAnswer: string;
}
