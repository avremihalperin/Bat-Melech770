-- ============================================================
-- שלב 1.1 — Enums למסד הנתונים
-- ============================================================
-- להריץ ב-Supabase → SQL Editor (פעם אחת).
-- ============================================================

-- תפקידי משתמש במערכת
CREATE TYPE user_role AS ENUM (
  'branch_center',      -- מרכזת סניף
  'secretary',          -- מזכירה
  'branch_supervisor',  -- אחראית סניפים
  'content_manager',    -- אחראית תוכן
  'admin',              -- מנהלת
  'safety_officer'      -- אחראי בטיחות
);

-- סטטוס אישור הרשמה
CREATE TYPE approval_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

-- סטטוס קבלה (העלאת קבלה מהסניף)
CREATE TYPE receipt_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

-- סטטוס פעילות
CREATE TYPE activity_status AS ENUM (
  'scheduled',
  'completed',
  'cancelled'
);

-- סוג דיווח בטיחות
CREATE TYPE safety_report_type AS ENUM (
  'emergency',
  'near_miss'
);

-- סטטוס דיווח בטיחות
CREATE TYPE safety_report_status AS ENUM (
  'pending',
  'in_progress',
  'resolved'
);

-- סטטוס בקשה לפעילות שוברת שגרה
CREATE TYPE special_request_status AS ENUM (
  'pending',
  'safety_approved',
  'content_approved',
  'rejected'
);

-- סוג מסמך בארכיון סניף
CREATE TYPE branch_document_type AS ENUM (
  'document',
  'photo'
);
