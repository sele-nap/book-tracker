import type { ReadStatus } from '../models/Read.js';
import { readService } from '../services/readService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getReads = asyncHandler(async (req, res) => {
  res.json(await readService.getAll(req.userId));
});

export const getTimeline = asyncHandler(async (req, res) => {
  res.json(await readService.getTimeline(req.userId));
});

export const getReadsByStatus = asyncHandler(async (req, res) => {
  res.json(
    await readService.getByStatus(
      req.userId,
      String(req.params.status) as ReadStatus,
    ),
  );
});

export const getReadByBook = asyncHandler(async (req, res) => {
  const read = await readService.getByBook(
    req.userId,
    String(req.params.bookId),
  );
  if (!read) {
    res.status(404).send();
    return;
  }
  res.json(read);
});

export const createRead = asyncHandler(async (req, res) => {
  res.status(201).json(await readService.create(req.userId, req.body));
});

export const updateRead = asyncHandler(async (req, res) => {
  const read = await readService.update(
    req.userId,
    String(req.params.id),
    req.body,
  );
  if (!read) {
    res.status(404).send();
    return;
  }
  res.json(read);
});

export const deleteRead = asyncHandler(async (req, res) => {
  const read = await readService.delete(req.userId, String(req.params.id));
  if (!read) {
    res.status(404).send();
    return;
  }
  res.status(204).send();
});
