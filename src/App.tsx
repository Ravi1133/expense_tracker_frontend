import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CategoryPage from "./pages/Category";
import Transaction from "./pages/Transaction";
import TransactionCharts from "./pages/TransactionChart";
import { useState } from "react";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false)
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/Login" element={<Login />} />


          <Route path="/category" element={<ProtectedRoute isAuthenticated={isAuthenticated}><> <CategoryPage /></></ProtectedRoute>} />
          <Route path="/transaction" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Transaction /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><TransactionCharts /></ProtectedRoute>} />
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
