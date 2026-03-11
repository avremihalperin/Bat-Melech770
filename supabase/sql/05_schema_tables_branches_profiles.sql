-- ============================================================
-- שלב 1.2 — טבלאות ליבה: branches, profiles
-- ============================================================
-- להריץ אחרי 04_schema_enums.sql
-- ============================================================

-- סניפים
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- פרופיל משתמש (הרחבה ל-auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  mother_name TEXT,
  id_number TEXT,
  phone TEXT,
  email TEXT,
  role user_role NOT NULL,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  approval_status approval_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_branch_id ON public.profiles(branch_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_approval_status ON public.profiles(approval_status);
