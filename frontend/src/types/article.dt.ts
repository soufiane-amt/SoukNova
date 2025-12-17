export interface ArticleType {
  id: string;
  title: string;
  author: string;
  date: string;
  image?: string;
  images?: string[];
  article_paragraphs?: string[];
}
