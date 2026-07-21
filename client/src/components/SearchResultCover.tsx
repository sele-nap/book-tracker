import { Book } from '@phosphor-icons/react';
import { useState } from 'react';

type Props = {
  coverUrl?: string;
};

export default function SearchResultCover({ coverUrl }: Props) {
  const [failed, setFailed] = useState(false);

  if (!coverUrl || failed) {
    return (
      <div
        aria-hidden="true"
        className="w-8 h-11 bg-bark rounded shrink-0 flex items-center justify-center"
      >
        <Book size={14} weight="light" className="opacity-20 text-parchment" />
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt=""
      onError={() => setFailed(true)}
      className="w-8 h-11 object-cover rounded shrink-0"
    />
  );
}
