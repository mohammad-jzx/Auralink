import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type UserProfile = {
  profile?: {
    guardianChatId?: string;
  };
};

export async function getGuardianChatId(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, "users", uid));
  const data = snap.data() as UserProfile | undefined;
  return data?.profile?.guardianChatId ?? null;
}

export async function setGuardianChatId(uid: string, chatId: string) {
  await setDoc(
    doc(db, "users", uid),
    { profile: { guardianChatId: String(chatId) } },
    { merge: true }
  );
}


