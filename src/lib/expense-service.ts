import { db } from "@/config/firebase";
import type { Expense } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  updateDoc,
} from "firebase/firestore";
import { Converter } from "./utils";

export async function getExpeses() {
  try {
    const collectionRef = collection(db, "expenses").withConverter(
      Converter<Expense>()
    );
    const snaps = await getDocs(
      query(
        collectionRef,
        orderBy("transaction_date", "desc"),
        orderBy("date", "desc")
      )
    );
    return snaps.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
}

export async function getExpesesWithinDateRange(
  start: Timestamp,
  end: Timestamp
) {
  try {
    const collectionRef = collection(db, "expenses").withConverter(
      Converter<Expense>()
    );
    const snaps = await getDocs(
      query(
        collectionRef,
        where("transaction_date", ">=", start),
        where("transaction_date", "<=", end),
        orderBy("transaction_date", "desc"),
        orderBy("date", "desc")
      )
    );
    return snaps.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
}

export async function createExpense(expense: Omit<Expense, "id">) {
  try {
    const collectionRef = collection(db, "expenses").withConverter(
      Converter<Expense>()
    );
    const docRef = await addDoc(collectionRef, expense);
    return { ...expense, id: docRef.id };
  } catch (error) {
    console.error("Error creating expense:", error);
    return null;
  }
}

export async function updateExpense(id: string, expense: Omit<Expense, "id">) {
  try {
    const docRef = doc(db, "expenses", id).withConverter(Converter<Expense>());
    await updateDoc(docRef, expense);
    return { ...expense, id };
  } catch (error) {
    console.error("Error updating expense:", error);
    return null;
  }
}

export async function deleteExpense(id: string) {
  try {
    const docRef = doc(db, "expenses", id).withConverter(Converter<Expense>());
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting expense:", error);
    return false;
  }
}
