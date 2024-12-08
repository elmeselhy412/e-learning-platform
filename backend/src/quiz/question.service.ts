// question.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../models/question.schema';  // Assuming you have a schema for Question
import { UserPerformanceDto } from '../dto/user-performance.dto';  // Assuming you have a DTO for user performance

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<Question>,
  ) {}

  // Get a question by its difficulty level
  async getQuestionByDifficulty(difficulty: string): Promise<Question | null> {
    return this.questionModel
      .findOne({ difficulty })
      .sort({ createdAt: 1 })  // Sort by creation date or another field
      .exec();
  }

  // Adjust difficulty based on user performance
  async adjustDifficulty(userPerformance: UserPerformanceDto): Promise<string> {
    const { streak, correctAnswersCount } = userPerformance;
    if (streak >= 3 || correctAnswersCount >= 5) {
      return 'Hard'; // Upgrade to harder questions if user has a good streak or many correct answers
    } else if (streak >= 1 || correctAnswersCount >= 2) {
      return 'Medium'; // Keep at medium difficulty
    } else {
      return 'Easy'; // Stay at easy difficulty
    }
  }

  // Get a question for the user based on their performance (adjust difficulty)
  async getQuestionForUser(userPerformance: UserPerformanceDto): Promise<Question | null> {
    const difficulty = await this.adjustDifficulty(userPerformance);
    return this.getQuestionByDifficulty(difficulty);
  }

  // Add a new question to the database
  async createQuestion(questionData: Partial<Question>): Promise<Question> {
    const createdQuestion = new this.questionModel(questionData);
    return createdQuestion.save();
  }

}
