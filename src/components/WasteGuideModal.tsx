import { AlertTriangle, Leaf, Recycle, X } from 'lucide-react';
import { BIN_CONFIGS, BIN_ORDER, WasteCategory } from '../data/wasteItems';

interface WasteGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function GuideIcon({ category }: { category: WasteCategory }) {
  if (category === 'organic') return <Leaf className="w-7 h-7 text-emerald-700 shrink-0" aria-hidden="true" />;
  if (category === 'inorganic') return <Recycle className="w-7 h-7 text-sky-700 shrink-0" aria-hidden="true" />;
  return <AlertTriangle className="w-7 h-7 text-rose-700 shrink-0" aria-hidden="true" />;
}

export function WasteGuideModal({ isOpen, onClose }: WasteGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div className="w-full max-w-4xl bg-white border-2 border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 my-auto">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h2
              id="guide-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900"
            >
              How to Sort the 3 Trash Bins
            </h2>
            <p className="mt-1 text-base sm:text-lg text-slate-700">
              Sorting waste correctly keeps toxic chemicals out of soil and lets valuable materials be recycled.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sorting Guide"
            className="min-w-[56px] min-h-[56px] flex items-center justify-center rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-900 font-bold active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 shrink-0 cursor-pointer"
          >
            <X className="w-7 h-7" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {BIN_ORDER.map((category) => {
            const bin = BIN_CONFIGS[category];
            return (
              <div
                key={bin.id}
                className={`flex flex-col justify-between p-5 rounded-2xl border-2 ${bin.surfaceBgClass} ${bin.borderClass}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <GuideIcon category={bin.id} />
                    <h3 className={`font-display text-xl font-bold ${bin.headingTextClass}`}>
                      {bin.label}
                    </h3>
                  </div>
                  <p className={`text-base leading-relaxed font-medium ${bin.bodyTextClass}`}>
                    {bin.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-900/10">
                  <div className={`text-sm font-bold mb-1.5 ${bin.headingTextClass}`}>
                    Common Examples
                  </div>
                  <div className={`text-sm sm:text-base font-medium leading-relaxed ${bin.bodyTextClass}`}>
                    {bin.examples.join(' · ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[56px] px-8 py-3 rounded-xl bg-slate-900 text-white font-display text-lg font-bold active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600 cursor-pointer"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
