import type { Expense } from "@/types";
import { getExpenses } from "./sheet-service";

export async function getExpesesData(accessToken: string): Promise<Expense[]> {
  const result = await getExpenses(accessToken);
  if (!result.success) {
    throw new Error(result.error);
  }
  const data = result.data;
  return data.map((row: string[]) => ({
    date: row[5],
    description: row[1],
    amount: parseFloat(row[3]),
    category: row[4],
    transaction_date: row[0],
    transaction_type: row[2] as "expense" | "income",
  }));
}
