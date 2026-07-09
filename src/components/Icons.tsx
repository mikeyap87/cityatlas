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

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.7v4.7l3.2 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

export function UsersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8.2" r="2.3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="15.6" cy="7.4" r="1.9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.8 18.6c0-2.7 2.2-4.9 4.9-4.9h1.7c2.7 0 4.9 2.2 4.9 4.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.1 14.1h1c2.1 0 3.9 1.7 3.9 3.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function WalkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="13" cy="5.2" r="2" fill="currentColor" />
      <path d="m10.2 21 1.7-5.8 2.6-2.2 1.6 2.8V21M10.7 10.6l2.7-2 3.1 1.6m-6.3 1.1 2.4 1.4-1.4 2.9H8.4m4.2-3.2 1.1-3.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function TransitIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="6" y="3.8" width="12" height="13.2" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.8 7.7h6.4M8.8 10.9h6.4M9.4 17l-1.8 3M14.6 17l1.8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.3" cy="14.2" r="0.9" fill="currentColor" />
      <circle cx="14.7" cy="14.2" r="0.9" fill="currentColor" />
    </IconBase>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6.3 15.8h11.4l-1.1-5.2a2.2 2.2 0 0 0-2.2-1.8H9.6a2.2 2.2 0 0 0-2.2 1.8l-1.1 5.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5.8 15.8V18a1.7 1.7 0 0 0 1.7 1.7h.8V18m7.4 1.7h.8a1.7 1.7 0 0 0 1.7-1.7v-2.2M8.5 12h1.5m5 0h1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.4" cy="15.8" r="1.1" fill="currentColor" />
      <circle cx="15.6" cy="15.8" r="1.1" fill="currentColor" />
    </IconBase>
  );
}

export function BikeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="7.1" cy="16.2" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.9" cy="16.2" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9.8 8.6 2.2 4.5h3.5M10.7 8.6H8.4m3.6 0h2.2l-1.3 2.2m-2.4 2.3-1.4 3.1m3-3.1 2 3.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

export function ChevronUpIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 14 6-6 6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 10 6 6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 6H6.8A1.8 1.8 0 0 0 5 7.8v9.4A1.8 1.8 0 0 0 6.8 19h9.4a1.8 1.8 0 0 0 1.8-1.8V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 5h6v6M11 13l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </IconBase>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="8" y="6" width="10" height="12" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6.5 15.5H6A2 2 0 0 1 4 13.5V5.8A1.8 1.8 0 0 1 5.8 4H13.5A2 2 0 0 1 15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="17.2" cy="6.2" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="17.8" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9.1 11 5.7-3.2M9.1 13 14.8 16.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
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

export function RefreshIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 8.5V4.8h-3.7M5 15.5v3.7h3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.4 10.1a6.4 6.4 0 0 0-11.2-2M6.6 13.9a6.4 6.4 0 0 0 11.2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
