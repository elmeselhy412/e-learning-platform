import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../models/quiz.schema';
import { CreateQuizDto } from '../dto/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>) {}

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
}

