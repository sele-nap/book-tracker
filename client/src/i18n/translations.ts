export type Locale = 'fr' | 'en';

export const translations = {
  fr: {
    nav: {
      library: 'Bibliothèque',
      reading: 'En cours',
      shelves: 'Étagères',
      stats: 'Stats',
      challenges: 'Challenges',
    },
    library: {
      title: 'Bibliothèque',
      add: '+ Ajouter',
      search: 'Chercher un titre, un auteur…',
      empty: 'Aucun livre trouvé 🍂',
      filters: {
        all: 'Tous',
        reading: '🕯️ En cours',
        finished: '✦ Lus',
        wishlist: '🌙 Wishlist',
        dropped: '— Abandonnés',
      },
    },
    status: {
      reading: '🕯️ en cours',
      finished: '✦ lu',
      dropped: '— abandonné',
      wishlist: '🌙 wishlist',
    },
    bookLanguage: {
      label: 'Langue de lecture',
      vo: 'VO',
      vf: 'VF',
      other: 'Autre',
    },
    reading: { title: 'En cours', subtitle: 'tes lectures du moment 🕯️' },
    shelves: { title: 'Étagères', subtitle: 'tes collections 🍄' },
    stats: { title: 'Stats', subtitle: 'tes habitudes de lecture ✦' },
    challenges: {
      title: 'Challenges',
      subtitle: "tes objectifs de l'année 🌙",
    },
  },

  en: {
    nav: {
      library: 'Library',
      reading: 'Reading',
      shelves: 'Shelves',
      stats: 'Stats',
      challenges: 'Challenges',
    },
    library: {
      title: 'Library',
      add: '+ Add book',
      search: 'Search a title, an author…',
      empty: 'no books found 🍂',
      filters: {
        all: 'All',
        reading: '🕯️ Reading',
        finished: '✦ Finished',
        wishlist: '🌙 Wishlist',
        dropped: '— Dropped',
      },
    },
    status: {
      reading: '🕯️ reading',
      finished: '✦ finished',
      dropped: '— dropped',
      wishlist: '🌙 wishlist',
    },
    bookLanguage: {
      label: 'Reading language',
      vo: 'Original',
      vf: 'Translated',
      other: 'Other',
    },
    reading: { title: 'Reading', subtitle: 'your current reads 🕯️' },
    shelves: { title: 'Shelves', subtitle: 'your collections 🍄' },
    stats: { title: 'Stats', subtitle: 'your reading habits ✦' },
    challenges: { title: 'Challenges', subtitle: 'your yearly goals 🌙' },
  },
} satisfies Record<Locale, unknown>;

export type Translations = typeof translations.fr;
