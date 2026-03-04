import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export interface ToastProps {
  message: string;
  variant?: "success" | "error" | "info";
  isVisible: boolean;
}

export function Toast({ message, variant = "success", isVisible }: ToastProps) {
  const variants = {
    success: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: <CheckCircle2 className="text-green-600" size={20} />,
    },
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: <AlertCircle className="text-red-600" size={20} />,
    },
    info: {
      bg: "bg-slate-900 border-slate-800",
      text: "text-white",
      icon: <Info className="text-blue-400" size={20} />,
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`fixed bottom-[calc(80px+env(safe-area-inset-bottom))] left-4 right-4 z-50 flex items-center gap-3 rounded-xl border p-4 shadow-[0px_12px_32px_rgba(15,23,42,0.12)] transition-all duration-300 ease-out will-change-transform ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0 pointer-events-none"
      } ${style.bg}`}
      role="alert"
    >
      {style.icon}
      <p className={`text-sm font-medium ${style.text}`}>{message}</p>
    </div>
  );
}
