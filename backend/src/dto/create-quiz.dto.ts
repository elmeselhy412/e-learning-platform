import { IsArray, IsMongoId, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  options: string[];

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsString()
  difficulty: 'easy' | 'medium' | 'hard';

  @IsString()
  hint?: string;
}

export class CreateQuizDto {
  @IsMongoId()
  @IsNotEmpty()
  moduleId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
