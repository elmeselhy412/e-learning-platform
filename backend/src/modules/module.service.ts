import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from '../models/module.schema';

@Injectable()
export class ModuleService {
  constructor(@InjectModel(Module.name) private readonly moduleModel: Model<Module>) {}

  // Create a new module
  async createModule(moduleDto: { courseId: string; title: string; content: string; order: number }) {
    try {
      const module = new this.moduleModel(moduleDto);
      return module.save();
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  }
  async getAllModules(){
    return this.moduleModel.find().exec();
  }
 

  // Get all modules for a specific course
  async getModulesByCourse(courseId: string) {
    return this.moduleModel.find({ courseId }).sort({ order: 1 }).exec();
  }

  // Update a module
async updateModule(moduleId: string, updateDto: Partial<Module>) {
  const updatedModule = await this.moduleModel.findByIdAndUpdate(
    moduleId, // Use `findByIdAndUpdate` to match MongoDB's `_id`
    { $set: updateDto },
    { new: true },
  );
  if (!updatedModule) throw new NotFoundException(`Module with ID ${moduleId} not found.`);
  return updatedModule;
}

// Delete a module
async deleteModule(moduleId: string) {
  const deletedModule = await this.moduleModel.findByIdAndDelete(moduleId); // Use `findByIdAndDelete` for `_id`
  if (!deletedModule) throw new NotFoundException(`Module with ID ${moduleId} not found.`);
  return { message: 'Module deleted successfully', deletedModule };
}

  // Uploading MultiMedia Content 
  async addMediaToModule(moduleId: string, mediaPaths: string[]): Promise<Module> {
    const module = await this.moduleModel.findOne({ moduleId }).exec();
    if (!module) throw new NotFoundException(`Module with ID ${moduleId} not found.`);

    module.media.push(...mediaPaths); // Add new media files to the existing list
    return module.save();
  }
}

