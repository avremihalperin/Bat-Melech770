# קבצי SQL ל-Supabase

העתק את התוכן של כל קובץ `.sql` והרץ אותו ב-**Supabase Dashboard → SQL Editor** (לחיצה על "New query", הדבקה, Run).

## סדר הרצה — סכמה מלאה (פרויקט ארגון נוער)

להריץ לפי הסדר. כל קובץ תלוי בקודם.

| # | קובץ | תיאור |
|---|------|--------|
| 1 | `04_schema_enums.sql` | סוגים: תפקיד, סטטוס אישור/קבלה, פעילות, בטיחות, מסמך |
| 2 | `05_schema_tables_branches_profiles.sql` | branches, profiles |
| 3 | `06_schema_tables_trainees_staff_branch.sql` | trainees, staff, branch_profiles, branch_documents |
| 4 | `07_schema_tables_budget_activities_safety.sql` | תקציב, קבלות, פעילויות, נוכחות, בטיחות, בקשות שוברות שגרה |
| 5 | `08_schema_tables_content_messages.sql` | חומרי תוכן, מלאי, הודעות מתגלגלות, messages, notifications |
| 6 | `09_rls_policies.sql` | RLS + פונקציות עזר + Policies לכל הטבלאות |

## משתמש דגמה וסניפים

| קובץ | מתי להריץ |
|------|-----------|
| `10_demo_user_profile.sql` | אחרי יצירת משתמש ב-Authentication → Add user (demo@batmelech.local / 770770770). מגדיר פרופיל כמנהלת (admin) ומאושר. הוראות: `docs/DEMO_USER.md`. |
| `11_branches_seed.sql` | אופציונלי — הזנת רשימת הסניפים למערכת. להריץ **פעם אחת** אחרי 05 (טבלת branches קיימת). |

## תבניות (לשימוש כללי)

| קובץ | מתי להריץ |
|------|-----------|
| `01_rls_template.sql` | תבנית RLS — החלף `my_table_name` ו־`user_id` אחרי יצירת טבלה. |
| `02_example_table_with_rls.sql` | דוגמה מלאה (אופציונלי). |
| `03_public_read_own_write.sql` | תבנית: כולם רואים, רק בעלים עורך. החלף `my_table_name` ו־`owner_id`. |

## כללים

- **לכל טבלה חדשה** — להפעיל RLS ולהוסיף Policies.
- בלי RLS הנתונים חשופים. חובה להפעיל RLS.
