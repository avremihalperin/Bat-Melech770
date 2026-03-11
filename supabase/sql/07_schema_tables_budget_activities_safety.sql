-- ============================================================
-- שלב 1.4–1.6 — תקציב, פעילויות, בטיחות
-- ============================================================
-- להריץ אחרי 06_schema_tables_trainees_staff_branch.sql
-- ============================================================

-- הקצאות תקציב מהמטה לסניף
CREATE TABLE public.budget_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  note TEXT,
  allocated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_budget_allocations_branch_id ON public.budget_allocations(branch_id);

-- קבלות מהסניף לאישור המטה
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  receipt_url TEXT NOT NULL,
  description TEXT,
  status receipt_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_receipts_branch_id ON public.receipts(branch_id);
CREATE INDEX idx_receipts_status ON public.receipts(status);

-- פעילויות
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status activity_status NOT NULL DEFAULT 'scheduled',
  checklist_start_completed_at TIMESTAMPTZ,
  checklist_end_completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activities_branch_id ON public.activities(branch_id);
CREATE INDEX idx_activities_scheduled_at ON public.activities(scheduled_at);

-- נוכחות בפעילות
CREATE TABLE public.activity_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  attended BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  UNIQUE(activity_id, trainee_id)
);

CREATE INDEX idx_activity_attendance_activity_id ON public.activity_attendance(activity_id);

-- דיווחי בטיחות (חירום / כמעט ונפגע)
CREATE TABLE public.safety_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  report_type safety_report_type NOT NULL,
  description TEXT NOT NULL,
  status safety_report_status NOT NULL DEFAULT 'pending',
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_safety_reports_branch_id ON public.safety_reports(branch_id);
CREATE INDEX idx_safety_reports_status ON public.safety_reports(status);

-- בקשות לפעילות שוברת שגרה
CREATE TABLE public.special_activity_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status special_request_status NOT NULL DEFAULT 'pending',
  safety_approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content_approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_special_activity_requests_branch_id ON public.special_activity_requests(branch_id);
CREATE INDEX idx_special_activity_requests_status ON public.special_activity_requests(status);
