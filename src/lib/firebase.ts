import { initializeApp } from "firebase/app";
import type { User } from "firebase/auth";
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import {
    doc,
    initializeFirestore,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTB6DVVHdw_pBXdPbnM7TO65NZdpzB3P0",
  authDomain: "auralink-b9735.firebaseapp.com",
  projectId: "auralink-b9735",
  storageBucket: "auralink-b9735.firebasestorage.app",
  messagingSenderId: "396107375548",
  appId: "1:396107375548:web:984b3697161da16aed01b9",
  measurementId: "G-J3PKD6G181",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

function googleSignIn() {
  return signInWithPopup(auth, provider);
}

function googleSignOut() {
  return signOut(auth);
}

function onUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export { googleSignIn, googleSignOut, onUserChanged };

type EmailSignUpArgs = { email: string; password: string; username: string };
type EmailSignInArgs = { email: string; password: string };

export async function emailSignUp({ email, password, username }: EmailSignUpArgs) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: username });
  }
  const uid = cred.user.uid;
  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      email,
      username,
      provider: "password",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  return cred.user;
}

export async function emailSignIn({ email, password }: EmailSignInArgs) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

