import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  GripHorizontal,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  BIN_CONFIGS,
  BIN_ORDER,
  POINTS_PER_CORRECT,
  RoundAnswer,
  TOTAL_QUESTIONS,
  WasteCategory,
  WasteItem,
} from '../data/wasteItems';
import { playSoundEffect } from '../utils/sound';
import { ConfettiBurst } from './ConfettiBurst';
import { TrashBinCard } from './TrashBinCard';
import { WasteItemImage } from './WasteItemImage';

interface GameBoardProps {
  items: WasteItem[];
  timerDuration: number;
  muted: boolean;
  isModalOpen: boolean;
  onAlertStateChange: (isWrongAlert: boolean) => void;
  onCompleteRound: (answers: RoundAnswer[], bestStreak: number) => void;
}

export function GameBoard({
  items,
  timerDuration,
  muted,
  isModalOpen,
  onAlertStateChange,
  onCompleteRound,
}: GameBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answers, setAnswers] = useState<RoundAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<RoundAnswer | null>(null);
  const [timeLeft, setTimeLeft] = useState(timerDuration);

  // Confetti & Red Flash VFX triggers
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiOrigin, setConfettiOrigin] = useState<{ x: number; y: number } | null>(null);
  const [redFlashKey, setRedFlashKey] = useState(0);

  // Pointer drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredBin, setHoveredBin] = useState<WasteCategory | null>(null);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const binRefs = useRef<Record<WasteCategory, HTMLButtonElement | null>>({
    organic: null,
    inorganic: null,
    b3: null,
  });

  const currentItem = items[currentIndex];
  const hasAnswered = currentAnswer !== null;
  const isWrongAnswer = currentAnswer !== null && !currentAnswer.isCorrect;
  const completedCount = answers.length;
  const progressPercent = Math.round((completedCount / TOTAL_QUESTIONS) * 100);

  // Sync outer classroom red alert background state
  useEffect(() => {
    onAlertStateChange(isWrongAnswer);
    return () => onAlertStateChange(false);
  }, [isWrongAnswer, onAlertStateChange]);

  const findBinAtPoint = useCallback((clientX: number, clientY: number): WasteCategory | null => {
    const padding = 16;
    const cardRect = cardRef.current?.getBoundingClientRect();
    const cardCenterX = cardRect ? cardRect.left + cardRect.width / 2 : clientX;
    const cardCenterY = cardRect ? cardRect.top + cardRect.height / 2 : clientY;

    for (const category of BIN_ORDER) {
      const el = binRefs.current[category];
      if (!el) continue;
      const rect = el.getBoundingClientRect();

      const pointerInside =
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding;

      const cardCenterInside =
        cardCenterX >= rect.left - padding &&
        cardCenterX <= rect.right + padding &&
        cardCenterY >= rect.top - padding &&
        cardCenterY <= rect.bottom + padding;

      if (pointerInside || cardCenterInside) {
        return category;
      }
    }
    return null;
  }, []);

  const submitAnswer = useCallback(
    (chosenCategory: WasteCategory | 'timeout') => {
      if (hasAnswered || !currentItem) return;

      const isCorrect = chosenCategory === currentItem.category;
      const pointsEarned = isCorrect ? POINTS_PER_CORRECT : 0;

      const result: RoundAnswer = {
        item: currentItem,
        chosenCategory,
        isCorrect,
        pointsEarned,
      };

      setCurrentAnswer(result);
      setAnswers((prev) => [...prev, result]);
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      setHoveredBin(null);
      dragStartRef.current = null;

      if (isCorrect) {
        setScore((prev) => prev + POINTS_PER_CORRECT);
        setStreak((prev) => {
          const next = prev + 1;
          setBestStreak((best) => Math.max(best, next));
          return next;
        });

        // Burst green confetti directly out of the chosen bin
        const binEl = binRefs.current[currentItem.category];
        if (binEl) {
          const rect = binEl.getBoundingClientRect();
          setConfettiOrigin({ x: rect.left + rect.width / 2, y: rect.top + 60 });
        } else {
          setConfettiOrigin(null);
        }
        setConfettiTrigger((k) => k + 1);
        playSoundEffect('correct', muted);
      } else {
        setStreak(0);
        setRedFlashKey((k) => k + 1);
        playSoundEffect('incorrect', muted);
      }
    },
    [currentItem, hasAnswered, muted]
  );

  // Optional countdown timer per question
  useEffect(() => {
    if (timerDuration <= 0 || hasAnswered || isModalOpen) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        if (prev <= 4) {
          playSoundEffect('tick', muted);
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerDuration, hasAnswered, isModalOpen, muted]);

  // Trigger timeout answer when countdown hits 0
  useEffect(() => {
    if (timerDuration > 0 && timeLeft === 0 && !hasAnswered) {
      submitAnswer('timeout');
    }
  }, [timerDuration, timeLeft, hasAnswered, submitAnswer]);

  const handleNextQuestion = useCallback(() => {
    if (!currentAnswer) return;

    if (currentIndex + 1 >= items.length) {
      playSoundEffect('complete', muted);
      onCompleteRound(answers, bestStreak);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setCurrentAnswer(null);
    setTimeLeft(timerDuration);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setHoveredBin(null);
  }, [
    answers,
    bestStreak,
    currentAnswer,
    currentIndex,
    items.length,
    muted,
    onCompleteRound,
    timerDuration,
  ]);

  // Keyboard shortcuts for desktop accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (!hasAnswered) {
        if (e.key === '1') submitAnswer('organic');
        else if (e.key === '2') submitAnswer('inorganic');
        else if (e.key === '3') submitAnswer('b3');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextQuestion, hasAnswered, isModalOpen, submitAnswer]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (hasAnswered) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if unsupported
    }

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    setHoveredBin(findBinAtPoint(e.clientX, e.clientY));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || hasAnswered) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
    setHoveredBin(findBinAtPoint(e.clientX, e.clientY));
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const dropTarget = findBinAtPoint(e.clientX, e.clientY);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setHoveredBin(null);
    dragStartRef.current = null;

    if (dropTarget && !hasAnswered) {
      submitAnswer(dropTarget);
    }
  };

  if (!currentItem) return null;

  const correctBinConfig = BIN_CONFIGS[currentItem.category];
  const timerPercent = timerDuration > 0 ? Math.round((timeLeft / timerDuration) * 100) : 100;
  const timerUrgent = timerDuration > 0 && timeLeft <= 5 && !hasAnswered;

  return (
    <main className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-7 space-y-6">
      {/* Celebratory Green Confetti Layer */}
      <ConfettiBurst triggerKey={confettiTrigger} origin={confettiOrigin} mode="bin" />

      {/* Brief Full-Viewport Red Flash on Wrong Answer */}
      {redFlashKey > 0 && isWrongAnswer && (
        <div
          key={redFlashKey}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-rose-600 pointer-events-none animate-red-pulse"
        />
      )}

      {/* HUD, Streak Combo, Optional Timer & Progress Tracking Bar */}
      <section
        aria-label="Game Progress, Streak, and Score"
        className={`border-2 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors duration-200 ${
          isWrongAnswer
            ? 'bg-rose-100 border-rose-500'
            : currentAnswer?.isCorrect
            ? 'bg-emerald-50/90 border-emerald-400'
            : 'bg-white/95 border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="font-display text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              Question {currentIndex + 1} of {TOTAL_QUESTIONS}
            </div>
            <div className="text-sm sm:text-base font-semibold text-slate-700 tabular-nums">
              {completedCount} of {TOTAL_QUESTIONS} sorted · {progressPercent}% complete
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Optional Countdown Timer Display */}
            {timerDuration > 0 && (
              <div
                className={`rounded-xl border-2 px-4 py-2 min-w-[104px] text-center ${
                  isWrongAnswer
                    ? 'bg-rose-200 border-rose-500 text-rose-950'
                    : timerUrgent
                    ? 'bg-rose-100 border-rose-500 text-rose-900'
                    : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Time Left</span>
                </div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums leading-none mt-0.5">
                  {timeLeft}s
                </div>
              </div>
            )}

            {/* Streak Combo Counter */}
            <div
              key={`streak-${streak}`}
              className={`rounded-xl border-2 px-4 py-2 min-w-[116px] text-center animate-combo-pop ${
                isWrongAnswer
                  ? 'bg-rose-200 border-rose-500 text-rose-950'
                  : streak >= 2
                  ? 'bg-amber-100 border-amber-500 text-amber-950'
                  : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-center gap-1">
                <Flame
                  className={`w-4 h-4 ${
                    streak >= 2 && !isWrongAnswer ? 'text-amber-600 fill-amber-500' : 'text-slate-600'
                  }`}
                  aria-hidden="true"
                />
                <span>Streak Combo</span>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums leading-none mt-0.5">
                {streak}x
              </div>
            </div>

            {currentAnswer?.isCorrect && (
              <div className="inline-flex items-center gap-1.5 text-emerald-800 font-display text-xl sm:text-2xl font-extrabold tabular-nums">
                <Sparkles className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                <span>+{POINTS_PER_CORRECT}</span>
              </div>
            )}

            {/* Score Box */}
            <div
              className={`border-2 rounded-xl px-5 py-2 text-right ${
                isWrongAnswer
                  ? 'bg-rose-200 border-rose-500'
                  : 'bg-slate-100 border-slate-300'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold text-slate-700">Score</div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums leading-none mt-0.5">
                {score}{' '}
                <span className="text-lg font-bold text-slate-600">
                  / {TOTAL_QUESTIONS * POINTS_PER_CORRECT}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Timer Bar */}
        {timerDuration > 0 && !hasAnswered && (
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-linear rounded-full ${
                timerUrgent ? 'bg-rose-600' : 'bg-sky-600'
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}

        {/* Continuous Round Progress Bar */}
        <div
          className={`w-full h-4 rounded-full overflow-hidden ${
            isWrongAnswer ? 'bg-rose-200' : 'bg-slate-200'
          }`}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Round progress: ${progressPercent}%`}
        >
          <div
            className={`h-full transition-all duration-200 ease-out rounded-full ${
              isWrongAnswer ? 'bg-rose-600' : 'bg-emerald-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 10-Step Classroom Question Strip */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2" aria-label="Question Tracker">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, idx) => {
            const answer = answers[idx];
            const isCurrent = idx === currentIndex && !hasAnswered;
            let cellClass = 'bg-slate-100 border-slate-300 text-slate-500';
            if (answer?.isCorrect) {
              cellClass = 'bg-emerald-600 border-emerald-700 text-white';
            } else if (answer && !answer.isCorrect) {
              cellClass = 'bg-rose-600 border-rose-700 text-white';
            } else if (isCurrent) {
              cellClass = 'bg-slate-900 border-slate-900 text-white ring-2 ring-slate-400';
            }

            return (
              <div
                key={idx}
                className={`h-8 sm:h-9 rounded-lg border flex items-center justify-center font-display text-sm sm:text-base font-bold tabular-nums ${cellClass}`}
                aria-label={`Question ${idx + 1}: ${
                  answer
                    ? answer.isCorrect
                      ? 'Correct'
                      : 'Incorrect'
                    : isCurrent
                    ? 'Current'
                    : 'Upcoming'
                }`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Waste Item Stage OR Inline Feedback Stage */}
      <section className="relative z-20" aria-live="polite">
        {!hasAnswered ? (
          <div className="bg-white/95 border-2 border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col items-center text-center">
            <p className="text-base sm:text-lg font-bold text-slate-700 mb-4">
              Drag this waste item into the right trash bin — or tap a bin below!
            </p>

            {/* Draggable Waste Card */}
            <div
              ref={cardRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              style={{
                touchAction: 'none',
                transform: isDragging
                  ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(1.05)`
                  : 'translate3d(0px, 0px, 0px)',
                transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              role="button"
              tabIndex={0}
              aria-label={`Draggable waste item: ${currentItem.name}`}
              className={`relative z-30 w-full max-w-sm bg-white border-2 rounded-2xl p-5 select-none cursor-grab active:cursor-grabbing ${
                isDragging
                  ? 'border-slate-900 shadow-2xl ring-4 ring-slate-900/20'
                  : 'border-slate-300 shadow-md'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-600 mb-3">
                <GripHorizontal className="w-5 h-5 text-slate-500" aria-hidden="true" />
                <span>Hold &amp; Drag Item</span>
              </div>

              <div className="w-44 h-44 sm:w-52 sm:h-52 mx-auto bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
                <WasteItemImage
                  src={currentItem.imageUrl}
                  alt={currentItem.name}
                  className="w-full h-full p-2"
                />
              </div>

              <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentItem.name}
              </h2>
            </div>
          </div>
        ) : (
          <div
            className={`rounded-3xl border-2 p-6 sm:p-8 shadow-sm transition-colors duration-200 ${
              currentAnswer.isCorrect
                ? 'bg-emerald-50 border-emerald-500'
                : 'bg-rose-200 border-rose-600'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Thumbnail */}
              <div
                className={`w-32 h-32 sm:w-36 sm:h-36 shrink-0 bg-white border-2 rounded-2xl p-2 flex items-center justify-center ${
                  currentAnswer.isCorrect ? 'border-emerald-300' : 'border-rose-400'
                }`}
              >
                <WasteItemImage
                  src={currentItem.imageUrl}
                  alt={currentItem.name}
                  className="w-full h-full"
                />
              </div>

              {/* Educational Explanation */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  {currentAnswer.isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-700 shrink-0" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-800 shrink-0" aria-hidden="true" />
                  )}
                  <h2
                    className={`font-display text-2xl sm:text-3xl font-extrabold ${
                      currentAnswer.isCorrect ? 'text-emerald-950' : 'text-rose-950'
                    }`}
                  >
                    {currentAnswer.isCorrect
                      ? streak >= 2
                        ? `Correct! +${POINTS_PER_CORRECT} Points · ${streak}x Streak!`
                        : `Correct! +${POINTS_PER_CORRECT} Points`
                      : currentAnswer.chosenCategory === 'timeout'
                      ? `Time's Up! Goes in ${correctBinConfig.label}`
                      : `Oops! Goes in ${correctBinConfig.label}`}
                  </h2>
                </div>

                <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  {currentItem.explanation}
                </p>
                <p
                  className={`text-sm sm:text-base font-medium leading-relaxed ${
                    currentAnswer.isCorrect ? 'text-slate-700' : 'text-rose-950'
                  }`}
                >
                  Why it matters: {currentItem.impactFact}
                </p>
              </div>

              {/* Large Next Question Button */}
              <div className="w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className={`w-full md:w-auto min-h-[68px] px-8 py-4 rounded-2xl text-white font-display text-xl font-bold inline-flex items-center justify-center gap-3 shadow-md active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-4 cursor-pointer whitespace-nowrap ${
                    isWrongAnswer
                      ? 'bg-rose-800 focus-visible:ring-slate-900'
                      : 'bg-slate-900 focus-visible:ring-emerald-600'
                  }`}
                >
                  <span>
                    {currentIndex + 1 >= items.length ? 'View Final Score' : 'Next Question'}
                  </span>
                  <ArrowRight className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Three Large Trash Can Targets */}
      <section aria-label="Trash Bins" className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {BIN_ORDER.map((category) => {
            let feedbackState: 'idle' | 'correct-target' | 'wrong-target' | 'reveal-correct' =
              'idle';

            if (currentAnswer) {
              if (currentAnswer.isCorrect && currentAnswer.chosenCategory === category) {
                feedbackState = 'correct-target';
              } else if (!currentAnswer.isCorrect && currentAnswer.chosenCategory === category) {
                feedbackState = 'wrong-target';
              } else if (!currentAnswer.isCorrect && currentItem.category === category) {
                feedbackState = 'reveal-correct';
              }
            }

            return (
              <TrashBinCard
                key={category}
                ref={(el) => {
                  binRefs.current[category] = el;
                }}
                config={BIN_CONFIGS[category]}
                isHighlighted={!hasAnswered && hoveredBin === category}
                feedbackState={feedbackState}
                isWrongAlertActive={isWrongAnswer}
                disabled={hasAnswered}
                onSelectBin={submitAnswer}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
