import { collection, getDocs, setDoc, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Employee, CriticalJob } from '../types';

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

export const loadEmployeesFromStorage = async (): Promise<Employee[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        return querySnapshot.docs.map(doc => {
            const emp = doc.data() as Employee;
            return {
                ...emp,
                submissionType: emp.submissionType || 'Admin',
                status: emp.status || 'Disetujui',
            };
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'employees');
        return [];
    }
};

export const saveEmployeeToStorage = async (employee: Employee): Promise<void> => {
    try {
        await setDoc(doc(db, 'employees', employee.id), employee);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `employees/${employee.id}`);
    }
};

export const deleteEmployeeFromStorage = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'employees', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `employees/${id}`);
    }
};

export const saveMultipleEmployeesToStorage = async (employees: Employee[]): Promise<void> => {
    try {
        const batch = writeBatch(db);
        employees.forEach(emp => {
            const docRef = doc(db, 'employees', emp.id);
            batch.set(docRef, emp);
        });
        await batch.commit();
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'employees');
    }
};

export const deleteMultipleEmployeesFromStorage = async (ids: string[]): Promise<void> => {
    try {
        const batch = writeBatch(db);
        ids.forEach(id => {
            const docRef = doc(db, 'employees', id);
            batch.delete(docRef);
        });
        await batch.commit();
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'employees');
    }
};

export const loadCriticalJobsFromStorage = async (): Promise<CriticalJob[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'criticalJobs'));
        return querySnapshot.docs.map(doc => doc.data() as CriticalJob);
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'criticalJobs');
        return [];
    }
};

export const saveCriticalJobToStorage = async (job: CriticalJob): Promise<void> => {
    try {
        await setDoc(doc(db, 'criticalJobs', job.id), job);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `criticalJobs/${job.id}`);
    }
};

export const deleteAllEmployeesFromStorage = async (): Promise<void> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'employees');
    }
};

export const deleteAllCriticalJobsFromStorage = async (): Promise<void> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'criticalJobs'));
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'criticalJobs');
    }
};

export const deleteCriticalJobFromStorage = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'criticalJobs', id));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `criticalJobs/${id}`);
    }
};