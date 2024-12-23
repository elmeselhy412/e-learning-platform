import { Body, Controller, Delete, Get, Param, Post, Res, HttpStatus } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';

@Controller('broadcast')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Post('/create')
  async createBroadcast(
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('userTypes') userTypes: string[],
    @Res() res,
  ) {
    try {
      const broadcast = await this.broadcastService.createBroadcast(title, message, userTypes);
      return res.status(HttpStatus.CREATED).json({
        message: 'Broadcast created successfully',
        broadcast,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create broadcast',
        error: error.message,
      });
    }
  }

  @Get('/all')
  async getAllBroadcasts(@Res() res) {
    try {
      const broadcasts = await this.broadcastService.getAllBroadcasts();
      return res.status(HttpStatus.OK).json(broadcasts);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch broadcasts',
        error: error.message,
      });
    }
  }

  @Get('/:id')
  async getBroadcastById(@Param('id') id: string, @Res() res) {
    try {
      const broadcast = await this.broadcastService.getBroadcastById(id);
      return res.status(HttpStatus.OK).json(broadcast);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Broadcast not found',
        error: error.message,
      });
    }
  }

  @Delete('/:id')
  async deleteBroadcast(@Param('id') id: string, @Res() res) {
    try {
      await this.broadcastService.deleteBroadcast(id);
      return res.status(HttpStatus.OK).json({ message: 'Broadcast deleted successfully' });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Broadcast not found',
        error: error.message,
      });
    }
  }
}
