export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  link: string;
  goodreads: string;
  category?: string;
}

export interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
}
