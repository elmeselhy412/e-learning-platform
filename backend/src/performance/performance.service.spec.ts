import { Injectable } from '@nestjs/common';

@Injectable()
export class PerformanceService {
  private courseProgress = new Map<string, { courseId: string; userId: string; completionPercentage: number }>();

  // Track or update course progress
  updateProgress(userId: string, courseId: string, completionPercentage: number) {
    const progressKey = `${userId}_${courseId}`;
    this.courseProgress.set(progressKey, { userId, courseId, completionPercentage });
    return this.courseProgress.get(progressKey);
  }

  // Get course progress for a specific user and course
  getProgress(userId: string, courseId: string) {
    const progressKey = `${userId}_${courseId}`;
    return this.courseProgress.get(progressKey);
  }

  // Get all progress for a user
  getAllUserProgress(userId: string) {
    const progress = [];
    for (const [key, value] of this.courseProgress.entries()) {
      if (value.userId === userId) {
        progress.push(value);
      }
    }
    return progress;
  }
}
