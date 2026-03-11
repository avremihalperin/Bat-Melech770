-- ============================================================
-- תבנית: טבלה שכל המחוברים רואים (SELECT), אבל רק הבעלים כותבים
-- ============================================================
-- מתאים למשל: טבלת אירועים שכל החברים רואים, אבל רק יוצר האירוע עורך.
-- החלף my_table_name ו־owner_id (שם העמודה של הבעלים) בהתאם.
-- ============================================================

ALTER TABLE public.my_table_name ENABLE ROW LEVEL SECURITY;

-- כל המחוברים (authenticated) יכולים לקרוא
CREATE POLICY "Authenticated users can read"
  ON public.my_table_name
  FOR SELECT
  TO authenticated
  USING (true);

-- רק הבעלים יכול להוסיף (עמודה owner_id = המזהה של המשתמש)
CREATE POLICY "Users can insert as owner"
  ON public.my_table_name
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- רק הבעלים יכול לעדכן
CREATE POLICY "Users can update own rows"
  ON public.my_table_name
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- רק הבעלים יכול למחוק
CREATE POLICY "Users can delete own rows"
  ON public.my_table_name
  FOR DELETE
  USING (auth.uid() = owner_id);
