import { useExpense } from "@/hooks/useExpense";
import { Card } from "../ui/card";
import type { Expense } from "@/types";
import { addMonths, format, subMonths } from "date-fns";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const periodOptions = generatePeriodOptions();

export default function ExpenseSummary() {
  const { expenses } = useExpense();
  const [selectedPeriod, setSelectedPeriod] = useState(
    format(new Date(), "MMMM_yyyy")
  );

  const grouped = groupExpensesByPeriod(expenses);
  const chartGategoriesData = generateCategoriesChartData(expenses);

  const selectedExpenses = grouped[selectedPeriod] ?? [];
  const totalExpense = selectedExpenses.reduce(
    (acc, expense) =>
      acc + (expense.transaction_type === "expense" ? expense.amount : 0),
    0
  );
  const totalIncome = selectedExpenses.reduce(
    (acc, expense) =>
      acc + (expense.transaction_type === "income" ? expense.amount : 0),
    0
  );
  const periodTitle = selectedPeriod.split("_").join(" ");

  const chartCategoriesConfig = {
    labels: chartGategoriesData.chartData.labels,
    datasets: [
      {
        label: "Transactions",
        data: chartGategoriesData.chartData.data,
        backgroundColor: chartGategoriesData.chartData.backgroundColors,
        borderColor: chartGategoriesData.chartData.borderColors,
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="py-4 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">{`Summary ${periodTitle}`}</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((period) => (
              <SelectItem key={period} value={period}>
                {period.split("_").join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="grid grid-rows-3 gap-2">
          <Card className="flex flex-col gap-2 justify-center py-4 px-6">
            <div className="flex items-center gap-2">
              <ArrowUp className="text-rose-600" />
              <h3 className="text-lg font-semibold">Expenses</h3>
            </div>
            <div className="text-4xl text-rose-600 font-bold">
              {formatCurrency(totalExpense)}
            </div>
          </Card>
          <Card className="flex flex-col gap-2 justify-center py-4 px-6">
            <div className="flex items-center gap-2">
              <ArrowDown className="text-emerald-600" />
              <h3 className="text-lg font-semibold">Income</h3>
            </div>
            <div className="text-4xl text-emerald-600 font-bold">
              {formatCurrency(totalIncome)}
            </div>
          </Card>
          <Card className="flex flex-col gap-2 justify-center py-4 px-6">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="text-sky-600" />
              <h3 className="text-lg font-semibold">Difference</h3>
            </div>
            <div className="text-4xl text-sky-600 font-bold">
              {formatCurrency(totalIncome - totalExpense)}
            </div>
          </Card>
        </div>
        <div>
          <Card className="flex flex-col gap-2 justify-center py-4 px-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Categories</h3>
            </div>
            <div className="flex items-start gap-8">
              <div className="h-80 aspect-square">
                <Doughnut data={chartCategoriesConfig} />
              </div>
              <div>
                {chartGategoriesData.data.map((item) => (
                  <div className="flex items-center gap-2 text-lg">
                    <span
                      className="inline-block h-3 w-4 border"
                      style={{
                        backgroundColor: `hsla(${item.hueColor}, 70%, 50%, 0.2)`,
                        borderColor: `hsla(${item.hueColor}, 70%, 50%, 1)`,
                      }}
                    />
                    {item.type === "expense" ? (
                      <ArrowUp className="h-4 w-4 text-rose-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-emerald-600" />
                    )}
                    <span className="text-muted-foreground">
                      {item.category}
                    </span>
                    <span>{`${item.percentage}%`}</span>
                    <span className="font-semibold">
                      {`(${formatCurrency(item.total)})`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const TYPE_MAP = {
  expense: "Expense",
  income: "Income",
};

function groupExpensesByPeriod(expenses: Expense[]) {
  const groupedExpenses: Record<string, Expense[]> = {};
  expenses.forEach((expense) => {
    const period = format(new Date(expense.transaction_date), "MMMM_yyyy");
    if (groupedExpenses[period]) {
      groupedExpenses[period].push(expense);
    } else {
      groupedExpenses[period] = [expense];
    }
  });
  return groupedExpenses;
}

function generatePeriodOptions() {
  const now = new Date();

  const monthYears = [];

  for (let i = 8; i > 0; i--) {
    const date = subMonths(now, i);
    monthYears.push(format(date, "MMMM_yyyy")); // e.g. "Oct_2023"
  }

  monthYears.push(format(now, "MMMM_yyyy"));

  for (let i = 1; i <= 8; i++) {
    const date = addMonths(now, i);
    monthYears.push(format(date, "MMMM_yyyy"));
  }

  return monthYears;
}

function generateCategoriesChartData(expenses: Expense[]) {
  const categoriesMap: Record<
    string,
    {
      count: number;
      percentage: number;
      hueColor: number;
      title: string;
      total: number;
      type: "expense" | "income";
      category: string;
    }
  > = {};

  expenses.forEach((expense) => {
    const category = `${TYPE_MAP[expense.transaction_type]} ${
      expense.category
    }`;

    if (categoriesMap[category]) {
      categoriesMap[category].count += 1;
      categoriesMap[category].total += expense.amount;
    } else {
      categoriesMap[category] = {
        count: 1,
        percentage: 0,
        title: category,
        hueColor: 0,
        total: expense.amount,
        type: expense.transaction_type,
        category: expense.category,
      };
    }
  });

  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  Object.values(categoriesMap).forEach((category, i) => {
    category.percentage = Number(
      ((category.total / totalExpenses) * 100).toFixed(1)
    );
    category.hueColor = Math.floor(60 * (i + 1));
  });

  return {
    chartData: {
      labels: Object.values(categoriesMap).map((category) => category.title),
      backgroundColors: Object.values(categoriesMap).map(
        (category) => `hsla(${category.hueColor}, 70%, 50%, 0.2)`
      ),
      borderColors: Object.values(categoriesMap).map(
        (category) => `hsla(${category.hueColor}, 80%, 50%, 1)`
      ),
      data: Object.values(categoriesMap).map((category) => category.total),
    },
    data: Object.values(categoriesMap),
  };
}
