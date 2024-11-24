import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.schema';
import { Course, CourseSchema } from './models/course.schema';
import { Modules, ModuleSchema } from './models/module.schema';
import { Note, NoteSchema } from './models/Notes.schema';
import { Progress, ProgressSchema } from './models/progress.schema';
import { Quiz, QuizSchema } from './models/Quiz.schema';
import { Response, ResponseSchema } from './models/response.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/elearning-platform'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Modules.name, schema: ModuleSchema },
      { name: Note.name, schema: NoteSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Response.name, schema: ResponseSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
