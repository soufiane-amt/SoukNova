import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { User } from 'src/modules/users/user.decorator';
import { commentInfoDto } from '../dto/commentInfo.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post(':productId')
  async createComment(
    @User('id') userId: number,
    @Param('productId') productId: string,
    @Body() commentData: { content: string; rating: number },
  ) {
    const comment: commentInfoDto = {
      userId: userId,
      productId: productId,
      content: commentData.content,
      rating: commentData.rating,
    };
    return await this.commentService.createComment(comment);
  }

  @Get(':productId')
  async getComments(@Param('productId') productId: string) {
    console.log("==================== ")
    console.log("productId : ", productId)
    return await this.commentService.getComments(productId);
  }
}
