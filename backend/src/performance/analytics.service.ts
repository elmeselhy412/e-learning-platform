import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  private measurementId = 'G-PTTXP0EK7M';
  private apiSecret = 'j36tnsp8QxWPIkB-mZ-yBA';
   
    
  async trackEvent(userId: string, eventName: string, params: Record<string, any>) {
    const payload = {
      client_id: userId, 
      events: [
        {
          name: eventName, 
          params, 
        },
      ],
    };

    try {
      await axios.post(
        `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
        payload,
      );
      console.log(`Event "${eventName}" sent to Google Analytics for user: ${userId}`);
    } catch (error) {
      console.error('Failed to send event to Google Analytics:', error.message);
    }
  }
}
