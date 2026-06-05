import { shelfService } from '../services/shelfService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getShelves = asyncHandler(async (req, res) => {
  res.json(await shelfService.getAll(req.userId));
});

export const createShelf = asyncHandler(async (req, res) => {
  res.status(201).json(await shelfService.create(req.userId, req.body));
});

export const addBookToShelf = asyncHandler(async (req, res) => {
  const shelf = await shelfService.addBook(
    req.userId,
    String(req.params.id),
    String(req.params.bookId),
  );
  if (!shelf) {
    res.status(404).send();
    return;
  }
  res.json(shelf);
});

export const removeBookFromShelf = asyncHandler(async (req, res) => {
  const shelf = await shelfService.removeBook(
    req.userId,
    String(req.params.id),
    String(req.params.bookId),
  );
  if (!shelf) {
    res.status(404).send();
    return;
  }
  res.json(shelf);
});

export const deleteShelf = asyncHandler(async (req, res) => {
  const shelf = await shelfService.delete(req.userId, String(req.params.id));
  if (!shelf) {
    res.status(404).send();
    return;
  }
  res.status(204).send();
});
