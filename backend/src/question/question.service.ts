import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../models/question.schema'; 
import { UserPerformanceDto } from '../dto/user-performance.dto';  

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<Question>,
  ) {}

  async getQuestionByDifficulty(difficulty: string): Promise<Question | null> {
    return this.questionModel
      .findOne({ difficulty })
      .sort({ createdAt: 1 })  
      .exec();
  }

  async adjustDifficulty(userPerformance: UserPerformanceDto): Promise<string> {
    const { streak, correctAnswersCount } = userPerformance;
    if (streak >= 3 || correctAnswersCount >= 5) {
      return 'Hard';
    } else if (streak >= 1 || correctAnswersCount >= 2) {
      return 'Medium'; 
    } else {
      return 'Easy';
    }
  }

  async getQuestionForUser(userPerformance: UserPerformanceDto): Promise<Question | null> {
    const difficulty = await this.adjustDifficulty(userPerformance);
    return this.getQuestionByDifficulty(difficulty);
  }

  async createQuestion(questionData: Partial<Question>): Promise<Question> {
    const createdQuestion = new this.questionModel(questionData);
    return createdQuestion.save();
  }

}
