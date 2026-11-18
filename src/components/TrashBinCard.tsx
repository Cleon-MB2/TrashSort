import { forwardRef } from 'react';
import { AlertTriangle, CheckCircle2, Leaf, Recycle, XCircle } from 'lucide-react';
import { BinConfig, WasteCategory } from '../data/wasteItems';

interface TrashBinCardProps {
  config: BinConfig;
  isHighlighted: boolean;
  feedbackState: 'idle' | 'correct-target' | 'wrong-target' | 'reveal-correct';
  isWrongAlertActive?: boolean;
  disabled: boolean;
  onSelectBin: (category: WasteCategory) => void;
}

function BinEmblem({ category, className = '' }: { category: WasteCategory; className?: string }) {
  if (category === 'organic') {
    return <Leaf className={`text-emerald-800 ${className}`} aria-hidden="true" />;
  }
  if (category === 'inorganic') {
    return <Recycle className={`text-sky-800 ${className}`} aria-hidden="true" />;
  }
  return <AlertTriangle className={`text-rose-800 ${className}`} aria-hidden="true" />;
}

export const TrashBinCard = forwardRef<HTMLButtonElement, TrashBinCardProps>(
  function TrashBinCard(
    { config, isHighlighted, feedbackState, isWrongAlertActive = false, disabled, onSelectBin },
    ref
  ) {
    const lidOpen =
      isHighlighted || feedbackState === 'correct-target' || feedbackState === 'reveal-correct';

    let stateBorder = config.borderClass;
    let stateBg = config.surfaceBgClass;
    let scaleClass = 'scale-100';
    let shakeClass = '';
    let headingClass = config.headingTextClass;
    let bodyClass = config.bodyTextClass;

    if (feedbackState === 'correct-target') {
      stateBorder = 'border-emerald-600 ring-4 ring-emerald-400 shadow-lg';
      stateBg = 'bg-emerald-100';
      scaleClass = 'scale-[1.03]';
    } else if (feedbackState === 'reveal-correct') {
      stateBorder = 'border-emerald-600 ring-4 ring-emerald-300';
      stateBg = 'bg-emerald-50';
      scaleClass = 'scale-[1.01]';
    } else if (feedbackState === 'wrong-target') {
      stateBorder = 'border-rose-700 ring-4 ring-rose-500 shadow-lg';
      stateBg = 'bg-rose-200';
      shakeClass = 'animate-bin-vibrate';
      headingClass = 'text-rose-950';
      bodyClass = 'text-rose-900';
    } else if (isWrongAlertActive) {
      stateBorder = 'border-rose-400';
      stateBg = 'bg-rose-100/80';
      headingClass = 'text-rose-950';
      bodyClass = 'text-rose-900';
    } else if (isHighlighted) {
      stateBorder = config.activeBorderClass;
      stateBg = config.activeBgClass;
      scaleClass = 'scale-[1.03]';
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={() => onSelectBin(config.id)}
        aria-label={`Sort into ${config.label}: ${config.shortSubtitle}`}
        className={`group relative flex flex-col items-center justify-between w-full min-h-[210px] sm:min-h-[240px] p-5 rounded-2xl border-2 transition-transform duration-150 ease-out text-center select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 ${stateBorder} ${stateBg} ${scaleClass} ${shakeClass} ${
          disabled ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
        }`}
      >
        {/* Status Indicator Banner during Feedback */}
        {feedbackState !== 'idle' && (
          <div className="w-full flex items-center justify-center gap-1.5 mb-2 text-sm sm:text-base font-extrabold">
            {(feedbackState === 'correct-target' || feedbackState === 'reveal-correct') && (
              <span className="inline-flex items-center gap-1.5 text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>{feedbackState === 'correct-target' ? 'Great Job!' : 'Correct Bin'}</span>
              </span>
            )}
            {feedbackState === 'wrong-target' && (
              <span className="inline-flex items-center gap-1.5 text-rose-950">
                <XCircle className="w-5 h-5 text-rose-700 shrink-0" aria-hidden="true" />
                <span>Wrong Bin!</span>
              </span>
            )}
          </div>
        )}

        {/* Illustrated Interactive Trash Can SVG */}
        <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 my-1">
          <svg
            viewBox="0 0 120 128"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            {/* Hinged Lid */}
            <g
              style={{
                transformOrigin: '18px 34px',
                transform: lidOpen ? 'rotate(-26deg) translateY(-6px)' : 'rotate(0deg)',
                transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <rect
                x="46"
                y="14"
                width="28"
                height="9"
                rx="4"
                fill={feedbackState === 'wrong-target' ? '#B91C1C' : config.canLidFill}
              />
              <rect
                x="16"
                y="22"
                width="88"
                height="13"
                rx="6"
                fill={feedbackState === 'wrong-target' ? '#B91C1C' : config.canLidFill}
              />
            </g>

            {/* Bin Body */}
            <path
              d="M24 38 H96 L88 114 C87.4 119 83.2 122 78.2 122 H41.8 C36.8 122 32.6 119 32 114 L24 38 Z"
              fill={feedbackState === 'wrong-target' ? '#DC2626' : config.canBodyFill}
            />
            <rect
              x="24"
              y="38"
              width="72"
              height="6"
              fill={feedbackState === 'wrong-target' ? '#991B1B' : config.canLidFill}
              opacity="0.28"
            />

            {/* Vertical Bin Ribs */}
            <line
              x1="43"
              y1="54"
              x2="46"
              y2="108"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.32"
            />
            <line
              x1="77"
              y1="54"
              x2="74"
              y2="108"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.32"
            />

            {/* Center Badge Plate */}
            <circle cx="60" cy="80" r="19" fill={config.canAccentFill} />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center pt-5 pointer-events-none">
            <BinEmblem category={config.id} className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* High-Contrast Label & Subtitle */}
        <div className="mt-2 space-y-1">
          <div className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${headingClass}`}>
            {config.label}
          </div>
          <div className={`text-sm sm:text-base font-semibold ${bodyClass}`}>
            {config.shortSubtitle}
          </div>
        </div>

        {/* Explicit Tap-Target Prompt (Hover-Free) */}
        {!disabled && (
          <div
            className={`mt-3 w-full min-h-[48px] flex items-center justify-center px-4 py-2 rounded-xl font-bold text-sm sm:text-base shadow-sm ${config.buttonBgClass}`}
          >
            {isHighlighted ? 'Drop Here!' : 'Tap or Drop Here'}
          </div>
        )}
      </button>
    );
  }
);
