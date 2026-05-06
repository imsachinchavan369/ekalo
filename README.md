# EKALO

## Admin Setup

To make yourself admin:

1. Login once with Google.
2. Go to Firestore `users/{yourUid}`.
3. Set `role = "admin"`.
4. Or set `NEXT_PUBLIC_ADMIN_EMAIL` in `.env.local` to allow that email through the app-level admin guard.

If using the role system, the role must be exactly `admin`.

Example:

```env
NEXT_PUBLIC_ADMIN_EMAIL=yourgmail@gmail.com
```

The `/admin` route is protected by Firebase Auth and a Firestore role check. Normal users cannot see the admin panel or inline homepage edit buttons.

Firestore write permissions are still enforced by security rules through `users/{uid}.role == "admin"`, so set the Firestore role before using admin write features in production.
