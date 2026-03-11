# מסמך תקנים ועקביות — בת מלך

מסמך זה הוא מקור האמת לכל ההגדרות, החוקים והעקביות בפרויקט. יש להסתמך עליו בכל שינוי קוד או עיצוב.

---

## 1. סגנון תקשורת עם המשתמש

- **רמת ידע:** למשתמש אין רקע בתכנות. חובה להסביר בפשטות, צעד־אחר־צעד.
- **הוראות:** בכל קוד או פקודת Terminal — לציין במפורש: באיזה קובץ, באיזו תיקייה, או איפה להריץ את הפקודה. לא לדלג על שלבים. לא להשתמש במונחים טכניים ללא הסבר קצר.

---

## 2. Stack וארכיטקטורה

| רכיב | טכנולוגיה |
|------|-----------|
| Framework | Next.js (App Router) |
| עיצוב | Tailwind CSS + Shadcn UI |
| DB + Auth | Supabase (PostgreSQL) |
| פריסה | Vercel (Serverless) |

- **מבנה תיקיות:**
  - `components/` — רכיבי UI (כולל `components/ui/` ל־Shadcn).
  - `actions/` — Server Actions (פעולות שרת).
  - `lib/` — פונקציות עזר, כלים, חיבורים ל־DB.
- **קבצים:** קטנים וממוקדים. הפרדה בין לוגיקה לעיצוב.
- **Serverless:** אסור חבילות שדורשות שרת רציף או בינאריות כבדות (למשל PDF — רק גרסאות מותאמות ל־Serverless אם נדרש).

---

## 3. עיצוב, UI/UX וצבעים

- **סגנון:** מודרני, נקי, מרווח (Whitespace), Mobile-first ואז Desktop.
- **פלטת צבעים (צבעי הארגון):**
  - **צבע ראשי (Primary):** טורקיז־כחול עמוק (Teal) — תפריטים, אלמנטים מרכזיים, טקסט בולט. מקצועי.
  - **הדגשה (Accent):** גרדיאנט חם — צהוב → כתום → ורוד. לשימוש בכפתורי CTA, אייקונים, התראות (במינון נכון).
  - **רקע וטקסט:** רקע לבן ואפורים בהירים. טקסט כהה לקריאות.
- **משתנים:** הצבעים מוגדרים ב־`app/globals.css` (`:root`) וב־`tailwind.config.ts` (כולל `primary`, `accent`, `accent-gradient`).

---

## 4. שפה וכיווניות (RTL — עברית)

- **מטרה:** קהל ישראלי. חובה: `<html lang="he" dir="rtl">` ב־`app/layout.tsx`.
- **Tailwind — מאפיינים לוגיים (חובה):**
  - מרווחים: `ms-` / `me-` (במקום `ml` / `mr`).
  - padding: `ps-` / `pe-` (במקום `pl` / `pr`).
  - יישור: `start` / `end` (לא left/right).
- **פונטים:** Assistant או Rubik; מרווחים מותאמים לקריאה בעברית.

---

## 5. אבטחה וניהול נתונים

- **Supabase:** לכל טבלה — RLS (Row Level Security). לכתוב סקריפט SQL מדויק ולהזכיר להריץ אותו.
- **Server Actions:** העדפה לפעולות מול DB דרך Server Actions. חובה בדיקת אותנטיקציה לפני כל פעולה.
- **סודות:** רק ב־`.env.local`. מפתחות רגישים (Service Role וכו') רק בשרת. ללקליינט — רק משתנים עם `NEXT_PUBLIC_`.
- **API Routes:** רק ל־Webhooks (למשל דואר כמו Resend), Cron (Vercel), או Callbacks חיצוניים.

---

## 6. תקני קוד

- **TypeScript:** Types / Interfaces ברורים לכל מבנה נתונים. איסור על `any`.
- **DRY:** קוד מודולרי; לוגיקה חוזרת — בפונקציות או רכיבים ייעודיים.

---

## 7. קבצים מרכזיים

| תפקיד | קובץ |
|--------|------|
| צבעים + משתני עיצוב | `app/globals.css` |
| תמה Tailwind, גרדיאנט | `tailwind.config.ts` |
| RTL, פונט, מטא | `app/layout.tsx` |
| הגדרות Shadcn | `components.json` |
| פונקציית עזר ל־class names | `lib/utils.ts` |
| Supabase — לקוח דפדפן | `lib/supabase/client.ts` |
| Supabase — לקוח שרת (Actions, RSC) | `lib/supabase/server.ts` |
| Supabase — רענון סשן (middleware) | `lib/supabase/middleware.ts` + `middleware.ts` |
| דוגמת משתני סביבה | `.env.local.example` |

---

## 8. Supabase — שימוש בפרויקט

- **משתני סביבה (חובה):** ב־`.env.local` (לא נשמר ב-Git). העתק מ־`.env.local.example` ומלא ערכים מ-Supabase Dashboard → Settings → API:
  - `NEXT_PUBLIC_SUPABASE_URL` — כתובת הפרויקט.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — מפתח anon (בטוח לחשוף בדפדפן).
  - `SUPABASE_SERVICE_ROLE_KEY` — רק לפעולות רגישות בשרת; לא לחשוף ללקליינט.
- **ברכיבי Client:** `import { createClient } from "@/lib/supabase/client"` ואז `createClient()`.
- **ב-Server Actions / Server Components:** `import { createClient } from "@/lib/supabase/server"` ואז `await createClient()`.
- **RLS:** לכל טבלה חדשה — לכתוב ולהריץ סקריפט RLS. ראה `docs/SUPABASE.md`.

---

---

**הערה:** תוכן המסמך נטען גם אל חוק Cursor (`.cursor/rules/project-standards.mdc`) — כך שהמערכת פועלת לפי התקנים בכל יצירה או שינוי. כשמעדכנים את `STANDARDS.md`, עדכן גם את הקובץ `.cursor/rules/project-standards.mdc` כדי לשמור על סנכרון.
