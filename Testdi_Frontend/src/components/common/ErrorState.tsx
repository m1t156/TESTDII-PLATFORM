import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Có lỗi xảy ra",
  message = "Không thể tải được dữ liệu. Vui lòng thử lại sau.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="editorial-card p-8 max-w-md mx-auto my-12 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-stone-900">{title}</h3>
      <p className="text-sm text-stone-600 leading-relaxed">{message}</p>
      {onRetry && (
        <div className="pt-2">
          <Button variant="secondary" onClick={onRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </Button>
        </div>
      )}
    </div>
  );
}
