-- CityAtlas launch schema draft.
-- Run only after Supabase project approval.

create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  region text,
  country text not null default 'CA',
  created_at timestamptz not null default now()
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  source_type text not null,
  url text,
  verified boolean not null default false,
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references cities(id),
  slug text unique not null,
  name text not null,
  category text not null,
  neighborhood text not null,
  address text,
  website text,
  instagram text,
  booking_url text,
  short_description text,
  full_description text,
  trust_level text not null default 'unverified_draft',
  status text not null default 'draft',
  review_required boolean not null default true,
  claimed_status text not null default 'unclaimed',
  partner_fit_score integer not null default 0,
  visibility_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists business_sources (
  business_id uuid references businesses(id) on delete cascade,
  source_id uuid references sources(id) on delete cascade,
  primary key (business_id, source_id)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references cities(id),
  slug text unique not null,
  title text not null,
  category text not null,
  neighborhood text not null,
  venue text,
  event_date date,
  event_time text,
  price_label text,
  capacity integer,
  description text,
  safety_notes text,
  trust_level text not null default 'unverified_draft',
  status text not null default 'draft',
  review_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  title text not null,
  description text not null,
  redemption_instructions text,
  end_date date,
  claim_count integer not null default 0,
  max_claims integer,
  trust_level text not null default 'unverified_draft',
  status text not null default 'draft',
  review_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists guides (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references cities(id),
  slug text unique not null,
  title text not null,
  category text not null,
  neighborhood text,
  excerpt text,
  body text,
  sponsored boolean not null default false,
  trust_level text not null default 'unverified_draft',
  status text not null default 'draft',
  review_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists city_missions (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references cities(id),
  slug text unique not null,
  title text not null,
  theme text not null,
  audience text,
  time_box text,
  hook text,
  route_summary text,
  reward text,
  share_prompt text,
  sponsor_angle text,
  featured boolean not null default false,
  trust_level text not null default 'unverified_draft',
  status text not null default 'draft',
  review_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists city_mission_steps (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid references city_missions(id) on delete cascade,
  position integer not null,
  label text not null,
  item_type text not null check (item_type in ('business', 'event', 'guide')),
  item_id text not null,
  time_label text,
  neighborhood text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists business_submissions (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  category text not null,
  neighborhood text not null,
  contact_name text not null,
  email text not null,
  website text,
  message text,
  package_interest text,
  status text not null default 'review_queue',
  created_at timestamptz not null default now()
);

create table if not exists newsletter_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  interest text not null,
  referral_code text not null,
  created_at timestamptz not null default now()
);

create table if not exists saved_items (
  id uuid primary key default gen_random_uuid(),
  visitor_key text,
  item_type text not null check (item_type in ('business', 'event', 'guide')),
  item_id text not null,
  label text not null,
  created_at timestamptz not null default now()
);

create table if not exists growth_events (
  id uuid primary key default gen_random_uuid(),
  visitor_key text,
  name text not null,
  path text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists revenue_experiments (
  id uuid primary key default gen_random_uuid(),
  experiment_key text unique not null,
  name text not null,
  hypothesis text not null,
  control_copy text,
  variant_copy text,
  primary_metric text,
  guardrail_metric text,
  status text not null default 'draft',
  owner_approval_required boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists growth_plays (
  id uuid primary key default gen_random_uuid(),
  play_key text unique not null,
  title text not null,
  source_pattern text,
  why_it_matters text,
  implementation text,
  metric text,
  status text not null default 'planned',
  owner_gate text,
  updated_at timestamptz not null default now()
);

create table if not exists proof_sprints (
  id uuid primary key default gen_random_uuid(),
  sprint_key text unique not null,
  name text not null,
  wedge text not null,
  status text not null default 'owner_review',
  thesis text,
  target_buyer text,
  first_mission text,
  safe_assets jsonb not null default '[]'::jsonb,
  approval_required jsonb not null default '[]'::jsonb,
  primary_metric text,
  next_action text,
  updated_at timestamptz not null default now()
);

create table if not exists proof_candidates (
  id uuid primary key default gen_random_uuid(),
  proof_sprint_id uuid references proof_sprints(id) on delete cascade,
  candidate_key text unique not null,
  name text not null,
  segment text not null,
  role_in_mission text,
  source_url text not null,
  source_status text not null default 'official_source_saved',
  fit_score integer not null default 0,
  route_angle text,
  outreach_status text not null default 'not_started',
  approval_status text not null default 'review_only',
  contact_path_type text not null default 'needs_manual_lookup',
  contact_path text,
  contact_source_url text,
  contact_confidence text not null default 'low',
  contact_research_note text,
  last_contact_research_at date,
  risk_notes text,
  next_step text,
  updated_at timestamptz not null default now()
);

create table if not exists manual_reply_logs (
  id uuid primary key default gen_random_uuid(),
  proof_candidate_id uuid references proof_candidates(id) on delete set null,
  candidate_name text not null,
  channel text not null,
  sentiment text not null,
  message_version text,
  summary text not null,
  next_step text,
  created_at timestamptz not null default now()
);

create table if not exists brain_runs (
  id uuid primary key default gen_random_uuid(),
  stage text not null,
  summary text not null,
  top_recommendation text not null,
  top_gate text not null,
  open_gaps integer not null default 0,
  average_progress integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists launch_gates (
  id uuid primary key default gen_random_uuid(),
  gate_key text unique not null,
  title text not null,
  status text not null default 'locked',
  risk text not null,
  owner_decision text not null,
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  summary text not null,
  created_at timestamptz not null default now()
);
