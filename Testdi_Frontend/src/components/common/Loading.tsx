import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message = "Đang tải dữ liệu...", fullScreen = false }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <Loader2 className="w-8 h-8 text-stone-700 animate-spin" />
      <p className="text-sm font-medium text-stone-600">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
