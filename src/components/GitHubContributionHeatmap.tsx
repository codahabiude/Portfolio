import { ExternalLink, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  GitHubContributionDay,
  GitHubContributionsPayload,
} from '../types/portfolio.ts';
import { GitHubLogo } from './BrandMarks.tsx';

const MONTH_NAMES = [
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

const LEVEL_STYLES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-[#10141d] border-white/8 hover:border-white/35',
  1: 'bg-[#0b3b24] border-[#15803d]/45 hover:border-[#22c55e]',
  2: 'bg-[#15803d] border-[#22c55e]/60 hover:border-[#4ade80]',
  3: 'bg-[#22c55e] border-[#4ade80]/80 hover:border-white',
  4: 'bg-[#00ff88] border-[#86efac] shadow-[0_0_8px_rgba(0,255,136,0.45)] hover:border-white',
};

const LEVEL_LABELS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'Idle',
  1: 'Light',
  2: 'Moderate',
  3: 'High',
  4: 'Peak',
};

function formatDisplayDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function GitHubContributionHeatmap() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<GitHubContributionsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<GitHubContributionDay | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<0 | 1 | 2 | 3 | 4 | null>(null);

  const loadContributions = useCallback(async (forceSync = false) => {
    if (forceSync) setSyncing(true);
    else setLoading(true);
    setError(null);
    try {
      const url = forceSync
        ? '/api/github/contributions?sync=1'
        : '/api/github/contributions';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Unable to fetch GitHub contributions');
      const payload = (await res.json()) as GitHubContributionsPayload;
      setData(payload);
      const latestActive = [...payload.days]
        .reverse()
        .find((d) => d.count > 0 || d.level > 0);
      setSelectedDay(latestActive ?? payload.days[payload.days.length - 1] ?? null);
    } catch {
      setError('Could not load live GitHub contribution calendar.');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadContributions(false);
  }, [loadContributions]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !data) return;
    if (el.scrollWidth > el.clientWidth) {
      el.scrollLeft = el.scrollWidth;
    }
  }, [data]);

  const { weeks, monthLabels } = useMemo(() => {
    if (!data || data.days.length === 0) {
      return {
        weeks: [] as (GitHubContributionDay | null)[][],
        monthLabels: [] as { colIndex: number; label: string }[],
      };
    }

    const builtWeeks: (GitHubContributionDay | null)[][] = [];
    let currentWeek: (GitHubContributionDay | null)[] = Array(7).fill(null);

    for (const day of data.days) {
      if (day.weekday === 0 && currentWeek.some((cell) => cell !== null)) {
        builtWeeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
      currentWeek[day.weekday] = day;
    }
    if (currentWeek.some((cell) => cell !== null)) {
      builtWeeks.push(currentWeek);
    }

    const labels: { colIndex: number; label: string }[] = [];
    let lastMonth = -1;
    builtWeeks.forEach((week, colIndex) => {
      const firstDay = week.find((d): d is GitHubContributionDay => d !== null);
      if (!firstDay) return;
      const monthIdx = Number.parseInt(firstDay.date.slice(5, 7), 10) - 1;
      if (monthIdx !== lastMonth) {
        if (labels.length === 0 || colIndex - labels[labels.length - 1].colIndex >= 2) {
          labels.push({ colIndex, label: MONTH_NAMES[monthIdx] ?? '' });
        }
        lastMonth = monthIdx;
      }
    });

    return { weeks: builtWeeks, monthLabels: labels };
  }, [data]);

  const filteredDayCount = useMemo(() => {
    if (!data || activeLevelFilter === null) return null;
    return data.days.filter((d) => d.level === activeLevelFilter).length;
  }, [data, activeLevelFilter]);

  return (
    <div className="mt-10 rounded-2xl bg-[#0a0c12]/92 border border-white/12 p-6 sm:p-8">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#06080d] border border-white/15 flex items-center justify-center text-[var(--accent)] shrink-0">
            <GitHubLogo className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--accent)]">
              github.com/codahabiude · Activity Heatmap
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              GitHub Contribution Grid (@codahabiude)
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => loadContributions(true)}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#06080d] border border-white/15 text-xs font-medium text-slate-200 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Refreshing...' : 'Refresh Activity'}</span>
          </button>

          <a
            href={data?.profileUrl ?? 'https://github.com/codahabiude'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#06080d] border border-white/15 text-xs font-medium text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl bg-[#06080d] border border-white/10 p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-14 rounded-lg bg-white/5 border border-white/8" />
            ))}
          </div>
          <div className="h-32 rounded-lg bg-white/5 border border-white/8" />
        </div>
      ) : error || !data ? (
        <div className="rounded-xl bg-[#06080d] border border-rose-500/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-rose-200">
            {error ?? 'Unable to load GitHub contribution data.'}
          </p>
          <button
            type="button"
            onClick={() => loadContributions(true)}
            className="px-4 py-2 rounded-lg bg-white text-[#050507] text-xs font-semibold self-start"
          >
            Retry Fetch
          </button>
        </div>
      ) : (
        <>
          {/* KPI Metric Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl bg-[#06080d] border border-white/10 px-4 py-3.5">
              <p className="font-mono text-xl sm:text-2xl font-medium text-white">
                {data.totalContributions}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Contributions (Last Year)</p>
            </div>
            <div className="rounded-xl bg-[#06080d] border border-white/10 px-4 py-3.5">
              <p className="font-mono text-xl sm:text-2xl font-medium text-[var(--accent)]">
                {data.activeDays}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Active Coding Days</p>
            </div>
            <div className="rounded-xl bg-[#06080d] border border-white/10 px-4 py-3.5">
              <p className="font-mono text-xl sm:text-2xl font-medium text-white">
                {data.longestStreak}d
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Longest Streak</p>
            </div>
            <div className="rounded-xl bg-[#06080d] border border-white/10 px-4 py-3.5">
              <p className="font-mono text-xl sm:text-2xl font-medium text-white">
                {data.currentStreak}d
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Current Streak</p>
            </div>
          </div>

          {/* Interactive Calendar Heatmap Grid */}
          <div className="rounded-xl bg-[#06080d] border border-white/10 p-4 sm:p-5">
            <div ref={scrollContainerRef} className="overflow-x-auto pb-2">
              <div className="inline-block min-w-max">
                {/* Month Headers */}
                <div className="flex items-center mb-2 pl-9">
                  <div className="relative h-4" style={{ width: `${weeks.length * 16}px` }}>
                    {monthLabels.map((m) => (
                      <span
                        key={`${m.label}-${m.colIndex}`}
                        className="absolute top-0 font-mono text-[11px] text-slate-400"
                        style={{ left: `${m.colIndex * 16}px` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Weekday Labels + 53-Week Columns */}
                <div className="flex items-start gap-2">
                  <div className="grid grid-rows-7 gap-[3px] w-7 pt-[1px] text-[10px] font-mono text-slate-500 select-none">
                    <span className="h-[13px] leading-[13px]" />
                    <span className="h-[13px] leading-[13px]">Mon</span>
                    <span className="h-[13px] leading-[13px]" />
                    <span className="h-[13px] leading-[13px]">Wed</span>
                    <span className="h-[13px] leading-[13px]" />
                    <span className="h-[13px] leading-[13px]">Fri</span>
                    <span className="h-[13px] leading-[13px]" />
                  </div>

                  <div
                    role="grid"
                    aria-label="GitHub contribution heatmap for codahabiude"
                    className="flex gap-[3px]"
                  >
                    {weeks.map((week, colIdx) => (
                      <div key={colIdx} role="row" className="grid grid-rows-7 gap-[3px]">
                        {week.map((day, rowIdx) => {
                          if (!day) {
                            return (
                              <span
                                key={`empty-${colIdx}-${rowIdx}`}
                                aria-hidden="true"
                                className="w-[13px] h-[13px]"
                              />
                            );
                          }

                          const isSelected = selectedDay?.date === day.date;
                          const isDimmed =
                            activeLevelFilter !== null && day.level !== activeLevelFilter;

                          return (
                            <button
                              key={day.date}
                              type="button"
                              role="gridcell"
                              aria-label={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDisplayDate(day.date)}`}
                              aria-pressed={isSelected}
                              onMouseEnter={() => setSelectedDay(day)}
                              onFocus={() => setSelectedDay(day)}
                              onClick={() => setSelectedDay(day)}
                              className={`w-[13px] h-[13px] rounded-[3px] border transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white ${
                                LEVEL_STYLES[day.level]
                              } ${isSelected ? 'ring-2 ring-white scale-110 z-10' : ''} ${
                                isDimmed ? 'opacity-20' : 'opacity-100'
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Inspector + Intensity Filter Legend */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                {selectedDay ? (
                  <>
                    <span className="font-mono text-white font-medium">
                      {selectedDay.count} contribution
                      {selectedDay.count === 1 ? '' : 's'}
                    </span>
                    <span className="text-slate-500">on</span>
                    <span className="font-mono text-[var(--accent)]">
                      {formatDisplayDate(selectedDay.date)}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">
                      Intensity: {LEVEL_LABELS[selectedDay.level]}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">
                    Hover or select any cell to inspect daily activity.
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveLevelFilter(null)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    activeLevelFilter === null
                      ? 'bg-white/12 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <span className="text-[11px] font-mono text-slate-500">Less</span>
                {([0, 1, 2, 3, 4] as const).map((lvl) => {
                  const active = activeLevelFilter === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() =>
                        setActiveLevelFilter((prev) => (prev === lvl ? null : lvl))
                      }
                      aria-label={`Filter level ${lvl} (${LEVEL_LABELS[lvl]})`}
                      aria-pressed={active}
                      title={`${LEVEL_LABELS[lvl]} activity`}
                      className={`w-3.5 h-3.5 rounded-[3px] border transition-transform ${
                        LEVEL_STYLES[lvl]
                      } ${active ? 'ring-2 ring-white scale-115' : ''}`}
                    />
                  );
                })}
                <span className="text-[11px] font-mono text-slate-500">More</span>
                {filteredDayCount !== null && (
                  <span className="font-mono text-[11px] text-[var(--accent)] ml-1">
                    ({filteredDayCount}d)
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
