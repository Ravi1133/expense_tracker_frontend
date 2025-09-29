import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./AuthContaxt";
import Header from "../pages/Header";

type ProtectedRouteProps = {
    children: JSX.Element;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    //    let userData= useContext(UserContext)
    let userData = JSON.parse(localStorage.getItem("userData")||"")
    console.log("userData", userData)
    localStorage.getItem("")
    if (!userData?.id) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }
    return<>
    <Header/>
     {children}
    </>
    ;
};

export default ProtectedRoute;
