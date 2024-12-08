import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProfileByInstructorDto {
  @IsOptional()
  @IsArray()
  @IsString()
  expertise?: string[];

  @IsOptional()
  @IsArray()
  @IsString()
  teachingInterests?: string[];
}
