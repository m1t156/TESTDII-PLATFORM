interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
}

export function ProgressBar({ current, total, showText = true }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-center text-xs font-medium text-stone-500 mb-2">
          <span>Tiến trình</span>
          <span>{percentage}% ({current}/{total})</span>
        </div>
      )}
      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-stone-900 h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
