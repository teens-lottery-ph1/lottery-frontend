'use client';

interface BadgeProps {
  label: string;
  variant: 'green' | 'red' | 'gold' | 'blue' | 'purple' | 'gray';
}

const badgeStyles = {
  green: {
    bg: 'bg-[#dcfce7]',
    text: 'text-[#16a34a]',
    border: 'border-[#86efac]',
  },
  red: {
    bg: 'bg-[#fee2e2]',
    text: 'text-[#dc2626]',
    border: 'border-[#fca5a5]',
  },
  gold: {
    bg: 'bg-[#fef3c7]',
    text: 'text-[#d97706]',
    border: 'border-[#fde68a]',
  },
  blue: {
    bg: 'bg-[#dbeafe]',
    text: 'text-[#1e40af]',
    border: 'border-[#bfdbfe]',
  },
  purple: {
    bg: 'bg-[#f3e8ff]',
    text: 'text-[#7c3aed]',
    border: 'border-[#e9d5ff]',
  },
  gray: {
    bg: 'bg-[#f3f4f6]',
    text: 'text-[#4b5563]',
    border: 'border-[#d1d5db]',
  },
};

export default function Badge({ label, variant }: BadgeProps) {
  const style = badgeStyles[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      {label}
    </span>
  );
}
