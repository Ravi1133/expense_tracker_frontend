import {  type JSX } from "react";
import { Navigate } from "react-router-dom";
import Header from "../pages/Header";
import { getUserData } from "./utilfunctions";

type ProtectedRouteProps = {
    children: JSX.Element;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    //    let userData= useContext(UserContext)
    let userData=getUserData()
    // let userData = JSON.parse(localStorage.getItem("userData")||{})
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
