import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../models/quiz.schema';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UserPerformanceDto } from '../dto/user-performance.dto';  // Importing the DTO
import { Question } from 'src/models/Question.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    @InjectModel('Question') private readonly questionModel: Model<Question>, // Inject QuestionModel
  ) {}
  // Get the next adaptive question
  async getNextQuestion(_id: string, performance: { correctAnswers: number; totalQuestions: number }) {
    const quiz = await this.quizModel.findOne({ _id }).exec();
    if (!quiz) throw new NotFoundException(`Quiz with ID ${_id} not found.`);

    const { correctAnswers, totalQuestions } = performance;
    const accuracy = correctAnswers / totalQuestions;

    let difficulty: string;
    if (accuracy >= 0.8) difficulty = 'hard'; // High accuracy -> Hard question
    else if (accuracy >= 0.5) difficulty = 'medium'; // Moderate accuracy -> Medium question
    else difficulty = 'easy'; // Low accuracy -> Easy question

    const filteredQuestions = quiz.questions.filter((q) => q.difficulty === difficulty);

    if (filteredQuestions.length === 0) {
      throw new NotFoundException(`No questions available for difficulty level: ${difficulty}`);
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  }

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const newQuiz = new this.quizModel(createQuizDto);
    return newQuiz.save();
  }
  async getQuestionByDifficulty(difficulty: string): Promise<Question> {
    return await this.questionModel
      .findOne({ difficulty })
      .sort({ createdAt: 1 })  // Sort by creation date or use another sorting logic
      .exec();
  }

  // Adjust difficulty based on user performance
  async adjustDifficulty(userPerformance: UserPerformanceDto): Promise<string> {
    const { streak, correctAnswersCount, averageTimePerAnswer } = userPerformance;
    let difficulty = 'Easy'; // Default difficulty

    // Determine difficulty based on performance
    if (streak >= 3 || correctAnswersCount >= 5) {
      difficulty = averageTimePerAnswer < 10 ? 'Hard' : 'Medium'; // Faster answers get harder questions
    } else if (streak >= 1 || correctAnswersCount >= 2) {
      difficulty = 'Medium';
    }

    return difficulty;
  }

}

