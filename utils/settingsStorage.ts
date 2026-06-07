import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PublicAccessSettings } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getPublicAccessSettings = async (): Promise<PublicAccessSettings> => {
    try {
        const docRef = doc(db, 'settings', 'publicAccess');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as PublicAccessSettings;
        } else {
            return {
                isOpen: true,
                startTime: '',
                endTime: ''
            };
        }
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'settings/publicAccess');
        return {
            isOpen: true,
            startTime: '',
            endTime: ''
        };
    }
}

export const savePublicAccessSettings = async (settings: PublicAccessSettings): Promise<void> => {
    try {
        await setDoc(doc(db, 'settings', 'publicAccess'), settings);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'settings/publicAccess');
    }
}
