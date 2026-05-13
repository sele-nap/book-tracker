import type { Request, Response } from 'express';
import { bookService } from '../services/bookService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getBooks = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(String(req.query.limit ?? '20')), 100);
  const page = Math.max(parseInt(String(req.query.page ?? '1')), 1);
  res.json(await bookService.getPaginated(page, limit));
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await bookService.getById(String(req.params.id));
  if (!book) { res.status(404).json({ message: 'Book not found' }); return; }
  res.json(book);
});

export const createBook = asyncHandler(async (req, res) => {
  res.status(201).json(await bookService.create(req.body));
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await bookService.update(String(req.params.id), req.body);
  if (!book) { res.status(404).json({ message: 'Book not found' }); return; }
  res.json(book);
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await bookService.delete(String(req.params.id));
  if (!book) { res.status(404).json({ message: 'Book not found' }); return; }
  res.status(204).send();
});

export const searchBooks = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    res.status(400).json({ message: 'Query param "q" is required' });
    return;
  }
  res.json(await bookService.search(q));
});
