import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Book } from '../models/Book.js';
import { Challenge } from '../models/Challenge.js';
import { Read } from '../models/Read.js';
import { Shelf } from '../models/Shelf.js';
import { User } from '../models/User.js';

const MONGO_URI =
  process.env.MONGO_URI ?? 'mongodb://localhost:27017/book-tracker';

const EMAIL = 'test@booktracker.dev';
const PASSWORD = 'password123';

const books = [
  {
    title: 'La Main gauche de la nuit',
    author: 'Ursula K. Le Guin',
    genre: ['Science-Fiction'],
    language: 'vf' as const,
    pages: 320,
    publishedYear: 1969,
    coverUrl: 'https://covers.openlibrary.org/b/id/8231986-L.jpg',
    status: 'finished' as const,
    rating: 5,
    review:
      "Un chef-d'œuvre absolu. Le Guin réinvente le genre avec une sensibilité rare.",
    finishedAt: new Date('2024-03-12'),
    startedAt: new Date('2024-03-01'),
  },
  {
    title: 'Les Dépossédés',
    author: 'Ursula K. Le Guin',
    genre: ['Science-Fiction'],
    language: 'vf' as const,
    pages: 408,
    publishedYear: 1974,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    status: 'finished' as const,
    rating: 5,
    review:
      'Une utopie anarchiste vertigineuse. Probablement son meilleur roman.',
    finishedAt: new Date('2024-06-20'),
    startedAt: new Date('2024-06-05'),
  },
  {
    title: 'Parable of the Sower',
    author: 'Octavia E. Butler',
    genre: ['Science-Fiction', 'Dystopie'],
    language: 'vo' as const,
    pages: 352,
    publishedYear: 1993,
    coverUrl: 'https://covers.openlibrary.org/b/id/8228891-L.jpg',
    status: 'finished' as const,
    rating: 5,
    review:
      "Prophétique et bouleversant. Butler écrit comme si elle connaissait l'avenir.",
    finishedAt: new Date('2024-01-28'),
    startedAt: new Date('2024-01-15'),
  },
  {
    title: 'Kindred',
    author: 'Octavia E. Butler',
    genre: ['Science-Fiction'],
    language: 'vo' as const,
    pages: 287,
    publishedYear: 1979,
    coverUrl: 'https://covers.openlibrary.org/b/id/8231458-L.jpg',
    status: 'finished' as const,
    rating: 4,
    finishedAt: new Date('2023-11-10'),
    startedAt: new Date('2023-11-02'),
  },
  {
    title: 'The Fifth Season',
    author: 'N.K. Jemisin',
    genre: ['Fantasy', 'Science-Fiction'],
    language: 'vo' as const,
    pages: 468,
    publishedYear: 2015,
    coverUrl: 'https://covers.openlibrary.org/b/id/8394066-L.jpg',
    status: 'finished' as const,
    rating: 5,
    review:
      'La narration à la deuxième personne est un choc. Trilogie indispensable.',
    finishedAt: new Date('2024-09-03'),
    startedAt: new Date('2024-08-20'),
  },
  {
    title: 'The Obelisk Gate',
    author: 'N.K. Jemisin',
    genre: ['Fantasy', 'Science-Fiction'],
    language: 'vo' as const,
    pages: 432,
    publishedYear: 2016,
    coverUrl: 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
    status: 'finished' as const,
    rating: 5,
    finishedAt: new Date('2024-09-25'),
    startedAt: new Date('2024-09-05'),
  },
  {
    title: 'The Stone Sky',
    author: 'N.K. Jemisin',
    genre: ['Fantasy', 'Science-Fiction'],
    language: 'vo' as const,
    pages: 464,
    publishedYear: 2017,
    status: 'reading' as const,
    startedAt: new Date('2025-11-01'),
    currentPage: 210,
  },
  {
    title: 'Spinning Silver',
    author: 'Naomi Novik',
    genre: ['Fantasy'],
    language: 'vo' as const,
    pages: 480,
    publishedYear: 2018,
    coverUrl: 'https://covers.openlibrary.org/b/id/8742881-L.jpg',
    status: 'finished' as const,
    rating: 4,
    review: "Un conte de fées slave réinventé avec beaucoup d'élégance.",
    finishedAt: new Date('2024-02-14'),
    startedAt: new Date('2024-02-03'),
  },
  {
    title: 'Uprooted',
    author: 'Naomi Novik',
    genre: ['Fantasy'],
    language: 'vo' as const,
    pages: 438,
    publishedYear: 2015,
    coverUrl: 'https://covers.openlibrary.org/b/id/8228600-L.jpg',
    status: 'finished' as const,
    rating: 4,
    finishedAt: new Date('2023-08-22'),
    startedAt: new Date('2023-08-12'),
  },
  {
    title: "The Handmaid's Tale",
    author: 'Margaret Atwood',
    genre: ['Science-Fiction', 'Dystopie'],
    language: 'vo' as const,
    pages: 311,
    publishedYear: 1985,
    coverUrl: 'https://covers.openlibrary.org/b/id/8228865-L.jpg',
    status: 'finished' as const,
    rating: 5,
    finishedAt: new Date('2023-05-15'),
    startedAt: new Date('2023-05-08'),
  },
  {
    title: 'MaddAddam',
    author: 'Margaret Atwood',
    genre: ['Science-Fiction', 'Dystopie'],
    language: 'vo' as const,
    pages: 416,
    publishedYear: 2013,
    status: 'wishlist' as const,
  },
  {
    title: 'Ancillary Justice',
    author: 'Ann Leckie',
    genre: ['Science-Fiction'],
    language: 'vo' as const,
    pages: 386,
    publishedYear: 2013,
    coverUrl: 'https://covers.openlibrary.org/b/id/6984441-L.jpg',
    status: 'finished' as const,
    rating: 4,
    review: 'La question du genre dans la langue sf, très bien exécutée.',
    finishedAt: new Date('2024-04-30'),
    startedAt: new Date('2024-04-18'),
  },
  {
    title: 'A Memory Called Empire',
    author: 'Arkady Martine',
    genre: ['Science-Fiction'],
    language: 'vo' as const,
    pages: 462,
    publishedYear: 2019,
    coverUrl: 'https://covers.openlibrary.org/b/id/10519685-L.jpg',
    status: 'finished' as const,
    rating: 5,
    review: "L'une des meilleures SF politiques de ces dernières années.",
    finishedAt: new Date('2024-07-18'),
    startedAt: new Date('2024-07-05'),
  },
  {
    title: 'A Desolation Called Peace',
    author: 'Arkady Martine',
    genre: ['Science-Fiction'],
    language: 'vo' as const,
    pages: 496,
    publishedYear: 2021,
    status: 'wishlist' as const,
  },
  {
    title: 'Babel',
    author: 'R.F. Kuang',
    genre: ['Fantasy', 'Historique'],
    language: 'vo' as const,
    pages: 560,
    publishedYear: 2022,
    coverUrl: 'https://covers.openlibrary.org/b/id/12947946-L.jpg',
    status: 'finished' as const,
    rating: 4,
    review:
      'Dense, savant, engagé. La magie de la traduction est une idée brillante.',
    finishedAt: new Date('2024-10-10'),
    startedAt: new Date('2024-09-28'),
  },
  {
    title: 'The Poppy War',
    author: 'R.F. Kuang',
    genre: ['Fantasy', 'Historique'],
    language: 'vo' as const,
    pages: 544,
    publishedYear: 2018,
    status: 'dropped' as const,
    review:
      "Trop violent pour moi, même si l'écriture est indéniablement puissante.",
    startedAt: new Date('2024-05-10'),
  },
  {
    title: 'The Long Way to a Small, Angry Planet',
    author: 'Becky Chambers',
    genre: ['Science-Fiction'],
    language: 'vo' as const,
    pages: 404,
    publishedYear: 2014,
    coverUrl: 'https://covers.openlibrary.org/b/id/8239444-L.jpg',
    status: 'finished' as const,
    rating: 5,
    review:
      "SF cosy et chaleureuse, des personnages qu'on ne veut pas quitter.",
    finishedAt: new Date('2023-12-28'),
    startedAt: new Date('2023-12-15'),
  },
  {
    title: 'A Psalm for the Wild-Built',
    author: 'Becky Chambers',
    genre: ['Science-Fiction'],
    language: 'vo' as const,
    pages: 160,
    publishedYear: 2021,
    status: 'wishlist' as const,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('🍃 Connected to MongoDB');

  // Nettoyage du compte test s'il existe déjà
  const existing = await User.findOne({ email: EMAIL });
  if (existing) {
    const uid = existing._id;
    await Promise.all([
      Read.deleteMany({ userId: uid }),
      Book.deleteMany({ userId: uid }),
      Shelf.deleteMany({ userId: uid }),
      Challenge.deleteMany({ userId: uid }),
    ]);
    await User.deleteOne({ _id: uid });
    console.log('🧹 Existing test user cleaned up');
  }

  const hash = await bcrypt.hash(PASSWORD, 12);
  const user = await User.create({ email: EMAIL, password: hash });
  const userId = user._id;
  console.log(`👤 User created: ${EMAIL} / ${PASSWORD}`);

  // Création des livres + reads
  for (const {
    status,
    rating,
    review,
    finishedAt,
    startedAt,
    currentPage,
    ...bookData
  } of books) {
    const book = await Book.create({ ...bookData, userId });
    await Read.create({
      userId,
      book: book._id,
      status,
      ...(rating !== undefined && { rating }),
      ...(review !== undefined && { review }),
      ...(finishedAt !== undefined && { finishedAt }),
      ...(startedAt !== undefined && { startedAt }),
      ...(currentPage !== undefined && { currentPage }),
    });
  }
  console.log(`📚 ${books.length} books seeded`);

  // Étagères
  const finishedBooks = await Book.find({
    userId,
    title: {
      $in: [
        'La Main gauche de la nuit',
        'Les Dépossédés',
        'The Fifth Season',
        'The Obelisk Gate',
        'The Long Way to a Small, Angry Planet',
        'A Memory Called Empire',
      ],
    },
  });
  const wishlistBooks = await Book.find({
    userId,
    title: {
      $in: [
        'MaddAddam',
        'A Desolation Called Peace',
        'A Psalm for the Wild-Built',
      ],
    },
  });

  await Shelf.create({
    userId,
    name: 'Coups de cœur',
    description: "Les livres qui m'ont marquée",
    books: finishedBooks.map((b) => b._id),
  });
  await Shelf.create({
    userId,
    name: 'À lire absolument',
    description: 'Ma pile à lire prioritaire',
    books: wishlistBooks.map((b) => b._id),
  });
  console.log('🍄 2 shelves created');

  // Challenge 2025
  await Challenge.create({
    userId,
    year: 2025,
    goalBooks: 20,
    targetGenres: ['Science-Fiction', 'Fantasy'],
    expiresAt: new Date(2026, 0, 1),
    books: (await Book.find({ userId })).map((b) => b._id).slice(0, 12),
  });
  console.log('🌙 Challenge 2025 created (goal: 20 books)');

  await mongoose.disconnect();
  console.log('\n✦ Seed complete!');
  console.log(`   Email    : ${EMAIL}`);
  console.log(`   Password : ${PASSWORD}`);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
