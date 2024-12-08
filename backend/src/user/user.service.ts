import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.schema'; // Assuming User schema is defined
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateProfileByInstructorDto } from 'src/dto/update-profile-by-instructor.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Fetch user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  // Compare provided password with stored hashed password
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

async createUser(createUserDto: CreateUserDto) {
  const { password, role, name, email } = createUserDto;

  if (!password || !email || !role || !name) {
    throw new Error('Email and password are required');
  }

  // Hash the password using bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create the user object
  const newUser = new this.userModel({
    email,
    passwordHash: hashedPassword,
    role,
    name,
  });

  // Save the user
  try {
    await newUser.save();
    return { message: 'User registered successfully' };
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Error registering user');
  }
}
async updateProfile(userId: string, updateProfileByInstructorDto: UpdateProfileByInstructorDto): Promise<User> {
  if (!isValidObjectId(userId)) {
    throw new BadRequestException('Invalid MongoDB ID format');
  }

  // Use $addToSet to avoid duplicates or $push to allow duplicates
  const updateOperations: any = {};
  if (updateProfileByInstructorDto.expertise) {
    updateOperations.$addToSet = {
      ...(updateOperations.$addToSet || {}),
      expertise: { $each: updateProfileByInstructorDto.expertise },
    };
  }
  if (updateProfileByInstructorDto.teachingInterests) {
    updateOperations.$addToSet = {
      ...(updateOperations.$addToSet || {}),
      teachingInterests: { $each: updateProfileByInstructorDto.teachingInterests },
    };
  }
  const user = await this.userModel.findByIdAndUpdate(
    userId,
    updateOperations,
    { new: true }, // Return the updated document
  ).exec();

  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;

}
    
}