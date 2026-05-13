import { shelfService } from '../services/shelfService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getShelves = asyncHandler(async (_req, res) => {
  res.json(await shelfService.getAll());
});

export const createShelf = asyncHandler(async (req, res) => {
  res.status(201).json(await shelfService.create(req.body));
});

export const addBookToShelf = asyncHandler(async (req, res) => {
  const shelf = await shelfService.addBook(String(req.params.id), String(req.params.bookId));
  if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }
  res.json(shelf);
});

export const removeBookFromShelf = asyncHandler(async (req, res) => {
  const shelf = await shelfService.removeBook(String(req.params.id), String(req.params.bookId));
  if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }
  res.json(shelf);
});

export const deleteShelf = asyncHandler(async (req, res) => {
  const shelf = await shelfService.delete(String(req.params.id));
  if (!shelf) { res.status(404).json({ message: 'Shelf not found' }); return; }
  res.status(204).send();
});
