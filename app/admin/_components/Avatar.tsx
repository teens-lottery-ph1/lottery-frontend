'use client';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-[13px]',
  lg: 'w-14 h-14 text-[18px]',
};

const defaultColors: Record<string, string> = {
  R: '#1e40af',
  P: '#7c3aed',
  A: '#d97706',
  S: '#16a34a',
  K: '#ca8a04',
  D: '#0891b2',
  N: '#dc2626',
  V: '#d97706',
  M: '#1e40af',
  I: '#7c3aed',
  E: '#16a34a',
  U: '#d97706',
  T: '#0891b2',
  G: '#7c3aed',
  L: '#d97706',
  J: '#dc2626',
  Y: '#1e40af',
  Z: '#16a34a',
  H: '#d97706',
  W: '#7c3aed',
};

export default function Avatar({
  name,
  size = 'md',
  color,
}: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const bgColor = color || defaultColors[initial] || '#3d9eff';

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white`}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {initial}
    </div>
  );
}
