-- Probador IA: tabla de leads con tracking de usos y consentimientos RGPD
create table public.probador_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  modelo_inicial text not null check (modelo_inicial in ('capri','peachy','daisy')),
  uses_count int not null default 0,
  max_uses int not null default 3,
  age_confirmed boolean not null,
  service_consent boolean not null,
  service_consent_version text not null default 'v1-2026-06',
  service_consent_at timestamptz not null default now(),
  newsletter_consent boolean not null default false,
  newsletter_consent_at timestamptz,
  marketing_image_consent boolean not null default false,
  marketing_image_consent_at timestamptz,
  brevo_synced boolean not null default false,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  constraint chk_service_consent_required check (service_consent = true),
  constraint chk_age_confirmed_required check (age_confirmed = true)
);

create index idx_probador_leads_email on public.probador_leads(email);
create index idx_probador_leads_created_at on public.probador_leads(created_at desc);

alter table public.probador_leads enable row level security;

-- Solo service_role accede. Las Edge Functions usan service_role internamente.
create policy "service_role full access" on public.probador_leads
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
