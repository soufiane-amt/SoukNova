import { Controller, Get, Param } from '@nestjs/common';
import { CommentService } from '../services/comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':productId')
  async getComments(@Param('productId') productId: string) {
    return await this.commentService.getComments(productId);
  }
}
