Colentis

A little space for CORTIS fans to show up, collect memories, and grow together.

Colentis is a gamified shared calendar for CORTIS fans. Turn everyday tasks into small wins, collect photo cards, keep your streak alive, and make plans with friends.

Built for the fandom. Designed for the everyday.

Features

- Daily tasks — Complete your daily checklist and earn rewards.
- Photo card collection — Unlock cards across different rarities.
- Streak system — Keep your momentum going, day after day.
- Shared calendars — Plan activities and complete tasks with friends.
- Social features — Connect with other fans and explore shared albums.
- Gift letters — Receive rewards and messages from the admin.
- Offline support — Keep working through temporary connection issues.

Tech Stack

Layer| Technology
Frontend| React, TypeScript, Vite
Backend| Supabase, PostgreSQL
Authentication| Supabase Auth
Storage| Supabase Storage
Deployment| GitHub Pages
Testing| Playwright, SQL tests

Cost target: Free-tier infrastructure, with no paid hosting required.

Getting Started

Requirements

- Node.js and npm
- A Supabase project
- Git and GitHub (for deployment)

1. Install

Run the following commands in Windows PowerShell:

cd C:\Projects\colentis
npm install
Copy-Item .env.example .env.local

Add your Supabase credentials to ".env.local":

VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

Start the development server:

npm run dev

Open "http://localhost:5173" in your browser.

2. Set Up Supabase

1. Create a project at "Supabase" (https://supabase.com).
2. Open SQL Editor → New query.
3. Paste the contents of "supabase/setup-all.sql" and run it once.
4. Under Project Settings → API, copy your Project URL and "anon" public key into ".env.local".
5. Under Authentication → Providers → Email, enable email authentication.
6. Under Authentication → URL Configuration, configure your local redirect URL and production Site URL.

For a small fan project, disabling email confirmation can reduce signup friction. Do this only if it fits your intended account-security requirements.

Admin setup

Register your account through the app first. Then run the following query in the Supabase SQL Editor, replacing the username with your own:

UPDATE public.profiles
SET is_admin = TRUE
WHERE username = 'your_username';

Signup limit

The default signup cap is 50 accounts. To change it to 80:

UPDATE public.app_config
SET value = '80'
WHERE key = 'signup_cap';

Photo Card Assets

Card assets are stored in private Supabase Storage, not in the GitHub repository.

Processed assets live in "local-cards/_ready/", including "manifest.json". The "local-cards/" directory is excluded from Git.

Generate card thumbnails:

npm run thumbs

Thumbnails are generated under "local-cards/_ready/thumbs/".

Upload cards

Option A: Supabase Dashboard

Open Storage → cards and upload the folders below from "local-cards/_ready/" to the bucket root:

- "common/"
- "rare/"
- "legendary/"
- "supreme/"
- "event-birthday-james/"
- "thumbs/"

Preserve the directory structure. For example:

cards/
├── common/
│   └── common-01.webp
└── thumbs/
    └── common-01.webp

Option B: Upload script

Run in PowerShell:

$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"
npm run upload-cards

Keep the service role key in the current shell session only. Never commit it, put it in frontend environment variables, or share it publicly. Close the PowerShell window when you're done.

Storage access is governed by the policies in "supabase/migrations/006_storage.sql". Users should only be able to access cards they own, their favorites, or cards exposed through a friend's public album, as permitted by the configured policies.

Deployment

Colentis can be deployed to GitHub Pages using GitHub Actions.

1. Create a repository

Create a GitHub repository for the project. GitHub Pages on the Free plan requires a public repository.

The frontend contains the Supabase URL and anon public key, which are intended for client-side use. Keep private assets and privileged credentials outside the repository.

2. Configure repository variables

Navigate to:

Settings → Secrets and variables → Actions → Variables

Add:

- "VITE_SUPABASE_URL"
- "VITE_SUPABASE_ANON_KEY"

Use the same values as your local environment.

3. Enable GitHub Pages

Under Settings → Pages, set the deployment source to GitHub Actions.

The deployment workflow is currently located at "scripts/deploy.yml". Move a copy into GitHub's expected workflow directory:

New-Item -ItemType Directory -Force .github\workflows
Copy-Item scripts\deploy.yml .github\workflows\deploy.yml

4. Push to GitHub

git init -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main

The workflow runs type checking, linting, building, and deployment.

Your site will be available at:

"https://<account>.github.io/<repository>/"

Make sure the Vite base path is configured correctly for the repository URL.

Development

Run the following checks before pushing changes:

npm run typecheck
npm run lint
npm run build

SQL tests

The SQL test suite lives in "supabase/tests/" and covers helpers, rewards, streaks, date locking, letters, permissions, and Storage policies.

Run the relevant tests against a local PostgreSQL instance:

bash supabase/tests/run.sh supabase/tests/10_helpers.sql

Pass additional test files as needed. See "supabase/tests/" for the available suites.

End-to-end tests

The "e2e/" directory contains Playwright tests that exercise the UI against a simulated Supabase backend.

Coverage includes:

- Registration and starter rewards
- Tasks and photo card rewards
- Friends and shared calendars
- Group rewards
- Offline behavior and missed-day recovery
- Admin letters and user profiles

These tests are intended for development and do not interact with the production backend.

Project Structure

colentis/
├── supabase/
│   ├── migrations/       # Database schema, RPCs, RLS and Storage
│   ├── tests/            # SQL test suites
│   └── setup-all.sql     # Combined database setup
├── src/
│   ├── lib/              # Supabase client, API and types
│   └── ui/
│       ├── loader.ts     # Server data → UI snapshot
│       ├── bridge.ts     # Auth, offline queue, realtime and private images
│       ├── legacy/       # UI modules assembled by the Vite plugin
│       ├── shell.html    # Static HTML shell
│       └── mockup.css    # Main UI styles
├── local-cards/          # Local card assets (gitignored)
├── e2e/                  # Playwright tests and Supabase shim
├── scripts/              # Build and deployment scripts
├── PLAN.md               # Product plan and rules
├── CLAUDE.md             # Claude Code conventions
└── README.md

Some legacy styleguide files under "src/components/", "src/pages/", "src/styles/", and selected "src/lib/" modules are no longer used by the current interface. They have been excluded from type checking and linting and may be removed if they are no longer needed for reference.

Project Notes

- "PLAN.md" contains product requirements and gameplay rules.
- "CLAUDE.md" defines conventions for working with Claude Code.
- "supabase/" contains backend SQL, policies, RPCs, and tests.
- "src/" contains application code and the current interface.
- "e2e/" contains browser tests using a simulated backend.

Security

- Never expose the Supabase "service_role" key in frontend code, Git history, or public files.
- The "anon" key is designed for public clients, but database and Storage security must be enforced through correctly configured RLS policies.
- Keep private card assets in Supabase Storage.
- Review authentication, access policies, and upload permissions before opening registration to the public.

---

Colentis · Small tasks, shared moments, collected memories.