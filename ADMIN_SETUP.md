# HAPPI Clinic appointments admin — setup

The existing `/contact` appointment form remains unchanged. Valid requests are now saved to the database via the server-side `/api/enquiry` route. Staff sign in at `/admin` using individual **email and password** credentials; Supabase Auth verifies passwords. The `admin_users` allowlist controls who can view or edit appointment records. Live changes appear through Supabase Realtime, with a 60-second refresh fallback.

## Configure database + admin login

1. Create a Supabase project. In **SQL Editor** execute `supabase/schema.sql`.
2. In **Authentication → Providers → Email**, enable email/password auth. For a private staff portal, disable public signups / new user registration. Enforce strong passwords and preferably enable MFA for staff.
3. In **Authentication → Users**, choose **Add user** and create a staff email/password (e.g. the clinic owner's own address); do not place their password in this repository. Copy the user's UUID.
4. In **SQL Editor**, authorize that user:

```sql
insert into public.admin_users (user_id)
values ('REPLACE_WITH_REAL_SUPABASE_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

5. Set the following in **Vercel → Project Settings → Environment Variables** for Production (and locally in `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase publishable/anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service-role key — secret, **server-side only**
6. Redeploy. Visit `https://your-domain/admin` and log in with the staff email/password you created.

**Security notes:** Never expose a service-role key or patient data through public environment variables, commit credentials, or share a real admin password in chat. Database RLS ensures that logging in is insufficient without an `admin_users` record. Admin signup is not offered on the website. Existing `/keystatic` is a separate content editing interface with its own authentication settings.

## Test

- Submit the `/contact` form; verify a `pending` entry in Supabase and `/admin`.
- Sign out; verify appointment data disappears. Sign in with a non-admin user; verify access denied.
- Confirm an appointment; verify status and scheduled time persist after refresh.
- Validate invalid/honeypot form submissions are rejected.

**Caution:** A live Supabase project and actual staff accounts have not been configured in this package. Do not treat the included code as already deployed or production-tested. A previously configured email/webhook delivery channel is still supported: when database is configured, the DB is authoritative and notification failure is logged, not reported as an unsuccessful appointment submission.
