import { Controller, Post, Body } from '@nestjs/common';
import { ConciergeService } from '../service/shopping-concierge.service';
import { ChatResponse } from '../dto/chat-response.dto';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Controller('shopping-concierge')
export class ShoppingConciergeController {
  constructor(private readonly conciergeService: ConciergeService) {}

  @Post()
  async chat(@Body('messages') messages: ChatMessage[]): Promise<ChatResponse> {
    console.log('Received messages count:', messages.length);
    const response = await this.conciergeService.handleChat("1",messages[messages.length - 1].content);
    return response;
  }
}