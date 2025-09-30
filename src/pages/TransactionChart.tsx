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
import { useContext, useEffect, useState } from "react";
import { getAllTransaction, getTransactionByUserId } from "../api/api";
import type { TransactionGetResponse } from "../api/apiTypes";
import moment from "moment";
import { getUserData } from "../utils/utilfunctions";
import { UserContext } from "../utils/AuthContaxt";

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

type listCharDataType = {
  label: string,
  data: number[],
  borderColor: string,
  backgroundColor: string,
  tension: number
}
// Example transaction data
// const transactions: Transaction[] = [
//   { category: "Salary", amount: 5000, type: "INCOME", date: "2025-09-01" },
//   { category: "Food", amount: 200, type: "EXPENSE", date: "2025-09-03" },
//   { category: "Investment", amount: 1000, type: "INCOME", date: "2025-09-10" },
//   { category: "Shopping", amount: 400, type: "EXPENSE", date: "2025-09-15" },
//   { category: "Freelance", amount: 1200, type: "INCOME", date: "2025-09-20" },
// ];
type FiltersType = {
  categoryId?: number;
  type?: "INCOME" | "EXPENSE";
  transactionDate?: string;
  date: string
};
type SingleTransaction = TransactionGetResponse["transaction"]["data"][number];
// const monthsList =[{Jan:1,},{Feb:2},{March:3},{April:4},{May:5},{June:6},{July:7},{Aug:8},{Sept:9},{Oct:10},{Nov:11},{Dec:12}]
function TransactionCharts() {
  // ----- Pie Chart Data (Category Distribution) -----
  let [userSpecificData, setuserSpecificData] = useState<TransactionGetResponse["transaction"]["data"] | null>(null)
  let [refinedListData, setrefinedListData] = useState<listCharDataType[] | []>([])
  const [filters, setFilters] = useState<FiltersType | {}>({});
  let globaleContext = useContext(UserContext)
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
    let payload = {
      ...filters,
      page: 1,
      pageSize: 100
    }
    let response: any = {}
    if (getUserData()?.role == "admin") {
      response = await getAllTransaction(payload)
    } else {
      response = await getTransactionByUserId(payload)

    }
    console.log("response", response)
    setuserSpecificData(response.transaction.data)
    let monthlyExpenseCal = Array(12).fill(0)
    let monthlyIncomeCal = Array(12).fill(0)
    response.transaction.data.map((item: any) => {
      const monthIndex = moment(item.transactionDate).month(); // 0 for Jan, 11 for Dec
      console.log("monthIndex", monthIndex)
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
  }, [filters])

  // const handleFilterApply = () => {
  //   const payload = {
  //     ...filters,
  //     page: 1,
  //     pageSize: 10,
  //   };

  //   console.log("Filter Payload:", payload);
  //   getTransactionUser()
  //    // API call with filters
  // };

  const handleFilterReset = () => {
    setFilters({});
    getTransactionByUserId({ page: 1, pageSize: 10 }); // fetch default
  };

  console.log("userSpecificData", userSpecificData)
  console.log("refinedListData", refinedListData)
  console.log("globaleContext", globaleContext)
  return (
  <div className="min-h-screen bg-background p-4 sm:p-6">
    <div className="max-w-[100%] mx-auto space-y-10 sm:px-[5%]">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4 text-center">
        Transaction Visualization
      </h1>

      {/* Charts Row 1 */}
      <div className="flex flex-col md:flex-row md:justify-around gap-6">
        <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-lg w-full md:max-w-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Category Distribution (Pie Chart)
          </h2>
          <div className="w-full overflow-x-auto">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-lg w-full md:max-w-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Monthly Trends (Line Chart)
          </h2>
          <div className="w-full overflow-x-auto">
            <Line data={lineData} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="flex flex-col md:flex-row md:justify-around gap-6">
        <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-lg w-full md:max-w-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Income vs Expenses (Bar Chart)
          </h2>
          <div className="w-full overflow-x-auto">
            <Bar data={barData} />
          </div>
        </div>

        <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-lg w-full md:max-w-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Income vs Expenses (Doughnut Chart)
          </h2>
          <div className="w-full overflow-x-auto">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>

    {/* Transactions List */}
    <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-lg mt-6">
      <div className="flex flex-col lg:flex-row lg:justify-between flex-wrap items-start lg:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-md text-xs sm:text-sm">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Transactions List
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          {/* Category Filter */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-xs sm:text-sm text-gray-600 mb-1">
              Category
            </label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.value) {
                  setFilters({ ...filters, categoryId: parseInt(e.target.value) })
                } else {
                  let newFilter = { ...filters }
                  delete newFilter.categoryId
                  setFilters({ ...newFilter })
                }
              }}
            >
              <option value="">All Categories</option>
              {globaleContext?.categories?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-xs sm:text-sm text-gray-600 mb-1">Type</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-xs sm:text-sm text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-xs sm:text-sm text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleFilterReset}
            className="mt-5 sm:mt-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">Category</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Type</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">User</th>
            </tr>
          </thead>
          <tbody>
            {userSpecificData?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center text-text-secondary">
                  No transactions added yet
                </td>
              </tr>
            )}
            {userSpecificData?.map((tx, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{tx.category.name}</td>
                <td className="px-4 py-2 border-b">{tx.amount}</td>
                <td className="px-4 py-2 border-b">{tx.type}</td>
                <td className="px-4 py-2 border-b">
                  {moment(tx.transactionDate).format("DD-MM-YYYY")}
                </td>
                <td className="px-4 py-2 border-b">{tx.description || "-"}</td>
                <td className="px-4 py-2 border-b">{tx.user.name || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

}

export default TransactionCharts;
