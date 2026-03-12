-- ============================================================
-- נתוני דמו — חניכות (4987), צוות (567), תקציבים, הודעות, פעילויות
-- ============================================================
-- להריץ אחרי: 10_demo_user_profile.sql, 11_branches_seed.sql, 12_add_trainee_birth_date.sql
-- דורש משתמש דמו קיים ב-auth.users וטבלת trainees עם עמודת birth_date
-- ============================================================

DO $$
DECLARE
  r RECORD;
  demo_id UUID;
  i INT;
  n_trainees INT;
  n_staff INT;
  branch_idx INT := 0;
  total_trainees INT := 0;
  total_staff INT := 0;
BEGIN
  SELECT id INTO demo_id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1;
  IF demo_id IS NULL THEN
    RAISE NOTICE 'משתמש דמו לא נמצא — הרצו קודם את 10_demo_user_profile.sql';
    RETURN;
  END IF;

  -- 4987 חניכות: 29 סניפים עם 75, 38 סניפים עם 74 (29*75 + 38*74 = 4987)
  -- 567 צוות: 31 סניפים עם 9, 36 סניפים עם 8 (31*9 + 36*8 = 567)
  FOR r IN (SELECT id, name FROM branches ORDER BY name)
  LOOP
    branch_idx := branch_idx + 1;
    n_trainees := CASE WHEN branch_idx <= 29 THEN 75 ELSE 74 END;
    n_staff := CASE WHEN branch_idx <= 31 THEN 9 ELSE 8 END;

    FOR i IN 1..n_trainees LOOP
      INSERT INTO public.trainees (branch_id, first_name, last_name, birth_date, created_at, updated_at)
      VALUES (
        r.id,
        'חניכה',
        'משפחה' || (total_trainees + i),
        CASE WHEN random() < 0.22 THEN (current_date - (random() * 365 * 11 + 365 * 9)::int)::date ELSE NULL END,
        now(), now()
      );
    END LOOP;
    total_trainees := total_trainees + n_trainees;

    FOR i IN 1..n_staff LOOP
      INSERT INTO public.staff (branch_id, first_name, last_name, created_at, updated_at)
      VALUES (r.id, 'צוות', 'משפחה' || (total_staff + i), now(), now());
    END LOOP;
    total_staff := total_staff + n_staff;

    INSERT INTO public.budget_allocations (branch_id, amount, note, allocated_by, created_at)
    VALUES (r.id, (12000 + random() * 8000)::numeric(12,2), 'הקצאה לדוגמה', demo_id, now());
    INSERT INTO public.budget_allocations (branch_id, amount, note, allocated_by, created_at)
    VALUES (r.id, (5000 + random() * 5000)::numeric(12,2), 'השלמה', demo_id, now());
  END LOOP;

  RAISE NOTICE 'נוספו % חניכות ו-% אנשי צוות', total_trainees, total_staff;
END $$;

-- קבלות (חלק מאושרות, חלק ממתינות) — לפי סניפים קיימים
INSERT INTO public.receipts (branch_id, amount, receipt_url, description, status, submitted_by, created_at, updated_at)
SELECT b.id, (500 + random() * 1500)::numeric(12,2), 'https://example.com/receipt.pdf', 'הוצאה לדוגמה', 'approved', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), now() - (random() * 30)::int * interval '1 day', now()
FROM branches b ORDER BY random() LIMIT 40;

INSERT INTO public.receipts (branch_id, amount, receipt_url, description, status, submitted_by, created_at, updated_at)
SELECT b.id, (300 + random() * 800)::numeric(12,2), 'https://example.com/receipt2.pdf', 'הוצאה ממתינה', 'pending', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), now(), now()
FROM branches b ORDER BY random() LIMIT 25;

-- פעילויות קרובות — לכל סניף לפחות פעילות אחת
INSERT INTO public.activities (branch_id, title, scheduled_at, status, created_by, created_at, updated_at)
SELECT id, 'פעילות שבועית', (date_trunc('week', now()) + interval '1 week' + (random() * 5)::int * interval '1 day'), 'scheduled', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), now(), now()
FROM branches;

INSERT INTO public.activities (branch_id, title, scheduled_at, status, created_by, created_at, updated_at)
SELECT id, 'מסיבת חודש', (now() + (random() * 14 + 7)::int * interval '1 day'), 'scheduled', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), now(), now()
FROM branches ORDER BY random() LIMIT 35;

-- הודעות מהארגון (לסרט הזז ולמסך)
INSERT INTO public.announcements (title, body, created_by, active_until, created_at) VALUES
('שבוע טוב!', 'מזכירות הארגון מאחלות שבוע פורה ומהנה לכל הסניפים.', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), now() + interval '30 days', now()),
('השתלמות מרכזות', 'ההשתלמות השנתית תתקיים בחודש הבא. פרטים בהמשך.', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), now() + interval '60 days', now()),
('חומרים חדשים בארכיון', 'הועלו חומרים חדשים לפעילויות — כנסו לארכיון התוכן.', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), NULL, now()),
('תזכורת: דיווח חודשי', 'נא להעלות דיווחים עד סוף השבוע.', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), now() + interval '7 days', now()),
('חג שמח', 'מזכירות בת מלך מאחלות חג שמח לכל החניכות והצוות.', (SELECT id FROM auth.users WHERE email = 'demo@batmelech.local' LIMIT 1), NULL, now());
