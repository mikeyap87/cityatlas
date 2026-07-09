import type { ReactNode } from "react";
import { CheckIcon, LockIcon } from "./Icons";

interface SectionHeaderProps {
  label?: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}

export function SectionHeader({ label, title, copy, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {label ? <p className="section-label">{label}</p> : null}
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}

interface StatusPillProps {
  tone?: "green" | "amber" | "blue" | "ink" | "muted";
  children: ReactNode;
}

interface HeroMediaCardProps {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  copy: string;
  className?: string;
  priority?: boolean;
}

export function HeroMediaCard({
  image,
  alt,
  eyebrow,
  title,
  copy,
  className,
  priority = true,
}: HeroMediaCardProps) {
  const cardClassName = className ? `starter-hero-media ${className}` : "starter-hero-media";

  return (
    <div className={cardClassName}>
      <img
        src={image}
        alt={alt}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
      />
      <div className="starter-hero-media-copy">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
    </div>
  );
}

export function StatusPill({ tone = "muted", children }: StatusPillProps) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div className="progress-wrap" aria-label={label}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

export function SafeModeNotice() {
  return (
    <aside className="safe-mode-notice">
      <LockIcon />
      <div>
        <strong>Every business page starts with a fact check.</strong>
        <p>
          CityAtlas checks the basics before it turns a business into a public page, guide
          mention, or offer.
        </p>
      </div>
    </aside>
  );
}

export function ChecklistItem({ complete, label }: { complete: boolean; label: string }) {
  return (
    <li className={complete ? "check-item complete" : "check-item review"}>
      {complete ? <CheckIcon /> : <LockIcon />}
      <span>{label}</span>
    </li>
  );
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{copy}</p>
    </div>
  );
}
