import { AlertTriangle, BookOpen, Clock, Leaf, Play, Recycle, ShieldCheck } from 'lucide-react';
import { BIN_CONFIGS, BIN_ORDER, POINTS_PER_CORRECT, TOTAL_QUESTIONS } from '../data/wasteItems';

export type TimerOption = 0 | 15 | 20;

interface TitleScreenProps {
  timerDuration: TimerOption;
  onChangeTimer: (seconds: TimerOption) => void;
  onStartGame: () => void;
  onOpenGuide: () => void;
}

const TIMER_OPTIONS: { value: TimerOption; label: string }[] = [
  { value: 0, label: 'Timer Off' },
  { value: 15, label: '15s / Item' },
  { value: 20, label: '20s / Item' },
];

export function TitleScreen({
  timerDuration,
  onChangeTimer,
  onStartGame,
  onOpenGuide,
}: TitleScreenProps) {
  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Main Focal Hero Container */}
      <section className="bg-white/95 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
              Sort Waste Smartly. Protect Our Planet.
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-2xl">
              Every piece of trash has a right place. Sort{' '}
              <span className="font-bold text-slate-900">{TOTAL_QUESTIONS} randomized items</span>{' '}
              into Organic, Inorganic, and B3 Hazardous bins to earn{' '}
              <span className="font-bold text-emerald-800">+{POINTS_PER_CORRECT} points</span>{' '}
              each and build your winning streak!
            </p>

            {/* Optional Timer Selector (Smartboard Touch-Friendly >= 56px) */}
            <div className="pt-1 space-y-2.5">
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800">
                <Clock className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
                <span>Optional Question Timer</span>
              </div>
              <div
                className="inline-flex flex-wrap gap-2 p-1.5 bg-slate-100 border-2 border-slate-200 rounded-2xl"
                role="radiogroup"
                aria-label="Optional Question Timer"
              >
                {TIMER_OPTIONS.map((option) => {
                  const active = timerDuration === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => onChangeTimer(option.value)}
                      className={`min-h-[52px] px-5 py-2.5 rounded-xl font-display text-base sm:text-lg font-bold transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 ${
                        active
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Smartboard Action Buttons (>= 68px height) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStartGame}
                className="min-h-[68px] px-8 py-4 rounded-2xl bg-emerald-700 text-white font-display text-xl sm:text-2xl font-bold inline-flex items-center justify-center gap-3 shadow-md active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 cursor-pointer whitespace-nowrap"
              >
                <Play className="w-7 h-7 fill-current" aria-hidden="true" />
                <span>Start 10-Question Game</span>
              </button>

              <button
                type="button"
                onClick={onOpenGuide}
                className="min-h-[68px] px-7 py-4 rounded-2xl bg-slate-100 border-2 border-slate-300 text-slate-900 font-display text-lg sm:text-xl font-bold inline-flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-6 h-6 text-slate-800" aria-hidden="true" />
                <span>Read 3-Bin Guide</span>
              </button>
            </div>

            {/* Clean Unboxed Metadata Line */}
            <div className="pt-1 flex flex-wrap items-center gap-3 text-sm sm:text-base font-semibold text-slate-600">
              <span>{TOTAL_QUESTIONS} Randomized Questions</span>
              <span aria-hidden="true">·</span>
              <span>Streak Combos</span>
              <span aria-hidden="true">·</span>
              <span>Drag &amp; Drop or Direct Tap</span>
            </div>
          </div>

          {/* Right Impact Highlight Column */}
          <div className="lg:col-span-5 bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-700 shrink-0" aria-hidden="true" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Why Recycling Matters
              </h2>
            </div>

            <div className="space-y-4 text-base sm:text-lg text-slate-800 leading-relaxed">
              <div>
                <div className="font-bold text-slate-900">Turns Food Into Soil</div>
                <p className="text-slate-700 text-base">
                  Composting organic scraps stops landfill methane and nourishes new plants.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <div className="font-bold text-slate-900">Saves Trees, Water &amp; Energy</div>
                <p className="text-slate-700 text-base">
                  Recycling plastic, paper, cans, and glass cuts down mining and pollution.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <div className="font-bold text-slate-900">Stops Toxic B3 Leaks</div>
                <p className="text-slate-700 text-base">
                  Separating batteries, paint, and light bulbs keeps poisonous chemicals out of drinking water.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Trash Bin Preview Strip */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5" aria-label="Three Waste Categories">
        {BIN_ORDER.map((category) => {
          const bin = BIN_CONFIGS[category];
          return (
            <div
              key={bin.id}
              className={`p-6 rounded-2xl border-2 ${bin.surfaceBgClass} ${bin.borderClass} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {category === 'organic' && <Leaf className="w-7 h-7 text-emerald-700 shrink-0" aria-hidden="true" />}
                  {category === 'inorganic' && <Recycle className="w-7 h-7 text-sky-700 shrink-0" aria-hidden="true" />}
                  {category === 'b3' && <AlertTriangle className="w-7 h-7 text-rose-700 shrink-0" aria-hidden="true" />}
                  <h3 className={`font-display text-2xl font-bold ${bin.headingTextClass}`}>
                    {bin.label}
                  </h3>
                </div>
                <p className={`text-base font-medium leading-relaxed ${bin.bodyTextClass}`}>
                  {bin.description}
                </p>
              </div>
              <div className={`mt-4 pt-3 border-t border-slate-900/10 text-sm sm:text-base font-bold ${bin.headingTextClass}`}>
                {bin.examples.join(' · ')}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
