-- ============================================================
-- תבנית RLS — להריץ אחרי יצירת טבלה חדשה
-- ============================================================
-- ⚠️ אל תריצ/י את הקובץ הזה כמו שהוא!
--    הטבלה "my_table_name" היא רק placeholder — היא לא קיימת ב-DB.
--    הרצה כמו שהיא תגרום לשגיאה: relation "public.my_table_name" does not exist.
--
-- מתי להשתמש: רק כשאת/ה יוצרת טבלה חדשה (לא מהקבצים 04–09).
-- איך: העתק את הקובץ, החלף my_table_name בשם הטבלה האמיתי (למשל profiles),
--      החלף user_id בשם העמודה שמזהה משתמש (למשל id), ואז הרץ ב-SQL Editor.
--
-- ליצירת הטבלאות הראשונות של הפרויקט — הרץ לפי הסדר: 04 → 05 → 06 → 07 → 08 → 09
-- (פרטים ב־supabase/sql/README.md)
-- ============================================================

-- הפעלת RLS על הטבלה (בלי זה הטבלה לא מוגנת)
ALTER TABLE public.my_table_name ENABLE ROW LEVEL SECURITY;

-- משתמש רואה רק רשומות שבהן הוא הבעלים
CREATE POLICY "Users can read own rows"
  ON public.my_table_name
  FOR SELECT
  USING (auth.uid() = user_id);

-- משתמש יכול להוסיף רק רשומות שבהן הוא הבעלים
CREATE POLICY "Users can insert own rows"
  ON public.my_table_name
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- משתמש יכול לעדכן רק רשומות שבהן הוא הבעלים
CREATE POLICY "Users can update own rows"
  ON public.my_table_name
  FOR UPDATE
  USING (auth.uid() = user_id);

-- משתמש יכול למחוק רק רשומות שבהן הוא הבעלים
CREATE POLICY "Users can delete own rows"
  ON public.my_table_name
  FOR DELETE
  USING (auth.uid() = user_id);
