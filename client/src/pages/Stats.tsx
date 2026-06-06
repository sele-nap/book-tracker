import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import useSWR from 'swr';
import type {
  GlobalStats,
  StatByGenre,
  StatByMonth,
  StatByRating,
} from '../api/stats';
import { statsApi } from '../api/stats';
import ApiError from '../components/ApiError';
import { StatsSkeleton } from '../components/Skeleton';
import { useLanguage } from '../hooks/useLanguage';

const MONTHS_FR = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Jun',
  'Jul',
  'Aoû',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];
const MONTHS_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const COLORS = [
  '#b856a0',
  '#d07ab8',
  '#e8a4d0',
  '#c49a50',
  '#8aaa70',
  '#5a8a50',
  '#564474',
];

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-dusk border border-mist/30 rounded-xl p-5">
      <p className="text-stone text-xs uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-cream font-display text-3xl">{value}</p>
      {sub && <p className="text-parchment text-xs mt-1">{sub}</p>}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: '#2e2244',
  border: '1px solid #564474',
  borderRadius: '8px',
  color: '#faf0fc',
  fontSize: '12px',
};

export default function Stats() {
  const { t, locale } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const months = locale === 'fr' ? MONTHS_FR : MONTHS_EN;

  const {
    data: global,
    isLoading: loading,
    error: statsErr,
  } = useSWR<GlobalStats>('/stats/global', statsApi.global);
  const { data: byMonth } = useSWR<StatByMonth[]>(
    ['/stats/by-month', year],
    () => statsApi.byMonth(year),
  );
  const { data: byGenre } = useSWR<StatByGenre[]>(
    '/stats/by-genre',
    statsApi.byGenre,
  );
  const { data: ratings } = useSWR<StatByRating[]>(
    '/stats/ratings-by-genre',
    statsApi.ratingsByGenre,
  );
  const { data: streakData } = useSWR<{ streak: number }>(
    '/stats/streak',
    statsApi.streak,
  );

  useEffect(() => {
    document.title = `${t.stats.title} — Book Tracker`;
  }, [t]);

  const finished = global?.finished[0];
  const statusMap = Object.fromEntries(
    global?.byStatus.map((s) => [s.status, s.count]) ?? [],
  );
  const totalPages = global?.totalPages[0]?.total ?? 0;

  const monthData = Array.from({ length: 12 }, (_, i) => ({
    month: months[i],
    count: byMonth?.find((b) => b.month === i + 1)?.count ?? 0,
  }));

  const radialData = byGenre?.slice(0, 6).map((g, i) => ({
    name: g.genre,
    value: g.count,
    fill: COLORS[i % COLORS.length],
  }));

  if (loading || statsErr)
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl mb-1">{t.stats.title}</h1>
          <p className="text-parchment">{t.stats.subtitle}</p>
        </div>
        {loading ? (
          <StatsSkeleton />
        ) : (
          <ApiError message={statsErr?.message ?? 'Unknown error'} />
        )}
      </div>
    );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-1">{t.stats.title}</h1>
        <p className="text-parchment">{t.stats.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label={t.stats.finished} value={finished?.totalBooks ?? 0} />
        <StatCard label={t.stats.reading} value={statusMap['reading'] ?? 0} />
        <StatCard label={t.stats.wishlist} value={statusMap['wishlist'] ?? 0} />
        <StatCard
          label={t.stats.avgRating}
          value={finished?.avgRating ? `${finished.avgRating} ★` : '—'}
        />
        <StatCard
          label={t.stats.totalPages}
          value={totalPages.toLocaleString()}
        />
        <StatCard label={t.stats.streak} value={streakData?.streak ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-dusk border border-mist/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-parchment text-sm">{t.stats.byMonth}</p>
            <div role="group" aria-label="Select year" className="flex gap-1">
              {[currentYear - 1, currentYear].map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  aria-pressed={year === y}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${year === y ? 'bg-wine text-cream' : 'text-stone hover:text-parchment'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthData} barSize={14}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#564474"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: '#c0a0cc', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#c0a0cc', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: 'rgba(184,86,160,0.12)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {monthData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? '#b856a0' : '#d07ab8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dusk border border-mist/30 rounded-xl p-5">
          <p className="text-parchment text-sm mb-4">{t.stats.byGenre}</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart
                innerRadius="30%"
                outerRadius="100%"
                data={radialData ?? []}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={4} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 text-xs shrink-0 w-full sm:w-auto">
              {radialData?.map((g) => (
                <div key={g.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: g.fill }}
                  />
                  <span className="text-parchment">{g.name}</span>
                  <span className="text-stone ml-auto pl-2">{g.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-dusk border border-mist/30 rounded-xl p-5 lg:col-span-2">
          <p className="text-parchment text-sm mb-4">
            {t.stats.ratingsByGenre}
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ratings ?? []} barSize={20} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#564474"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 5]}
                tick={{ fill: '#c0a0cc', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="genre"
                tick={{ fill: '#c0a0cc', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={64}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: 'rgba(184,86,160,0.12)' }}
                formatter={(v) => [`${v} ★`, '']}
              />
              <Bar dataKey="avgRating" radius={[0, 4, 4, 0]}>
                {(ratings ?? []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
