import type { Expense } from "@/types";

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const SHEET_NAME = "Expenses";

export const appendExpense = async (accessToken: string, expense: Expense) => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:A:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            expense.transaction_date,
            expense.description,
            expense.transaction_type,
            expense.amount,
            expense.category,
            expense.date,
          ],
        ],
      }),
    }
  );
  return await response.json();
};

export const getExpenses = async (accessToken: string) => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:F`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 401) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.values || [],
    };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return {
      success: true,
      error: "Failed to fetch expenses",
    };
  }
};
