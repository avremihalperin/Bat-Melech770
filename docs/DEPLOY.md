# העלאה ל-GitHub ו-Vercel

## 1. חיבור ל-GitHub והעלאה ראשונה

בטרמינל (מתוך תיקיית הפרויקט `Bat-Melech`):

```powershell
# אם עדיין לא אתחלת — רק פעם אחת:
git init

# הוספת כל הקבצים (ללא node_modules ו-.env.local — כבר ב-.gitignore)
git add .

# קומיט ראשון
git commit -m "Initial commit: בת מלך - מערכת ניהול"

# חיבור לריפו בגיטהאב (החלפי ב-URL האמיתי של הפרויקט שלך!)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# דחיפה לענף main
git branch -M main
git push -u origin main
```

**חשוב:** החלפי את `YOUR_USERNAME` ו-`YOUR_REPO_NAME` בכתובת הריפו שיצרת בגיטהאב (למשל: `https://github.com/myuser/bat-melech.git`).

אם הריפו נוצר עם קובץ README — לפעמים צריך קודם:
```powershell
git pull origin main --allow-unrelated-histories
```
ואז שוב `git push -u origin main`.

---

## 2. פריסה ב-Vercel

1. היכנסי ל־[vercel.com](https://vercel.com) והתחברי (אפשר עם חשבון GitHub).
2. **Add New…** → **Project**.
3. בחרי את הריפו **Bat-Melech** (אם הוא לא מופיע — **Import Git Repository** וחברי את חשבון GitHub).
4. Vercel יזהה אוטומטית שזה Next.js — לא צריך לשנות הגדרות.
5. ב-**Environment Variables** הוסיפי את משתני הסביבה (כמו ב־`.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   
   **אל תעלי את קובץ `.env.local` עצמו** — רק העתיקי את הערכים ל-Vercel.
6. **Deploy**.

אחרי הפריסה תקבלי קישור לאתר (למשל `bat-melech.vercel.app`). כל דחיפה ל-`main` ב-GitHub תעלה אוטומטית גרסה חדשה ב-Vercel.

---

## עדכונים בהמשך

אחרי שינויי קוד:

```powershell
git add .
git commit -m "תיאור השינוי"
git push
```

Vercel יבנה ויעלה את הגרסה החדשה אוטומטית.
