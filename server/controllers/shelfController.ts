import { Shelf } from '../models/Shelf.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getShelves = asyncHandler(async (_req, res) => {
  const shelves = await Shelf.find().populate('books');
  res.json(shelves);
});

export const createShelf = asyncHandler(async (req, res) => {
  const shelf = await Shelf.create(req.body);
  res.status(201).json(shelf);
});

export const addBookToShelf = asyncHandler(async (req, res) => {
  const shelf = await Shelf.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { books: req.params.bookId } },
    { new: true }
  ).populate('books');
  if (!shelf) {
    res.status(404).json({ message: 'Shelf not found' });
    return;
  }
  res.json(shelf);
});

export const removeBookFromShelf = asyncHandler(async (req, res) => {
  const shelf = await Shelf.findByIdAndUpdate(
    req.params.id,
    { $pull: { books: req.params.bookId } },
    { new: true }
  ).populate('books');
  if (!shelf) {
    res.status(404).json({ message: 'Shelf not found' });
    return;
  }
  res.json(shelf);
});

export const deleteShelf = asyncHandler(async (req, res) => {
  const shelf = await Shelf.findByIdAndDelete(req.params.id);
  if (!shelf) {
    res.status(404).json({ message: 'Shelf not found' });
    return;
  }
  res.status(204).send();
});
