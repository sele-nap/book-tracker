import { Document, Schema, model } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string[];
  pages?: number;
  isbn?: string;
  coverUrl?: string;
  publishedYear?: number;
  createdAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: [{ type: String, trim: true }],
    pages: { type: Number, min: 1 },
    isbn: { type: String, trim: true },
    coverUrl: { type: String },
    publishedYear: { type: Number },
  },
  { timestamps: true },
);

bookSchema.index({ title: 'text', author: 'text' });

export const Book = model<IBook>('Book', bookSchema);
