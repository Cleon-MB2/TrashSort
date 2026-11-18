import { useCallback, useState } from 'react';
import { BookOpen, LogOut, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { GameBoard } from './components/GameBoard';
import { SummaryScreen } from './components/SummaryScreen';
import { TimerOption, TitleScreen } from './components/TitleScreen';
import { WasteGuideModal } from './components/WasteGuideModal';
import { RoundAnswer, TOTAL_QUESTIONS, WasteItem, selectRoundItems } from './data/wasteItems';

type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [timerDuration, setTimerDuration] = useState<TimerOption>(0);
  const [roundItems, setRoundItems] = useState<WasteItem[]>(() => selectRoundItems(TOTAL_QUESTIONS));
  const [roundKey, setRoundKey] = useState(0);
  const [roundAnswers, setRoundAnswers] = useState<RoundAnswer[]>([]);
  const [bestStreak, setBestStreak] = useState(0);
  const [isWrongAlert, setIsWrongAlert] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [muted, setMuted] = useState(false);

  const startNewRound = useCallback(() => {
    setRoundItems(selectRoundItems(TOTAL_QUESTIONS));
    setRoundAnswers([]);
    setBestStreak(0);
    setIsWrongAlert(false);
    setRoundKey((prev) => prev + 1);
    setGameState('PLAYING');
  }, []);

  const handleCompleteRound = useCallback((answers: RoundAnswer[], roundBestStreak: number) => {
    setRoundAnswers(answers);
    setBestStreak(roundBestStreak);
    setIsWrongAlert(false);
    setGameState('ROUND_SUMMARY');
  }, []);

  const handleBackHome = useCallback(() => {
    setIsWrongAlert(false);
    setGameState('TITLE_MENU');
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col text-slate-900 transition-colors duration-200 ${
        isWrongAlert ? 'classroom-bg-alert' : 'classroom-bg'
      }`}
    >
      {/* Clean Single-Row Top Bar (Turns red during wrong-answer feedback) */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-sm border-b-2 transition-colors duration-200 ${
          isWrongAlert
            ? 'bg-rose-100/95 border-rose-500'
            : 'bg-white/95 border-slate-200'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-3 sm:gap-8">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={handleBackHome}
            className="min-h-[48px] px-2 font-display text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 rounded-xl"
          >
            SortSmart Recycling
          </button>

          {/* Zone 2: Clean Single-Line Controls */}
          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Game Navigation">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="min-h-[52px] px-3.5 sm:px-5 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-900 font-bold text-sm sm:text-base inline-flex items-center gap-2 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900"
            >
              <BookOpen className="w-5 h-5 text-slate-800 shrink-0" aria-hidden="true" />
              <span className="hidden md:inline">3-Bin Guide</span>
              <span className="md:hidden">Guide</span>
            </button>

            <button
              type="button"
              onClick={() => setMuted((prev) => !prev)}
              aria-label={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className="min-w-[52px] min-h-[52px] px-3 sm:px-4 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-900 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900"
            >
              {muted ? (
                <VolumeX className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{muted ? 'Sound Off' : 'Sound On'}</span>
            </button>
          </nav>

          {/* Zone 3: Session Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {gameState === 'PLAYING' ? (
              <>
                <button
                  type="button"
                  onClick={handleBackHome}
                  aria-label="Quit to Starting Page"
                  className="min-h-[52px] px-4 sm:px-5 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-display font-bold text-sm sm:text-base inline-flex items-center gap-2 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900"
                >
                  <LogOut className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
                  <span>Quit</span>
                </button>
                <button
                  type="button"
                  onClick={startNewRound}
                  className="min-h-[52px] px-4 sm:px-6 rounded-xl bg-slate-900 text-white font-display font-bold text-sm sm:text-base inline-flex items-center gap-2 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600"
                >
                  <RotateCcw className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Restart</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={startNewRound}
                className="min-h-[52px] px-5 sm:px-6 rounded-xl bg-emerald-700 text-white font-display font-bold text-sm sm:text-base inline-flex items-center gap-2 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900"
              >
                <span>Start Game</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <div className="flex-1">
        {gameState === 'TITLE_MENU' && (
          <TitleScreen
            timerDuration={timerDuration}
            onChangeTimer={setTimerDuration}
            onStartGame={startNewRound}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {gameState === 'PLAYING' && (
          <GameBoard
            key={roundKey}
            items={roundItems}
            timerDuration={timerDuration}
            muted={muted}
            isModalOpen={isGuideOpen}
            onAlertStateChange={setIsWrongAlert}
            onCompleteRound={handleCompleteRound}
          />
        )}

        {gameState === 'ROUND_SUMMARY' && (
          <SummaryScreen
            answers={roundAnswers}
            bestStreak={bestStreak}
            onPlayAgain={startNewRound}
            onBackHome={handleBackHome}
          />
        )}
      </div>

      {/* Classroom 3-Bin Sorting Guide Modal */}
      <WasteGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
