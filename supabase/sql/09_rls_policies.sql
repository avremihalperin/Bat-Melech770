-- ============================================================
-- שלב 1.8 — RLS: הפעלה + פונקציות עזר + Policies
-- ============================================================
-- להריץ אחרי כל טבלאות הסכמה (05–08).
-- פונקציות העזר משמשות את ה-Policies.
-- ============================================================

-- פונקציות עזר (מחזירות תפקיד וסניף של המשתמש המחובר)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_my_branch_id()
RETURNS UUID AS $$
  SELECT branch_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- האם משתמש מאושר (יכול להשתמש במערכת)
CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS BOOLEAN AS $$
  SELECT approval_status = 'approved' FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- רשימת תפקידי מטה (גישה חוצת סניפים)
CREATE OR REPLACE FUNCTION public.is_headquarters()
RETURNS BOOLEAN AS $$
  SELECT get_my_role() IN ('secretary', 'branch_supervisor', 'content_manager', 'admin', 'safety_officer')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ========== branches ==========
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "branches_select"
  ON public.branches FOR SELECT
  TO authenticated
  USING (is_approved_user());

CREATE POLICY "branches_insert_update_delete"
  ON public.branches FOR ALL
  TO authenticated
  USING (is_headquarters())
  WITH CHECK (is_headquarters());

-- ========== profiles ==========
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_select_pending_for_secretary"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    get_my_role() = 'secretary' AND role = 'branch_center'
    OR get_my_role() = 'admin'
  );

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_approve_secretary_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (get_my_role() IN ('secretary', 'admin'))
  WITH CHECK (true);

-- ========== trainees ==========
ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainees_branch_or_hq"
  ON public.trainees FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR is_headquarters()
    )
  )
  WITH CHECK (
    branch_id = get_my_branch_id()
    OR is_headquarters()
  );

-- ========== staff ==========
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_branch_or_hq"
  ON public.staff FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR is_headquarters()
    )
  )
  WITH CHECK (
    branch_id = get_my_branch_id()
    OR is_headquarters()
  );

-- ========== branch_profiles ==========
ALTER TABLE public.branch_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "branch_profiles_branch_or_hq"
  ON public.branch_profiles FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR is_headquarters()
    )
  )
  WITH CHECK (
    branch_id = get_my_branch_id()
    OR is_headquarters()
  );

-- ========== branch_documents ==========
ALTER TABLE public.branch_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "branch_documents_branch_or_hq"
  ON public.branch_documents FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR is_headquarters()
    )
  )
  WITH CHECK (
    branch_id = get_my_branch_id()
    OR is_headquarters()
  );

-- ========== budget_allocations ==========
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budget_allocations_select"
  ON public.budget_allocations FOR SELECT
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR get_my_role() IN ('secretary', 'admin')
    )
  );

CREATE POLICY "budget_allocations_insert"
  ON public.budget_allocations FOR INSERT
  TO authenticated
  WITH CHECK (
    is_approved_user() AND get_my_role() IN ('secretary', 'admin')
  );

-- ========== receipts ==========
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "receipts_branch_submit_hq_approve"
  ON public.receipts FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR get_my_role() IN ('secretary', 'admin')
    )
  )
  WITH CHECK (
    branch_id = get_my_branch_id()
    OR get_my_role() IN ('secretary', 'admin')
  );

-- ========== activities ==========
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activities_branch_or_hq"
  ON public.activities FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR is_headquarters()
    )
  )
  WITH CHECK (
    branch_id = get_my_branch_id()
    OR is_headquarters()
  );

-- ========== activity_attendance ==========
ALTER TABLE public.activity_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_attendance_via_activity"
  ON public.activity_attendance FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      EXISTS (
        SELECT 1 FROM public.activities a
        WHERE a.id = activity_attendance.activity_id
        AND (a.branch_id = get_my_branch_id() OR is_headquarters())
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.id = activity_attendance.activity_id
      AND (a.branch_id = get_my_branch_id() OR is_headquarters())
    )
  );

-- ========== safety_reports ==========
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "safety_reports_branch_or_safety"
  ON public.safety_reports FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR get_my_role() IN ('safety_officer', 'admin')
    )
  )
  WITH CHECK (
    branch_id = get_my_branch_id()
    OR get_my_role() IN ('safety_officer', 'admin')
  );

-- ========== special_activity_requests ==========
ALTER TABLE public.special_activity_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "special_requests_branch_or_approvers"
  ON public.special_activity_requests FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      branch_id = get_my_branch_id()
      OR get_my_role() IN ('safety_officer', 'content_manager', 'admin')
    )
  )
  WITH CHECK (
    branch_id = get_my_branch_id()
    OR get_my_role() IN ('safety_officer', 'content_manager', 'admin')
  );

-- ========== content_materials ==========
ALTER TABLE public.content_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_materials_select_approved"
  ON public.content_materials FOR SELECT
  TO authenticated
  USING (is_approved_user());

CREATE POLICY "content_materials_insert_content_admin"
  ON public.content_materials FOR INSERT
  TO authenticated
  WITH CHECK (
    is_approved_user() AND get_my_role() IN ('content_manager', 'admin')
  );

-- ========== inventory_items ==========
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_secretary_admin"
  ON public.inventory_items FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND get_my_role() IN ('secretary', 'admin')
  )
  WITH CHECK (
    get_my_role() IN ('secretary', 'admin')
  );

-- ========== announcements ==========
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcements_select_approved"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (is_approved_user());

CREATE POLICY "announcements_insert_hq"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    is_approved_user() AND is_headquarters()
  );

-- ========== messages ==========
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_own"
  ON public.messages FOR ALL
  TO authenticated
  USING (
    is_approved_user() AND (
      from_user_id = auth.uid()
      OR to_user_id = auth.uid()
      OR (to_branch_id = get_my_branch_id() AND to_branch_id IS NOT NULL)
    )
  )
  WITH CHECK (from_user_id = auth.uid());

-- ========== notifications ==========
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own"
  ON public.notifications FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
