import { IsString, IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

// Enum for user roles
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)  // Ensure password is at least 6 characters long
  readonly password: string;

  @IsEnum(UserRole)
  readonly role: UserRole;
}
