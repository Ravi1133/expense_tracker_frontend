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

// Example transaction data
const transactions: Transaction[] = [
  { category: "Salary", amount: 5000, type: "INCOME", date: "2025-09-01" },
  { category: "Food", amount: 200, type: "EXPENSE", date: "2025-09-03" },
  { category: "Investment", amount: 1000, type: "INCOME", date: "2025-09-10" },
  { category: "Shopping", amount: 400, type: "EXPENSE", date: "2025-09-15" },
  { category: "Freelance", amount: 1200, type: "INCOME", date: "2025-09-20" },
];

function TransactionCharts() {
  // ----- Pie Chart Data (Category Distribution) -----
  const pieLabels = Array.from(
    new Set(transactions.map((t) => t.category))
  );
  const pieDataValues = pieLabels.map(
    (label) =>
      transactions
        .filter((t) => t.category === label)
        .reduce((sum, t) => sum + t.amount, 0)
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

  transactions.forEach((t) => {
    const monthIndex = new Date(t.date).getMonth();
    if (t.type === "INCOME") monthlyIncome[monthIndex] += t.amount;
    else monthlyExpense[monthIndex] += t.amount;
  });

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: monthlyIncome,
        borderColor: "#10B981",
        backgroundColor: "#10B98133",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: monthlyExpense,
        borderColor: "#EF4444",
        backgroundColor: "#EF444433",
        tension: 0.4,
      },
    ],
  };

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
