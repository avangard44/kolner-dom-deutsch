import { VocabWord } from "@/types/vocab";

const DB_NAME = "AlmancaKelimeDB";
const DB_VERSION = 1;
const STORE_CUSTOM_WORDS = "custom_words";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_CUSTOM_WORDS)) {
        db.createObjectStore(STORE_CUSTOM_WORDS, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadCustomWordsFromIDB(): Promise<VocabWord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_WORDS, "readonly");
      const store = tx.objectStore(STORE_CUSTOM_WORDS);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as VocabWord[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function saveCustomWordsBatchToIDB(
  words: VocabWord[]
): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_WORDS, "readwrite");
      const store = tx.objectStore(STORE_CUSTOM_WORDS);
      for (const word of words) {
        store.put(word);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback silent if IndexedDB unavailable
  }
}

export const saveCustomWordsToIDB = saveCustomWordsBatchToIDB;

export async function clearCustomWordsFromIDB(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CUSTOM_WORDS, "readwrite");
      const store = tx.objectStore(STORE_CUSTOM_WORDS);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore
  }
}
