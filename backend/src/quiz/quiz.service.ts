import { BadRequestException,Injectable,InternalServerErrorException,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Quiz } from '../models/quiz.schema';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UserPerformanceDto } from '../dto/user-performance.dto';
import { Question } from 'src/models/Question.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    @InjectModel('Question') private readonly questionModel: Model<Question>,
  ) {}

  async getQuizById(quizId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async updateQuiz(quizId: string, updateQuizDto: Partial<CreateQuizDto>): Promise<Quiz> {
    if (!isValidObjectId(quizId)) {
      throw new BadRequestException('Invalid Quiz ID');
    }

    const updatedQuiz = await this.quizModel.findByIdAndUpdate(
      quizId,
      { $set: updateQuizDto },
      { new: true }, // Return the updated document
    );

    if (!updatedQuiz) {
      throw new NotFoundException('Quiz not found');
    }

    return updatedQuiz;
  }

  async getNextQuestion(
    _id: string,
    performance: { correctAnswers: number; totalQuestions: number },
  ) {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException(`Invalid quiz ID: ${_id}`);
    }

    const quiz = await this.quizModel.findOne({ _id }).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${_id} not found.`);
    }

    const { correctAnswers, totalQuestions } = performance;
    const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;

    let difficulty: string;
    if (accuracy >= 0.8) difficulty = 'hard';
    else if (accuracy >= 0.5) difficulty = 'medium';
    else difficulty = 'easy';

    const filteredQuestions = quiz.questions.filter(
      (q) => q.difficulty === difficulty,
    );

    if (filteredQuestions.length === 0) {
      throw new NotFoundException(
        `No questions available for difficulty level: ${difficulty}`,
      );
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return { nextQuestion: filteredQuestions[randomIndex] };
  }

  async createQuiz(createQuizDto: CreateQuizDto) {
    const newQuiz = new this.quizModel(createQuizDto);
    try {
      return await newQuiz.save();
    } catch (error) {
      console.error('Error creating quiz:', error.message);
      throw new BadRequestException('Failed to create quiz.');
    }
  }

  async getQuestionByDifficulty(difficulty: string): Promise<Question> {
    return await this.questionModel
      .findOne({ difficulty })
      .sort({ createdAt: 1 })
      .exec();
  }

  async adjustDifficulty(userPerformance: UserPerformanceDto): Promise<string> {
    const { streak, correctAnswersCount, averageTimePerAnswer } = userPerformance;
    let difficulty = 'Easy';

    if (streak >= 3 || correctAnswersCount >= 5) {
      difficulty = averageTimePerAnswer < 10 ? 'Hard' : 'Medium';
    } else if (streak >= 1 || correctAnswersCount >= 2) {
      difficulty = 'Medium';
    }

    return difficulty;
  }

  async getQuizzesByModuleId(moduleId: string) {
    const quizzes = await this.quizModel.find({ moduleId }).exec();

    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException(`No quizzes found for moduleId: ${moduleId}`);
    }

    return quizzes;
  }
}
