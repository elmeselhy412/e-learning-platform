import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../models/Notes.schema'; // Adjust path if necessary
import { CreateCourseDto } from 'src/dto/create-course.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Course, CourseDocument } from 'src/models/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(Course.name) private courseModel:Model<CourseDocument>,
  ) {}

  /**
   * Create a new course
   */
  createCourse(createCourseDto: CreateCourseDto): any {
    // Placeholder for course creation logic
    return {
      id: '1234', // Placeholder ID
      ...createCourseDto,
    };
  }

  /**
   * Get all courses
   */
  getAllCourses(): any[] {
    // Placeholder for fetching all courses
    return [
      { id: '1234', name: 'Course 1', description: 'Introductory course' },
      { id: '5678', name: 'Course 2', description: 'Advanced course' },
    ];
  }

  /**
   * Get a course by ID
   */
  getCourseById(id: string): any {
    const courses = this.getAllCourses();
    const course = courses.find((c) => c.id === id);
    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);
    return course;
  }

  /**
   * Update a course
   */
  updateCourse(id: string, createCourseDto: CreateCourseDto): any {
    const course = this.getCourseById(id);
    return { ...course, ...createCourseDto };
  }

  /**
   * Delete a course
   */
  deleteCourse(id: string): string {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex((c) => c.id === id);

    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Simulate deletion
    courses.splice(courseIndex, 1);

    return `Course with ID ${id} deleted successfully`;
  }

  /**
   * Adjust and optimize courses based on feedback and performance data
   */
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
}
