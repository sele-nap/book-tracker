import type { Request, Response } from 'express';
import { Book } from '../models/Book.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getBooks = asyncHandler(async (_req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.json(book);
});

export const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.json(book);
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.status(204).send();
});

export const searchBooks = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    res.status(400).json({ message: 'Query param "q" is required' });
    return;
  }
  const books = await Book.find({ $text: { $search: q } });
  res.json(books);
});
