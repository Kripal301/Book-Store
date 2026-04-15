// src/services/bookService.ts
import { api } from './api';
// ✅ IMPORT THE SHARED TYPE ALIASES
import { Book, CreateBookInput, UpdateBookInput } from '../types';

export interface BookQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

export interface BooksResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  books: Book[];
}

// ✅ Helper: Map backend _id to frontend id
const mapBook = (book: any) => ({
  ...book,
  id: book._id || book.id,
  reviews: (book.reviews || []).map((r: any) => ({
    ...r,
    id: r._id?.toString() || r.id,  // ✅ map _id to id
  }))
});
export const bookService = {
  getBooks: async (params?: BookQueryParams): Promise<BooksResponse> => {
    const queryString = params ? new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    const response = await api.get<BooksResponse>(endpoint);
    
    return {
      ...response,
      books: response.books.map(mapBook),
    };
  },

  getBook: async (id: string): Promise<{ success: boolean; book: Book }> => {
    const response = await api.get<any>(`/books/${id}`);
    return {
      ...response,
      book: mapBook(response.book),
    };
  },

  // ✅ FIXED: Use CreateBookInput (excludes 'id', not '_id')
  createBook: async (book: CreateBookInput): Promise<{ success: boolean; book: Book }> => {
    const response = await api.post<any>('/books', book);
    return {
      ...response,
      book: mapBook(response.book),
    };
  },

  // ✅ FIXED: Use UpdateBookInput (excludes 'id', not '_id')
  updateBook: async (id: string, updates: UpdateBookInput): Promise<{ success: boolean; book: Book }> => {
    const response = await api.put<any>(`/books/${id}`, updates);
    return {
      ...response,
      book: mapBook(response.book),
    };
  },

  deleteBook: async (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>(`/books/${id}`);
  },

  addReview: async (bookId: string, review: { rating: number; comment: string }): Promise<{ success: boolean; book: Book }> => {
    const response = await api.post<any>(`/books/${bookId}/reviews`, review);
    return {
      ...response,
      book: mapBook(response.book),
    };
  },
};