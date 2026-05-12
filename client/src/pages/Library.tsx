import { useState } from 'react';
import BookCard from '../components/BookCard';
import { useLanguage } from '../i18n/LanguageContext';

const MOCK_BOOKS = [
  { id: '1', title: 'The Name of the Wind',    author: 'Patrick Rothfuss',    genre: ['fantasy', 'aventure'], status: 'finished' as const, rating: 5, language: 'vo' as const },
  { id: '2', title: 'Piranesi',                author: 'Susanna Clarke',       genre: ['fantasy', 'mystère'],  status: 'finished' as const, rating: 5, language: 'vf' as const },
  { id: '3', title: 'The Way of Kings',        author: 'Brandon Sanderson',    genre: ['fantasy', 'épique'],   status: 'reading'  as const,             language: 'vo' as const },
  { id: '4', title: 'Mexican Gothic',          author: 'Silvia Moreno-Garcia', genre: ['horreur', 'gothic'],   status: 'wishlist' as const },
  { id: '5', title: 'A Memory Called Empire',  author: 'Arkady Martine',       genre: ['sci-fi', 'politique'], status: 'finished' as const, rating: 4, language: 'vo' as const },
  { id: '6', title: 'Spinning Silver',         author: 'Naomi Novik',          genre: ['fantasy', 'conte'],    status: 'dropped'  as const, rating: 3, language: 'vf' as const },
  { id: '7', title: 'The Starless Sea',        author: 'Erin Morgenstern',     genre: ['fantasy', 'littéraire'], status: 'wishlist' as const },
  { id: '8', title: 'Babel',                   author: 'R.F. Kuang',           genre: ['fantasy', 'historique'], status: 'reading' as const, language: 'vo' as const },
];

export default function Library() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const STATUS_FILTERS = [
    { value: 'all',      label: t.library.filters.all },
    { value: 'reading',  label: t.library.filters.reading },
    { value: 'finished', label: t.library.filters.finished },
    { value: 'wishlist', label: t.library.filters.wishlist },
    { value: 'dropped',  label: t.library.filters.dropped },
  ];

  const filtered = MOCK_BOOKS.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-1">{t.library.title}</h1>
          <p className="text-parchment">{MOCK_BOOKS.length} livres ✨</p>
        </div>
        <button className="bg-wine hover:bg-rose text-cream text-sm px-4 py-2 rounded-lg transition-colors font-body">
          {t.library.add}
        </button>
      </div>

      <input
        type="text"
        placeholder={t.library.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-dusk border border-mist/30 rounded-lg px-4 py-2.5 text-cream placeholder:text-stone text-sm outline-none focus:border-mist/70 mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              statusFilter === value
                ? 'bg-wine text-cream'
                : 'bg-bark text-parchment hover:bg-mist/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone text-center mt-16">{t.library.empty}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}
    </div>
  );
}
