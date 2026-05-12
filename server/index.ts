import express, { type NextFunction, type Request, type Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import connectDB from './config/db.js';
import booksRouter from './routes/books.js';
import challengesRouter from './routes/challenges.js';
import readsRouter from './routes/reads.js';
import shelvesRouter from './routes/shelves.js';
import statsRouter from './routes/stats.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Book Tracker API 📚' });
});

app.use('/api/books', booksRouter);
app.use('/api/reads', readsRouter);
app.use('/api/shelves', shelvesRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/stats', statsRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Erreurs globales
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({ message: 'Validation error', errors: messages });
    return;
  }

  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: unknown) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
