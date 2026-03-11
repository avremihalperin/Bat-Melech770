-- ============================================================
-- שלב 1.3 — טבלאות: trainees, staff, branch_profiles, branch_documents
-- ============================================================
-- להריץ אחרי 05_schema_tables_branches_profiles.sql
-- ============================================================

-- חניכות
CREATE TABLE public.trainees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mother_name TEXT,
  id_number TEXT,
  phone TEXT,
  address TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  email TEXT,
  allergies TEXT,
  sensitivities TEXT,
  emergency_instructions TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trainees_branch_id ON public.trainees(branch_id);

-- אנשי צוות בסניף (לא בהכרח משתמשי מערכת)
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_branch_id ON public.staff(branch_id);

-- פרופיל סניף (שעות, סיכום)
CREATE TABLE public.branch_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL UNIQUE REFERENCES public.branches(id) ON DELETE CASCADE,
  opening_hours TEXT,
  summary_notes TEXT,
  trainees_count_cached INT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_branch_profiles_branch_id ON public.branch_profiles(branch_id);

-- ארכיון סניף / תמונות
CREATE TABLE public.branch_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  name TEXT NOT NULL,
  document_type branch_document_type NOT NULL,
  category TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_branch_documents_branch_id ON public.branch_documents(branch_id);
