import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Error as MongooseError } from 'mongoose';
import connectDB from './config/db.js';
import { requireAuth } from './middleware/requireAuth.js';
import authRouter from './routes/auth.js';
import booksRouter from './routes/books.js';
import challengesRouter from './routes/challenges.js';
import readsRouter from './routes/reads.js';
import searchRouter from './routes/search.js';
import shelvesRouter from './routes/shelves.js';
import statsRouter from './routes/stats.js';

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Exiting.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT ?? 3000;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({ message: 'Book Tracker API 📚' });
});

app.use('/api/auth', authRouter);
app.use('/api/books', requireAuth, booksRouter);
app.use('/api/search', requireAuth, searchRouter);
app.use('/api/reads', requireAuth, readsRouter);
app.use('/api/shelves', requireAuth, shelvesRouter);
app.use('/api/challenges', requireAuth, challengesRouter);
app.use('/api/stats', requireAuth, statsRouter);

app.use((_req, res) => {
  res.status(404).send();
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌', err);

  if (err instanceof MongooseError.ValidationError) {
    res.status(400).json({
      errors: Object.entries(err.errors).map(([field, e]) => ({
        id: field,
        type: 'invalid',
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof MongooseError.CastError) {
    res.status(400).json({
      errors: [{ id: err.path, type: 'invalid' }],
    });
    return;
  }

  if (err instanceof Error && 'status' in err) {
    const status = err.status as number;
    if (status === 409) {
      const code = 'code' in err ? (err as { code: string }).code : undefined;
      res.status(409).json({ ...(code && { code }) });
    } else {
      res.status(status).send();
    }
    return;
  }

  res.status(500).send();
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err: unknown) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
