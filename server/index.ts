import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { cert, initializeApp as initAdmin } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import translateRoute from './routes/translate';

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(translateRoute);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Firebase Admin initialization using environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey && privateKey.includes('\\n')) privateKey = privateKey.replace(/\\n/g, '\n');

if (projectId && clientEmail && privateKey) {
  initAdmin({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
}

const adminAuth = (() => {
  try {
    return getAdminAuth();
  } catch {
    return null;
  }
})();

// Session endpoints (optional)
app.post('/api/session/login', async (req, res) => {
  if (!adminAuth) return res.status(501).json({ ok: false, error: 'Admin not configured' });
  const { idToken } = req.body ?? {};
  if (!idToken) return res.status(400).json({ ok: false, error: 'Missing idToken' });
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    res.cookie('session', idToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires,
    });
    res.json({ ok: true, uid: decoded.uid });
  } catch (e) {
    res.status(401).json({ ok: false, error: 'Invalid token' });
  }
});

app.post('/api/session/logout', (req, res) => {
  res.clearCookie('session', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ ok: true });
});

// Middleware to verify session cookie (optional)
export function verifySession(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!adminAuth) return res.status(501).json({ ok: false, error: 'Admin not configured' });
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ ok: false, error: 'No session' });
  adminAuth
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => res.status(401).json({ ok: false, error: 'Invalid session' }));
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});




