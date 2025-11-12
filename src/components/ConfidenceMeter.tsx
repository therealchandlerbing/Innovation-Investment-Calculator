import { formatCurrency } from '../utils/calculations';

interface ConfidenceMeterProps {
  optimistic: number;
  realistic: number;
  conservative: number;
  className?: string;
}

export default function ConfidenceMeter({
  optimistic,
  realistic,
  conservative,
  className = ''
}: ConfidenceMeterProps) {
  // Calculate positions as percentages with safeguards
  const range = conservative - optimistic;
  const realisticPosition = range > 0 ? ((realistic - optimistic) / range) * 100 : 50;

  return (
    <div className={`${className}`}>
      {/* Label */}
      <div className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-3">
        Investment Range Confidence
      </div>

      {/* Visual meter */}
      <div className="relative">
        {/* Background bar */}
        <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
          {/* Gradient fill representing range */}
          <div className="absolute inset-0 bg-gradient-to-r from-optimistic-from via-realistic-from to-conservative-from opacity-60"></div>

          {/* Realistic marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ left: `${realisticPosition}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-xs font-mono text-white/90">
          <div className="flex flex-col items-start">
            <span className="text-optimistic-to font-semibold">Best Case</span>
            <span className="font-semibold">{formatCurrency(optimistic)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold">Realistic</span>
            <span className="font-bold text-sm">{formatCurrency(realistic)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-conservative-to font-semibold">Worst Case</span>
            <span className="font-semibold">{formatCurrency(conservative)}</span>
          </div>
        </div>

        {/* Confidence percentage */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1.5 bg-optimistic-from/20 border border-optimistic-from/30 rounded-lg text-xs font-semibold text-green-200">
            ±15% confidence interval
          </span>
        </div>
      </div>
    </div>
  );
}
