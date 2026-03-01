# 🚀 Lens Care — Deployment Guide
## Render (Backend) + PostgreSQL (Database)
### Completely free — takes about 10 minutes

---

## WHAT YOU NEED FIRST
- GitHub account (free) → https://github.com
- Render account (free) → https://render.com
  (sign up with your GitHub account — easiest)

---

## STEP 1 — Prepare your project files

Make sure your project folder contains ALL of these files:
```
lenscare/
├── app.py                  ← the updated one (with PostgreSQL)
├── requirements.txt        ← ✅ provided
├── Procfile                ← ✅ provided
├── render.yaml             ← ✅ provided
├── static/
│   ├── css/
│   └── images/
└── templates/
    ├── dashboard.html
    ├── eye_test.html
    ├── eye_insights.html
    └── ... (all your html files)
```

---

## STEP 2 — Push to GitHub

1. Go to https://github.com/new and create a new repository
   - Name it: `lenscare`
   - Set it to **Private** (your code is private)
   - Click **Create repository**

2. On your computer, open a terminal in your project folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lenscare.git
git push -u origin main
```
(Replace YOUR_USERNAME with your actual GitHub username)

---

## STEP 3 — Deploy on Render (auto-detects render.yaml)

1. Go to https://render.com and log in

2. Click **"New +"** → **"Blueprint"**

3. Connect your GitHub account if not done already

4. Select your **lenscare** repository

5. Render reads `render.yaml` automatically and creates:
   - ✅ A **Web Service** running your Flask app
   - ✅ A **PostgreSQL database** (free tier)
   - ✅ Automatically connects them via DATABASE_URL

6. Click **"Apply"** — Render builds and deploys everything

7. Wait ~3 minutes for the build to finish

8. Your app is live at: `https://lenscare.onrender.com`

---

## STEP 4 — Set your SECRET_KEY (important for security!)

After deploying:
1. Go to your Web Service on Render
2. Click **Environment** tab
3. Add a new variable:
   - Key:   `SECRET_KEY`
   - Value: any long random string, e.g. `xK9#mP2@qL8vN5!jR3wT7uY1`
4. Click **Save** — Render restarts automatically

Then in your app.py, change:
```python
app.secret_key = 'lens_care_secret_key_2026_change_in_production'
```
to:
```python
app.secret_key = os.environ.get('SECRET_KEY', 'fallback-local-dev-key')
```

---

## STEP 5 — Verify it works

1. Visit your Render URL
2. Log in with: `username: doctor` / `password: doctor123`
   (seeded automatically on first startup)
3. Register a new patient and submit a prescription
4. Check your PostgreSQL database on Render:
   - Go to your database → **Data Explorer**
   - You'll see rows in `users`, `prescriptions`, `eye_tests`

---

## HOW IT WORKS

```
User fills form
      ↓
Flask (Render)
      ↓              ↓
Excel file        PostgreSQL
(local backup)    (Supabase/Render)
                       ↓
                 Survives restarts
                 Accessible online
                 Real-time dashboard
```

- Excel files continue to work exactly as before (local backup)
- Every write ALSO goes to PostgreSQL
- If DATABASE_URL is not set, app still works (Excel-only mode)
- Free tier on Render: your app may sleep after 15 min inactivity
  (first request takes ~30s to wake up) — upgrade to paid to avoid this

---

## TROUBLESHOOTING

| Problem | Fix |
|---|---|
| Build fails | Check `requirements.txt` has all packages |
| "Application error" | Check Render logs → Dashboard → Logs tab |
| Database not connecting | Verify DATABASE_URL is set in Environment tab |
| App sleeping | Normal on free tier — first visit is slow |
| Excel files missing | Render filesystem is ephemeral — data lives in PostgreSQL |

---

## UPDATING YOUR APP

Whenever you make changes:
```bash
git add .
git commit -m "Update: describe your change"
git push
```
Render automatically redeploys within 2 minutes.

---

**Doctor login (pre-seeded):**
- Username: `doctor`
- Password: `doctor123`
