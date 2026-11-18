import { Award, CheckCircle2, Flame, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import {
  BIN_CONFIGS,
  POINTS_PER_CORRECT,
  RoundAnswer,
  TOTAL_QUESTIONS,
} from '../data/wasteItems';
import { ConfettiBurst } from './ConfettiBurst';
import { WasteItemImage } from './WasteItemImage';

interface SummaryScreenProps {
  answers: RoundAnswer[];
  bestStreak: number;
  onPlayAgain: () => void;
  onBackHome: () => void;
}

export function SummaryScreen({
  answers,
  bestStreak,
  onPlayAgain,
  onBackHome,
}: SummaryScreenProps) {
  const totalScore = answers.reduce((sum, ans) => sum + ans.pointsEarned, 0);
  const maxScore = TOTAL_QUESTIONS * POINTS_PER_CORRECT;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracyPercent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

  let headline = 'Good Effort! Keep Practicing!';
  let subline = 'Review the missed items below and try another round to boost your sorting score.';

  if (totalScore === maxScore) {
    headline = 'Perfect Recycling Champion!';
    subline = 'You sorted every single Organic, Inorganic, and B3 hazardous item into the right bin.';
  } else if (totalScore >= 80) {
    headline = 'Awesome Waste Sorter!';
    subline = 'You know how to keep toxic B3 waste safe and send recyclables to the right place.';
  } else if (totalScore >= 60) {
    headline = 'Solid Job Sorting!';
    subline = 'You are building great recycling habits. Check the review below to master the rest!';
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8">
      {/* Celebratory Green Confetti Shower on Winning Rounds */}
      <ConfettiBurst triggerKey={totalScore >= 60 ? 1 : 0} mode="victory" />

      {/* Score & Impact Summary Card */}
      <section className="bg-white/95 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 text-emerald-800 font-bold text-base sm:text-lg">
              <Award className="w-6 h-6 text-emerald-700" aria-hidden="true" />
              <span>Round Complete</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
              {headline}
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
              {subline}
            </p>

            {/* Primary Smartboard Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={onPlayAgain}
                className="min-h-[68px] px-8 py-4 rounded-2xl bg-emerald-700 text-white font-display text-xl sm:text-2xl font-bold inline-flex items-center justify-center gap-3 shadow-md active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-6 h-6" aria-hidden="true" />
                <span>Play New Randomized Round</span>
              </button>

              <button
                type="button"
                onClick={onBackHome}
                className="min-h-[68px] px-7 py-4 rounded-2xl bg-slate-100 border-2 border-slate-300 text-slate-900 font-display text-lg sm:text-xl font-bold inline-flex items-center justify-center active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 cursor-pointer whitespace-nowrap"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* Score, Accuracy & Best Streak Readout Box */}
          <div className="w-full max-w-sm bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-center space-y-4 shrink-0">
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-600">Final Score</div>
              <div className="font-display text-5xl sm:text-6xl font-extrabold text-slate-900 tabular-nums mt-1">
                {totalScore}
                <span className="text-2xl font-bold text-slate-500"> / {maxScore}</span>
              </div>
            </div>

            <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${accuracyPercent}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-base font-bold text-slate-800 tabular-nums">
              <div>
                <div className="text-xs text-slate-600">Correct</div>
                <div className="text-xl text-emerald-800">{correctCount}/{TOTAL_QUESTIONS}</div>
              </div>
              <div className="border-x border-slate-300 px-2">
                <div className="text-xs text-slate-600">Accuracy</div>
                <div className="text-xl text-slate-900">{accuracyPercent}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-600 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                  <span>Best Streak</span>
                </div>
                <div className="text-xl text-amber-700">{bestStreak}x</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Lesson Reminder */}
      <section className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Sparkles className="w-8 h-8 text-emerald-700 shrink-0" aria-hidden="true" />
        <p className="text-base sm:text-lg font-semibold text-emerald-950 leading-relaxed">
          Every time you separate food scraps, clean recyclables, and hazardous B3 items at school or home, you reduce landfill pollution and protect clean water for everyone.
        </p>
      </section>

      {/* 10-Question Answer Breakdown */}
      <section aria-label="Answer Breakdown" className="space-y-4">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Question-by-Question Review
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {answers.map((ans, index) => {
            const correctBin = BIN_CONFIGS[ans.item.category];
            const chosenLabel =
              ans.chosenCategory === 'timeout'
                ? 'Time ran out'
                : BIN_CONFIGS[ans.chosenCategory].label;

            return (
              <div
                key={`${ans.item.id}-${index}`}
                className={`p-4 sm:p-5 rounded-2xl border-2 bg-white flex items-center gap-4 ${
                  ans.isCorrect ? 'border-emerald-300' : 'border-rose-300'
                }`}
              >
                <div className="w-20 h-20 shrink-0 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center">
                  <WasteItemImage
                    src={ans.item.imageUrl}
                    alt={ans.item.name}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">
                      {index + 1}. {ans.item.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-display text-base font-extrabold tabular-nums shrink-0 ${
                        ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {ans.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                          <span>+{POINTS_PER_CORRECT}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" aria-hidden="true" />
                          <span>0</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-sm sm:text-base font-semibold text-slate-700">
                    Correct Bin: <span className={correctBin.headingTextClass}>{correctBin.label}</span>
                  </div>

                  {!ans.isCorrect && (
                    <div className="text-sm font-medium text-rose-800">
                      You picked: {chosenLabel}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
