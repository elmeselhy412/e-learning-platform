import { IsString} from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    profilePictureUrl?: string;
    
    @IsString()
    learningPreferences?: string[];
    
    @IsString()
    subjectsOfInterest?: string[];
    
  }
  