import type { Expense } from "@/types";
import { getExpenses } from "./sheet-service";

export async function getExpesesData(accessToken: string): Promise<Expense[]> {
  const result = await getExpenses(accessToken);
  if (!result.success) {
    throw new Error(result.error);
  }
  const data: string[][] = result.data;
  return data.map((row, i) => ({
    id: row[0],
    date: row[6],
    description: row[2],
    amount: parseFloat(row[4]),
    category: row[5],
    transaction_date: row[1],
    transaction_type: row[3] as "expense" | "income",
    row_number: i + 1,
    user_email: row[7],
    user_name: row[8],
    user_image: row[9],
  }));
}
