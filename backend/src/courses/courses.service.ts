import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Note, NoteDocument } from '../models/Notes.schema'; // Adjust path if necessary
import { CreateCourseDto } from 'src/dto/create-course.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Course, CourseDocument } from 'src/models/course.schema';
import { EnrollCourseDto } from 'src/dto/enroll-course.dto';
import { User, UserDocument } from 'src/models/user.schema';
import { BroadcastService } from 'src/broadcast/broadcast.service';

@Injectable()
export class CoursesService {
  
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(Course.name) private courseModel:Model<CourseDocument>,
    @InjectModel(User.name) private userModel:Model<UserDocument>,
    private broadcastService: BroadcastService, // Inject BroadcastService

  ) {}

 
  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    // Ensure that the course title is unique (optional validation)
    const existingCourse = await this.courseModel.findOne({ title: createCourseDto.title });
    if (existingCourse) {
      throw new BadRequestException('A course with this title already exists');
    }
    const newCourse = new this.courseModel(createCourseDto);

    await this.broadcastService.createBroadcast(
      'New Course Created',
      `A new course titled "${newCourse.title}" has been added to the platform.`,
      ['student', 'instructor', 'admin'], 
    );   

    return newCourse.save();
  }
  async getAllCourses() {
    return this.courseModel.find().exec();
  }
  
  
  async adjustAndOptimizeCourses(
    folderPath: string,
    feedbackData: Record<string, any>,
    performanceData: Record<string, any>,
  ): Promise<string> {
    if (!fs.existsSync(folderPath)) {
      throw new Error(`The folder path "${folderPath}" does not exist.`);
    }
    
  
    try {
      const files = fs.readdirSync(folderPath);
  
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
  
        if (file.endsWith('.json')) {
          const data = fs.readFileSync(filePath, 'utf8');
          let course = JSON.parse(data);
  
          if (feedbackData[course.id]) {
            course.material = this.updateMaterial(course.material, feedbackData[course.id]);
          }
  
          if (performanceData[course.id]) {
            course.quizzes = this.modifyQuizzes(course.quizzes, performanceData[course.id]);
            course.content = this.modifyContent(course.content, performanceData[course.id]);
          }
  
          fs.writeFileSync(filePath, JSON.stringify(course, null, 2));
        }
      });
  
      return 'Courses successfully adjusted and optimized.';
    } catch (error) {
      throw new Error(`Error optimizing courses: ${error.message}`);
    }
  }

  private updateMaterial(material: any[], feedback: Record<string, string>): any[] {
    return material.map((section) => {
      if (feedback[section.id]) {
        section.content = feedback[section.id];
      }
      return section;
    });
  }

  private modifyQuizzes(quizzes: any[], performance: Record<string, any>): any[] {
    return quizzes.map((quiz) => {
      if (performance[quiz.id]) {
        quiz.difficulty = performance[quiz.id].adjustedDifficulty || quiz.difficulty;
      }
      return quiz;
    });
  }

  private modifyContent(content: any[], performance: Record<string, any>): any[] {
    return content.map((item) => {
      if (performance[item.id]) {
        item.relevance = performance[item.id].adjustedRelevance || item.relevance;
      }
      return item;
    });
  }

  /**
   * Get multimedia resources for a specific course dashboard
   */
  async getCourseDashboard(id: string): Promise<any> {
    const multimediaResources = [
      { type: 'video', url: 'https://example.com/video1.mp4', title: 'Introduction Video' },
      { type: 'pdf', url: 'https://example.com/document1.pdf', title: 'Course Syllabus' },
    ];

    return { courseId: id, multimediaResources };
  }

  /**
   * Create a new note
   */
  async createNote(content: string, userId: string, courseId?: string): Promise<Note> {
    const newNote = new this.noteModel({ content, userId, courseId });
    return newNote.save();
  }

  /**
   * Get notes for a user or course
   */
  async getNotes(userId?: string, courseId?: string): Promise<Note[]> {
    const query: any = {};
    if (userId) query.userId = userId;
    if (courseId) query.courseId = courseId;

    return this.noteModel.find(query).exec();
  }

  /**
   * Update an existing note
   */
  async updateNote(id: string, content: string): Promise<Note> {
    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    note.content = content;
    note.lastUpdated = new Date();
    return note.save();
  }

  /**
   * Delete a note
   */
  async deleteNote(id: string): Promise<void> {
    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    await this.noteModel.findByIdAndDelete(id);
  }
  async addMediaToCourse(courseId: string, instructorId: string, mediaPaths: string[]): Promise<Course> {
    // Find the course by its ID
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
  
    // Check if the logged-in instructor matches the course instructor
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException(`You are not authorized to modify this course.`);
    }
  
    // Append the new media paths to the existing media array
    course.media.push(...mediaPaths);
  
    // Save and return the updated course document
    return course.save();
  }
  async searchCourses(filters: { topic?: string; instructor?: string }) {
    const query: any = {};
    if (filters.topic) query.category = { $regex: filters.topic, $options: 'i' }; // Match category by topic
    if (filters.instructor) query.createdBy = filters.instructor; // Match instructor by ID
    return this.courseModel.find(query).exec();
  }
  
  
  async getUserEnrolledCourses(userId: string) {
    // Step 1: Find the user
    const user = await this.userModel.findById(userId).exec();
  
    if (!user) {
      throw new Error('User not found');
    }
  
    // Step 2: Fetch course details based on the ObjectId array in `user.courses`
    const courses = await this.courseModel
      .find({ _id: { $in: user.courses } }) // Use $in to fetch all matching courses
      .exec();
  
    return courses; // Return full course details
  }
  async enrollStudentInCourse(userId: string, courseId: string) {
    // Step 1: Find the user
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
  
    // Step 2: Find the course
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new Error('Course not found');
    }
  
    // Step 3: Check if the user is already enrolled
    if (user.courses.some((course) => course.toString() === courseId.toString())) {
      throw new Error('Student already enrolled in this course');
    }
  
    // Step 4: Enroll the student
    user.courses.push(new mongoose.Types.ObjectId(courseId));
    await user.save();
    await this.broadcastService.createBroadcast(
      'User enrolled in course',
      `"${user.name}" has been enrolled in course ${course.title}.`,
      ['student', 'instructor', 'admin'], 
    );   
    return {
      message: 'Enrollment successful!',
      course,
    };
  }
  
  // Archive or Unarchive a course
async archiveCourse(courseId: string, archived: boolean): Promise<Course> {
  const course = await this.courseModel.findById(courseId).exec();
  if (!course) {
    throw new NotFoundException(`Course with ID ${courseId} not found.`);
  }

  course.archived = archived; // Set the archive status to true or false
  
  await this.broadcastService.createBroadcast(
    'Course Archived',
    `Course "${course.title}" has been added to archives.`,
    ['student', 'instructor', 'admin'], 
  );   
  return course.save(); // Save the updated course and return it
}


  // Delete a course
  async deleteCourse(courseId: string): Promise<{ message: string }> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

   const deleted =  await this.courseModel.findByIdAndDelete(courseId); // Delete the course
    await this.broadcastService.createBroadcast(
      'Deleted Course',
      `course titled "${deleted.title}" has been deleted from the platform.`,
      ['student', 'instructor', 'admin'], 
    );   
    return { message: `Course with ID ${courseId} has been deleted.` };
  }
    
  
}
