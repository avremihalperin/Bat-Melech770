-- ============================================================
-- דוגמה: טבלה + RLS — לא חובה, רק להבנה
-- ============================================================
-- מריצים פעם אחת אם רוצים לראות דוגמה. אפשר למחוק אחר כך.
-- טבלה: example_items — פריטים שכל משתמש רואה רק את שלו.
-- ============================================================

-- יצירת הטבלה (דוגמה)
CREATE TABLE IF NOT EXISTS public.example_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- הפעלת RLS
ALTER TABLE public.example_items ENABLE ROW LEVEL SECURITY;

-- מדיניות: משתמש רואה רק רשומות שלו
CREATE POLICY "Users can read own example_items"
  ON public.example_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own example_items"
  ON public.example_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own example_items"
  ON public.example_items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own example_items"
  ON public.example_items
  FOR DELETE
  USING (auth.uid() = user_id);
