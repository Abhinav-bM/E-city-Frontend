import { ReactNode } from "react";

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
        {icon}
      </div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mb-6 max-w-[280px] text-sm text-slate-500">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
