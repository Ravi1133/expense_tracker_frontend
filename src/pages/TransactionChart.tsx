import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getTransactionByUserId } from "../api/api";
import type { TransactionGetResponse } from "../api/apiTypes";
import moment from "moment";

let momentDate = moment(new Date()).format("M")
console.log("momentDate", momentDate)
// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

type Transaction = {
  category: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description?: string;
  date: string; // ISO string
};

type listCharDataType = {
  label: string,
  data: number[],
  borderColor: string,
  backgroundColor: string,
  tension: number
}
// Example transaction data
const transactions: Transaction[] = [
  { category: "Salary", amount: 5000, type: "INCOME", date: "2025-09-01" },
  { category: "Food", amount: 200, type: "EXPENSE", date: "2025-09-03" },
  { category: "Investment", amount: 1000, type: "INCOME", date: "2025-09-10" },
  { category: "Shopping", amount: 400, type: "EXPENSE", date: "2025-09-15" },
  { category: "Freelance", amount: 1200, type: "INCOME", date: "2025-09-20" },
];

type SingleTransaction = TransactionGetResponse["transaction"][number];
function TransactionCharts() {
  // ----- Pie Chart Data (Category Distribution) -----
  let [userSpecificData, setuserSpecificData] = useState<TransactionGetResponse["transaction"] | null>(null)
  let [refinedListData, setrefinedListData] = useState<listCharDataType[] | []>([])

  const pieLabels = Array.from(
    new Set(userSpecificData?.map((t) => t.category.name))
  );
  console.log("pieLabels", pieLabels)
  const pieDataValues = pieLabels.map(
    (label) =>
      userSpecificData?.filter((t: SingleTransaction) => t.category.name === label)
        .reduce((sum: number, t: SingleTransaction) => sum + t.amount, 0)
  );
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: "Category Distribution",
        data: pieDataValues,
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"],
      },
    ],
  };

  // ----- Line Chart Data (Monthly Trends) -----
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  userSpecificData?.forEach((t) => {
    const monthIndex = new Date(t.transactionDate).getMonth();
    if (t.type === "INCOME") monthlyIncome[monthIndex] += t.amount;
    else monthlyExpense[monthIndex] += t.amount;
  });

  const lineData = {
    labels: months,
    datasets: refinedListData,
  };
  console.log("lineData", lineData)

  // ----- Bar Chart Data (Income vs Expenses) -----
  const barData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount",
        data: [monthlyIncome.reduce((a, b) => a + b, 0), monthlyExpense.reduce((a, b) => a + b, 0)],
        backgroundColor: ["#10B981", "#EF4444"],
      },
    ],
  };

  const totalIncome = monthlyIncome.reduce((a, b) => a + b, 0);
  const totalExpenses = monthlyExpense.reduce((a, b) => a + b, 0);

  const doughnutData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Income vs Expenses",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#10B981", "#EF4444"],
        hoverOffset: 10,
      },
    ],
  };
  const getTransactionUser = async () => {
    let response = await getTransactionByUserId()
    console.log("response", response)
    setuserSpecificData(response.transaction)
    let monthlyExpenseCal = Array(12).fill(0)
    let monthlyIncomeCal = Array(12).fill(0)
    response.transaction.map((item) => {
      const monthIndex = moment(item.transactionDate).month(); // 0 for Jan, 11 for Dec
      console.log("monthIndex",monthIndex)
      if (item.type === "EXPENSE") {
        monthlyExpenseCal[monthIndex] += item.amount; // add amount
      } else if (item.type === "INCOME") {
        monthlyIncomeCal[monthIndex] += item.amount; // add amount
      }
    })
    console.log("monthlyIncomeCal", monthlyIncomeCal)
    
    setrefinedListData([
      {
        label: "Income",
        data: monthlyIncomeCal,
        borderColor: "#10B981",
        backgroundColor: "#10B98133",
        tension: 0.4,
      },

      {
        label: "Expenses",
        data: monthlyExpenseCal,
        borderColor: "#EF4444",
        backgroundColor: "#EF444433",
        tension: 0.4,
      },
    ]
  )
  }
  useEffect(() => {
    getTransactionUser()
  }, [])

  console.log("userSpecificData", userSpecificData)
  console.log("refinedListData",refinedListData)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[100%] mx-auto space-y-10  px-[10%] ">
        <h1 className="text-3xl font-bold text-primary mb-4 text-center">Transaction Visualization</h1>


        <div className="flex mx-auto  justify-around">
          <div className="bg-surface p-6 rounded-2xl shadow-lg max-w-[450px]  px-[50px]">
            <h2 className="text-xl font-semibold mb-4">Category Distribution (Pie Chart)</h2>
            <Pie data={pieData} />
          </div>


          <div className="bg-surface p-6 rounded-2xl shadow-lg max-w-[450px]  px-[50px]">
            <h2 className="text-xl font-semibold mb-4">Monthly Trends (Line Chart)</h2>
            <Line data={lineData} />
          </div>
        </div>

        <div className="flex mx-auto  justify-around">
          <div className="bg-surface p-6 rounded-2xl shadow-lg max-w-[450px]  px-[50px]">
            <h2 className="text-xl font-semibold mb-4">Income vs Expenses (Bar Chart)</h2>
            <Bar data={barData} />
          </div>
          <div className="bg-surface p-6 rounded-2xl shadow-lg max-w-[450px]  px-[50px]">
            <h2 className="text-xl font-semibold mb-4">Income vs Expenses (Doughnut Chart)</h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionCharts;
