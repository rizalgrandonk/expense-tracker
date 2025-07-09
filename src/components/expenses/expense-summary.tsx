import { useExpense } from "@/hooks/useExpense";
import { Card } from "../ui/card";
import type { Expense } from "@/types";
import { format } from "date-fns/format";
import { addMonths } from "date-fns/addMonths";
import { subMonths } from "date-fns/subMonths";
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
import UserAvatar from "../user-avatar";

ChartJS.register(ArcElement, Tooltip);

const periodOptions = generatePeriodOptions();

export default function ExpenseSummary() {
  const { groupedByPeriod: grouped, groupedByUser } = useExpense();
  const [selectedPeriod, setSelectedPeriod] = useState(
    format(new Date(), "MMMM_yyyy")
  );

  const selectedExpenses = grouped[selectedPeriod] ?? [];

  const chartGategoriesData = generateCategoriesChartData(selectedExpenses);

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
    <div className="space-y-3">
      <div className="flex justify-between items-center bg-primary-gradient py-1.5 px-3 rounded-md">
        <h2 className="text-lg font-semibold">{`Tracked in ${periodTitle}`}</h2>
        <div className="rounded-md bg-background">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger size="sm" className="lg:w-48 text-foreground">
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
      </div>

      <div className="grid lg:grid-cols-2 gap-2">
        <div className="grid grid-rows-3 gap-2">
          <ExpenseWidget
            groupedByUser={groupedByUser}
            type="expense"
            total={totalExpense}
            title="Expense"
          />
          <ExpenseWidget
            groupedByUser={groupedByUser}
            type="income"
            total={totalIncome}
            title="Income"
          />
          <ExpenseWidget
            groupedByUser={groupedByUser}
            type="difference"
            total={totalIncome - totalExpense}
            title="Difference"
          />
        </div>
        <div>
          <Card className="h-full flex flex-col gap-2 justify-start py-4 px-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Categories</h3>
            </div>
            {selectedExpenses.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">No expenses</h2>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="aspect-square lg:w-3/5 self-center">
                  <Doughnut key={selectedPeriod} data={chartCategoriesConfig} />
                </div>
                <div className="grid lg:grid-cols-2 gap-2">
                  {chartGategoriesData.data.map((item) => (
                    <CategoryLegendItem key={item.title} item={item} />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

const WIDGET_TEXT_COLOR_MAP = {
  expense: "text-rose-600",
  income: "text-emerald-600",
  difference: "text-sky-600",
};
const WIDGET_ICON_MAP = {
  expense: ArrowUp,
  income: ArrowDown,
  difference: ArrowUpDown,
};

type ExpenseWidgetProps = {
  type: "expense" | "income" | "difference";
  title: string;
  total: number;
  groupedByUser: {
    user_uid: string;
    user_name: string;
    user_email: string;
    user_image: string | null;
    total_expenses: number;
    total_income: number;
    expenses: Expense[];
  }[];
};

function ExpenseWidget({
  groupedByUser,
  type,
  total,
  title,
}: ExpenseWidgetProps) {
  const textColor = WIDGET_TEXT_COLOR_MAP[type];
  const Icon = WIDGET_ICON_MAP[type];
  return (
    <Card className="flex flex-col gap-6 justify-around py-4 px-6">
      <div className="flex flex-col gap-2 justify-center">
        <div className="flex items-center gap-2">
          <Icon className={`${textColor}`} />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className={`text-4xl ${textColor} font-bold`}>
          {formatCurrency(total)}
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-2">
        {groupedByUser.map((user) => {
          const amount =
            type === "difference"
              ? user.total_income - user.total_expenses
              : type === "expense"
              ? user.total_expenses
              : user.total_income;
          return (
            <div className="flex items-center gap-2" key={user.user_uid}>
              <UserAvatar
                name={user.user_name}
                picture={user.user_image}
                className="h-8 w-8"
              />
              <span className={`${textColor} font-bold`}>
                {formatCurrency(amount)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

type CategoryLegendItemProps = {
  item: {
    title: string;
    total: number;
    percentage: number;
    category: string;
    type: string;
    hueColor: number;
  };
};

function CategoryLegendItem({ item }: CategoryLegendItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className="block h-7 aspect-square border"
        style={{
          backgroundColor: `hsla(${item.hueColor}, 70%, 50%, 0.2)`,
          borderColor: `hsla(${item.hueColor}, 70%, 50%, 1)`,
        }}
      />
      {item.type === "expense" ? (
        <ArrowUp className="h-5 aspect-square text-rose-600" />
      ) : (
        <ArrowDown className="h-5 aspect-square text-emerald-600" />
      )}
      <div className="space-y-1">
        <span className="text-muted-foreground text-xs">{item.category}</span>
        <div className="text-sm flex items-center gap-1">
          <span>{`(${item.percentage}%)`}</span>
          <span className="font-semibold">
            {`${formatCurrency(item.total)}`}
          </span>
        </div>
      </div>
    </div>
  );
}

const TYPE_MAP = {
  expense: "Expense",
  income: "Income",
};

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

    category.hueColor = Math.floor((i * 137.508) % 360);
  });

  return {
    chartData: {
      labels: Object.values(categoriesMap).map((category) => category.title),
      backgroundColors: Object.values(categoriesMap).map((category, i) => {
        const sat = 75 + (i % 3) * 5; // 85-95% saturation
        const light = 60 + (i % 2) * 5; // 65-70% lightness
        return `hsla(${category.hueColor}, ${sat}%, ${light}%, 0.3)`;
      }),
      borderColors: Object.values(categoriesMap).map((category, i) => {
        const lightAdjust = i % 2 === 0 ? 55 : 60; // Slight variation
        return `hsl(${category.hueColor}, 100%, ${lightAdjust}%)`;
      }),
      data: Object.values(categoriesMap).map((category) => category.total),
    },
    data: Object.values(categoriesMap),
  };
}
