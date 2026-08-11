import { AlertCircle } from "lucide-react";

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400 mb-6">
      <AlertCircle size={16} className="shrink-0" />
      {message}
    </div>
  );
}
