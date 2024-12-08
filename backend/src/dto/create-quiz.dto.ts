import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  moduleId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsArray()
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    difficulty: string;
  }[];
}
