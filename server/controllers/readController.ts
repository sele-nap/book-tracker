import { Read } from '../models/Read.js';
import type { ReadStatus } from '../models/Read.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getReads = asyncHandler(async (_req, res) => {
  const reads = await Read.find().populate('book').sort({ createdAt: -1 });
  res.json(reads);
});

export const getReadsByStatus = asyncHandler(async (req, res) => {
  const reads = await Read.find({ status: req.params.status as ReadStatus }).populate('book');
  res.json(reads);
});

export const createRead = asyncHandler(async (req, res) => {
  const read = await Read.create(req.body);
  res.status(201).json(read);
});

export const updateRead = asyncHandler(async (req, res) => {
  const read = await Read.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!read) {
    res.status(404).json({ message: 'Read not found' });
    return;
  }
  res.json(read);
});

export const getReadByBook = asyncHandler(async (req, res) => {
  const read = await Read.findOne({ book: req.params.bookId }).populate('book');
  if (!read) {
    res.status(404).json({ message: 'Read not found' });
    return;
  }
  res.json(read);
});

export const deleteRead = asyncHandler(async (req, res) => {
  const read = await Read.findByIdAndDelete(req.params.id);
  if (!read) {
    res.status(404).json({ message: 'Read not found' });
    return;
  }
  res.status(204).send();
});
