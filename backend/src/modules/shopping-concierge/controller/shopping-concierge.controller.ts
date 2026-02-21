import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConciergeService } from '../service/shopping-concierge.service';
import { ChatRequestDto } from '../dto/chat-request.dto';

@Controller('shopping-concierge')
export class ShoppingConciergeController {
  constructor(private readonly conciergeService: ConciergeService) {}

  @Post()
  async chat(@Body() body: ChatRequestDto) {
    return this.conciergeService.handleChat(body.sessionId, body.message);
  }

  @Post('/clear')
  async clearChat(@Body('sessionId') sessionId: string) {
    return this.conciergeService.clearChat(sessionId);
  }
}
