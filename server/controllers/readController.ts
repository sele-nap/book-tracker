import type { ReadStatus } from '../models/Read.js';
import { readService } from '../services/readService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getReads = asyncHandler(async (_req, res) => {
  res.json(await readService.getAll());
});

export const getTimeline = asyncHandler(async (_req, res) => {
  res.json(await readService.getTimeline());
});

export const getReadsByStatus = asyncHandler(async (req, res) => {
  res.json(await readService.getByStatus(String(req.params.status) as ReadStatus));
});

export const getReadByBook = asyncHandler(async (req, res) => {
  const read = await readService.getByBook(String(req.params.bookId));
  if (!read) { res.status(404).json({ message: 'Read not found' }); return; }
  res.json(read);
});

export const createRead = asyncHandler(async (req, res) => {
  res.status(201).json(await readService.create(req.body));
});

export const updateRead = asyncHandler(async (req, res) => {
  const read = await readService.update(String(req.params.id), req.body);
  if (!read) { res.status(404).json({ message: 'Read not found' }); return; }
  res.json(read);
});

export const deleteRead = asyncHandler(async (req, res) => {
  const read = await readService.delete(String(req.params.id));
  if (!read) { res.status(404).json({ message: 'Read not found' }); return; }
  res.status(204).send();
});
