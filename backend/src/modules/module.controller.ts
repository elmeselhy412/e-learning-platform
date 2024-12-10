import { Body, Controller, Get, Post, Put, Delete, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ModuleService } from './module.service';
import { Module } from '../models/module.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';


@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}


  @Post('create')
  async createModule(@Body() moduleDto: { courseId: string; title: string; content: string; order: number }) {
    return this.moduleService.createModule(moduleDto);
  }


  @Get('course/:courseId')
  async getModulesByCourse(@Param('courseId') courseId: string) {
    return this.moduleService.getModulesByCourse(courseId);
  }

  @Put(':moduleId')
  async updateModule(@Param('moduleId') moduleId: string, @Body() updateDto: Partial<Module>) {
    return this.moduleService.updateModule(moduleId, updateDto);
  }

  @Delete(':moduleId')
  async deleteModule(@Param('moduleId') moduleId: string) {
    return this.moduleService.deleteModule(moduleId);
  }
  @Post(':moduleId/upload-media')
@UseInterceptors(
  FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: './uploads/media', // Directory where files will be stored
      filename: (req, file, callback) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    }),
  }),
)
async uploadMedia(
  @Param('moduleId') moduleId: string,
  @UploadedFiles() files: Express.Multer.File[], // Files uploaded via Multer
) {
  const mediaPaths = files.map((file) => `/uploads/media/${file.filename}`); // File paths
  return this.moduleService.addMediaToModule(moduleId, mediaPaths);
}

}

