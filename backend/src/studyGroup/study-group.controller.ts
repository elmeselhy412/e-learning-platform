// src/study-group/study-group.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StudyGroupService } from './study-group.service'; 

@Controller('study-groups')
export class StudyGroupController {
  constructor(private readonly studyGroupService: StudyGroupService) {}

  @Post('create')
  async createGroup(@Body() body: { name: string; description: string }) {
    return this.studyGroupService.createGroup(body.name, body.description);
  }

  @Post(':id/join')
  async joinGroup(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.studyGroupService.joinGroup(id, body.userId);
  }

  @Get()
  async getAllGroups() {
    return this.studyGroupService.getAllGroups();
  }
}