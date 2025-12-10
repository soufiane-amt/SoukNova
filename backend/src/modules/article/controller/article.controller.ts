import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ArticleService } from '../service/article.service';

@Controller('api/article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Get()
  async getArticles() {
    return this.articleService.getArticles();
  }

  @Get(':articleId')
  async getArticle(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.articleService.getArticle(articleId);
  }

  @Get('/random/:articleId')
  async getRandomArticles(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.articleService.getRandomArticles(articleId);
  }
}
