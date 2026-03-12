-- ============================================================
-- הוספת שדה תאריך לידה לחניכות (לצורך ימי הולדת קרובים)
-- ============================================================
-- להריץ אחרי 06_schema_tables_trainees_staff_branch.sql
-- ============================================================

ALTER TABLE public.trainees
  ADD COLUMN IF NOT EXISTS birth_date DATE;

COMMENT ON COLUMN public.trainees.birth_date IS 'תאריך לידה לצורך הצגת ימי הולדת קרובים';
