import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { User } from 'src/modules/users/user.decorator';
import { commentInfoDto } from '../dto/commentInfo.dto';
import { NotificationService } from 'src/modules/notification/services/notification.service';

@Controller('api/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly notificationService: NotificationService,
  ) {}

  @UseGuards(AuthGuard)
  @Post(':productId')
  async createComment(
    @User('id') userId: number,
    @Param('productId') productId: string,
    @Body() body: { content: string; rating: number },
  ) {
    const comment: commentInfoDto = {
      userId: userId,
      productId: productId,
      content: body.content,
      rating: body.rating,
    };
    const createdComment = await this.commentService.createComment(comment);
    this.notificationService.notifyNewReview({
      id: createdComment.id,
      productId: productId,
      rating: createdComment.rate,
      customerName: createdComment.name,
    });
    return createdComment;
  }
}
