import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CategoryPage from "./pages/Category";
import Transaction from "./pages/Transaction";
import TransactionCharts from "./pages/TransactionChart";
import { useContext, useState } from "react";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { UserContext } from "./utils/AuthContaxt";

function App() {
  let globaleContext= useContext(UserContext)
  
  const [isAuthenticated, setisAuthenticated] = useState(globaleContext?.isAuthenticated)
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/Login" element={<Login />} />


          <Route path="/category" element={<ProtectedRoute ><> <CategoryPage /></></ProtectedRoute>} />
          <Route path="/transaction" element={<ProtectedRoute ><Transaction /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute ><TransactionCharts /></ProtectedRoute>} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light" // can be "dark" or "colored"
      />
    </>
  );
}

export default App;
