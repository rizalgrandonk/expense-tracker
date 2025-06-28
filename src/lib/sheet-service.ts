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

export const findExpenseRow = async (
  accessToken: string,
  createdDate: string
) => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!F:F`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await response.json();
  const rows = data.values || [];
  return rows.findIndex((row: string[]) => row[0] === createdDate) + 1; // +1 for Sheets 1-based index
};

export const deleteExpense = async (
  accessToken: string,
  createdDate: string
) => {
  const row = await findExpenseRow(accessToken, createdDate);
  if (row < 1) throw new Error("Expense not found");

  return await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // First sheet
                dimension: "ROWS",
                startIndex: row - 1, // 0-based
                endIndex: row,
              },
            },
          },
        ],
      }),
    }
  );
};
