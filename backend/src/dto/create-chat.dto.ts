import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  instructorId: string;

  @IsNotEmpty()
  @IsString()
  topic: string;
}
