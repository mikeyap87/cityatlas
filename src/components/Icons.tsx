import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m21 21-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10.8" cy="10.8" r="6.6" stroke="currentColor" strokeWidth="2" />
    </IconBase>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 18 3.8 20.3V6.4L9 4l6 2.3 5.2-2.2V18L15 20.3 9 18Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 4v14M15 6.3v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}

export function CityAtlasMarkIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M32 4.5c-13 0-23.6 10.1-23.6 22.5 0 15.8 19 29.2 22.5 31.5a2 2 0 0 0 2.2 0C36.6 56.2 55.6 42.8 55.6 27 55.6 14.6 45 4.5 32 4.5Z"
        fill="#0B1726"
      />
      <path
        d="M32 9.5c-10.1 0-18.4 7.8-18.4 17.4 0 11.2 12.6 22.1 18.4 26.3 5.8-4.2 18.4-15.1 18.4-26.3 0-9.6-8.3-17.4-18.4-17.4Z"
        fill="#F3B53C"
      />
      <path
        d="M18.8 26.4 28 21.9l9.2 4.1 8-3.9v19.1l-8 3.9-9.2-4.1-9.2 4.5V26.4Z"
        fill="#FFFFFF"
        stroke="#0B1726"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
      <path
        d="M28 21.9v19.1M37.2 26v19.1"
        stroke="#0B1726"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
      <path
        d="M22.8 34.2c3.7-3.8 7.2 4.5 11.2.7 3.8-3.7 6.7 2 8.4-.3"
        stroke="#0E8B5A"
        strokeLinecap="round"
        strokeWidth="2.8"
      />
      <circle cx="32" cy="31.2" r="3.4" fill="#0B1726" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-3.5 7-10.2V5l-7-2.5L5 5v5.8C5 17.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m8.9 11.8 2 2 4.2-4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}

export function StoreIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 10h14l-1.2-5.5H6.2L5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6.5 10v9h11v-9M9.5 19v-5h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </IconBase>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 2.8 14.3 9l6.2 2.3-6.2 2.3L12 19.8l-2.3-6.2-6.2-2.3L9.7 9 12 2.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </IconBase>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5.2 12.4 4.1 4.1 9.5-9.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10V7.8a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}
