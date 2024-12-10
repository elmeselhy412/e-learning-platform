import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PythonIntegrationService {
  private pythonApiUrl = 'http://localhost:5000'; // Replace with your Python API URL

  async getRecommendations(userId: string, topN: number = 5): Promise<any> {
    try {
      const response = await axios.post(`${this.pythonApiUrl}/recommend`, {
        user_id: userId,
        top_n: topN,
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Python service error: ${error.response?.data?.error || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}