import { getFirebaseDb } from './firebaseClient';
import { Shot, Task, BudgetItem } from '../types';
import { collection, onSnapshot, doc, updateDoc, getDocs, setDoc } from 'firebase/firestore';

// REAL-TIME LISTENERS
export const onShotsUpdate = (callback: (shots: Shot[]) => void, onError: (error: Error) => void) => {
    const db = getFirebaseDb();
    if (!db) return () => {};
    const shotsCol = collection(db, 'shots');
    return onSnapshot(shotsCol, (snapshot) => {
        const shots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Shot));
        callback(shots);
    }, onError);
};

export const onTasksUpdate = (callback: (tasks: Task[]) => void, onError: (error: Error) => void) => {
    const db = getFirebaseDb();
    if (!db) return () => {};
    const tasksCol = collection(db, 'tasks');
    return onSnapshot(tasksCol, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Task));
        callback(tasks);
    }, onError);
};

export const onBudgetUpdate = (callback: (budget: BudgetItem[]) => void, onError: (error: Error) => void) => {
    const db = getFirebaseDb();
    if (!db) return () => {};
    const budgetCol = collection(db, 'budget');
    return onSnapshot(budgetCol, (snapshot) => {
        const budget = snapshot.docs.map(doc => ({ category: doc.id, ...doc.data() } as BudgetItem));
        callback(budget);
    }, onError);
};


// ONE-TIME FETCH (Fallback/Initial Load)
export const fetchShots = async (): Promise<Shot[]> => {
    const db = getFirebaseDb();
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'shots'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Shot));
};

export const fetchTasks = async (): Promise<Task[]> => {
    const db = getFirebaseDb();
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'tasks'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Task));
};

export const fetchBudget = async (): Promise<BudgetItem[]> => {
    const db = getFirebaseDb();
    if (!db) return [];
    const snapshot = await getDocs(collection(db, 'budget'));
    return snapshot.docs.map(doc => ({ category: doc.id, ...doc.data() } as BudgetItem));
};


// UPDATE/UPSERT FUNCTIONS
export const updateShot = async (shot: Shot) => {
    const db = getFirebaseDb();
    if (!db) return;
    const { id, ...shotData } = shot;
    const shotRef = doc(db, 'shots', id);
    await setDoc(shotRef, shotData, { merge: true });
};

export const updateTask = async (task: Task) => {
    const db = getFirebaseDb();
    if (!db) return;
    const { id, ...taskData } = task;
    const taskRef = doc(db, 'tasks', String(id));
    await setDoc(taskRef, taskData, { merge: true });
};

export const updateBudget = async (budgetItem: BudgetItem) => {
    const db = getFirebaseDb();
    if (!db) return;
    const { category, ...budgetData } = budgetItem;
    const budgetRef = doc(db, 'budget', category);
    await setDoc(budgetRef, budgetData, { merge: true });
};
