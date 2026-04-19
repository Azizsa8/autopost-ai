import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MoyasarService {
  private readonly logger = new Logger(MoyasarService.name);
  private readonly apiKey = process.env.MOYASAR_API_KEY;
  private readonly baseUrl = 'https://api.moyasar.com/v1';

  async createInvoice(params: {
    amount: number;
    currency: string;
    description: string;
    callbackUrl: string;
    metadata?: any;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/invoices`,
        {
          amount: params.amount,
          currency: params.currency,
          description: params.description,
          callback_url: params.callbackUrl,
          metadata: params.metadata,
        },
        {
          auth: {
            username: this.apiKey,
            password: '',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Moyasar Invoice Error: ${error.message}`);
      throw error;
    }
  }

  async fetchPayment(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/payments/${id}`, {
        auth: {
          username: this.apiKey,
          password: '',
        },
      });
      return response.data;
    } catch (error: any) {
      this.logger.error(`Moyasar Fetch Payment Error: ${error.message}`);
      throw error;
    }
  }
}