import { auth } from '@/lib/firebase';

export async function sendIdTokenToBackend(): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  const idToken = await currentUser.getIdToken();
  await fetch('/api/session/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ idToken }),
  }).catch(() => {
    // Swallow errors to avoid breaking client login UX
  });
}

export async function logoutBackendSession(): Promise<void> {
  await fetch('/api/session/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {
    // ignore
  });
}


