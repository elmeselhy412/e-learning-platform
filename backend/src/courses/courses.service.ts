import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../models/Notes.schema'; // Adjust path if necessary
import { CreateCourseDto } from 'src/dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
  ) {}

  /**
   * Create a new course
   * @param createCourseDto - The data to create the course
   * @returns The created course (currently a placeholder)
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
   * @returns List of courses (currently a placeholder)
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
   * @param id - The ID of the course
   * @returns The course details
   */
  getCourseById(id: string): any {
    const courses = this.getAllCourses(); // Mock implementation
    const course = courses.find((c) => c.id === id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  /**
   * Update a course
   * @param id - The ID of the course to update
   * @param createCourseDto - The updated course data
   * @returns The updated course
   */
  updateCourse(id: string, createCourseDto: CreateCourseDto): any {
    const course = this.getCourseById(id); // Get the existing course (mock)
    return {
      ...course,
      ...createCourseDto,
    };
  }

  /**
   * Delete a course
   * @param id - The ID of the course to delete
   * @returns Confirmation message
   */
  deleteCourse(id: string): string {
    const courses = this.getAllCourses(); // Mock implementation
    const courseIndex = courses.findIndex((c) => c.id === id);

    if (courseIndex === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Simulate deletion
    courses.splice(courseIndex, 1);

    return `Course with ID ${id} deleted successfully`;
  }

  /**
   * Get multimedia resources for a specific course dashboard
   * @param id - The ID of the course
   * @returns Multimedia resources for the course
   */
  async getCourseDashboard(id: string): Promise<any> {
    const multimediaResources = [
      { type: 'video', url: 'https://example.com/video1.mp4', title: 'Introduction Video' },
      { type: 'pdf', url: 'https://example.com/document1.pdf', title: 'Course Syllabus' },
    ];

    return {
      courseId: id,
      multimediaResources,
    };
  }

  /**
   * Create a new note
   * @param content - The content of the note
   * @param userId - The ID of the user creating the note
   * @param courseId - The ID of the course (optional)
   * @returns The created note
   */
  async createNote(content: string, userId: string, courseId?: string): Promise<Note> {
    const newNote = new this.noteModel({ content, userId, courseId });
    return newNote.save();
  }

  /**
   * Get notes for a user or course
   * @param userId - The ID of the user (optional)
   * @param courseId - The ID of the course (optional)
   * @returns The list of notes
   */
  async getNotes(userId?: string, courseId?: string): Promise<Note[]> {
    const query: any = {};
    if (userId) query.userId = userId;
    if (courseId) query.courseId = courseId;

    return this.noteModel.find(query).exec();
  }

  /**
   * Update an existing note
   * @param id - The ID of the note
   * @param content - The updated content of the note
   * @returns The updated note
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
   * @param id - The ID of the note
   */
  async deleteNote(id: string): Promise<void> {
    const note = await this.noteModel.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    await this.noteModel.findByIdAndDelete(id);
  }
}
