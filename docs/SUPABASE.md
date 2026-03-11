# Supabase — הנחיות בפרויקט בת מלך

## קבצי SQL מוכנים להרצה

**כל סקריפטי ה-SQL נמצאים בתיקייה:** `supabase/sql/`

- **README.md** — הסבר על כל קובץ ובאיזה סדר להריץ.
- **01_rls_template.sql** — תבנית RLS: אחרי יצירת טבלה, העתק את הקובץ, החלף `my_table_name` ו־`user_id` בשמות האמיתיים, והרץ ב-Supabase → SQL Editor.
- **02_example_table_with_rls.sql** — דוגמה מלאה (טבלה + RLS) — אופציונלי, להבנה.
- **03_public_read_own_write.sql** — תבנית לטבלה שכל המחוברים רואים, ורק הבעלים עורך. החלף `my_table_name` ו־`owner_id`.

**איך להריץ:** Supabase Dashboard → SQL Editor → New query → הדבק את התוכן → Run.

## RLS (Row Level Security)

**חובה:** לכל טבלה שאנחנו יוצרים — להפעיל RLS ולכתוב Policies. בלי זה הנתונים חשופים.

- **ENABLE ROW LEVEL SECURITY** — מפעיל הגנה; בלי מדיניות, אף אחד לא יראה שורות.
- **CREATE POLICY** — מגדיר מי יכול SELECT/INSERT/UPDATE/DELETE ובאילו תנאים.
- **auth.uid()** — מזהה המשתמש המחובר (מ-Supabase Auth).

## משתני סביבה

- העתק `.env.local.example` ל־`.env.local`.
- מלא מ-Supabase: Project Settings → API → Project URL ו-Anon key.
- מפתח Service Role — רק אם צריך פעולות שמתעלמות מ-RLS (בשרת בלבד).

## קבצי הלקוח

| קובץ | שימוש |
|------|--------|
| `lib/supabase/client.ts` | רכיבי Client (דפדפן) |
| `lib/supabase/server.ts` | Server Components, Server Actions, Route Handlers |
| `lib/supabase/middleware.ts` | נקרא מ־`middleware.ts` — מרענן סשן Auth |
