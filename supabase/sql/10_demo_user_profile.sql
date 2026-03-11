-- ============================================================
-- משתמש דגמה (Demo) — הרשאות ופרופיל
-- ============================================================
-- אימייל: demo@batmelech.local
-- סיסמה: 770770770
--
-- הרשאות: תפקיד מנהלת (admin) — גישה לכל המסכים במערכת:
--   דשבורד מנהלת, אישורים, בקרת נתונים, ניהול כספים, משתמשים וסניפים,
--   הוספת סניף, מלאי, הודעות, מעקב ופיקוח, חומרים, ארכיון, בטיחות, תיק רפואי.
-- בנוסף: גישה למסך הדגמה (/demo) — ניווט לכל המסכים.
--
-- להריץ אחרי שיצרת את המשתמש ב-Supabase:
--   Authentication → Users → Add user → Create new user
--   Email: demo@batmelech.local
--   Password: 770770770
-- ============================================================

INSERT INTO public.profiles (
  id,
  full_name,
  family_name,
  email,
  role,
  approval_status,
  approved_at
)
SELECT
  id,
  'משתמש דגמה',
  'בת מלך',
  email,
  'admin'::user_role,
  'approved'::approval_status,
  now()
FROM auth.users
WHERE email = 'demo@batmelech.local'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  family_name = EXCLUDED.family_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  approval_status = EXCLUDED.approval_status,
  approved_at = EXCLUDED.approved_at,
  updated_at = now();
