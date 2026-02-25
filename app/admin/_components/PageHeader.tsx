'use client';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  breadcrumb?: string;
}

export default function PageHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumb && (
        <p className="text-[12px] text-[#6b7280] mb-3">
          Admin {breadcrumb}
        </p>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#111827] mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[14px] text-[#4b5563]">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {secondaryActionLabel && (
            <button
              onClick={onSecondaryAction}
              className="bg-white border border-[#e5e7eb] text-[#4b5563] px-4 py-2 rounded-xl hover:border-[#9ca3af] hover:text-[#1f2937] transition-colors text-[13px]"
            >
              {secondaryActionLabel}
            </button>
          )}

          {actionLabel && (
            <button
              onClick={onAction}
              className="bg-[#d97706] text-white font-bold px-6 py-2 rounded-xl hover:bg-[#b45309] transition-colors text-[13px]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
