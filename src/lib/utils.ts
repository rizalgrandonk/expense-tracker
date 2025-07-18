import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
} from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  locale: string = "id-ID",
  currency: string = "IDR",
  withSymbol: boolean = true
) {
  return new Intl.NumberFormat(locale, {
    style: withSymbol ? "currency" : "decimal",
    currency: withSymbol ? currency : undefined,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function Converter<T extends object>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>): DocumentData {
      const validData = Object.fromEntries(
        Object.entries(data).map(([key, value]) =>
          value === undefined ? [key, null] : [key, value]
        )
      );
      return validData as DocumentData;
    },
    fromFirestore(snapshot): T {
      return snapshot.data() as T;
    },
  };
}
