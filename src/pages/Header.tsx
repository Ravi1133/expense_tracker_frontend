// assuming you have a hook
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/AuthContaxt";
import { toast } from "react-toastify";
import { getUserData } from "../utils/utilfunctions";

const Header = () => {
    const globaleContext = useContext(UserContext);
    const navigate = useNavigate();
    const userData = getUserData()
    const handleLogout = () => {
        globaleContext?.logout()
        navigate("/login");
        toast.success("User Loggedout")
    };

    return (
        <header className="bg-primary text-black p-4 flex justify-between items-center shadow-md">
            <h3 className="text-xl font-bold" onClick={()=>navigate("/")}>Tracker App</h3>
            <div className="flex items-center gap-4">
                <button
                    onClick={()=>navigate("/transaction")}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                    Transaction
                </button>
                {userData?.role=="admin"&&
                <><button
                    onClick={()=>navigate("/category")}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                    Category
                </button>
                <button
                    onClick={()=>navigate("/users")}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                    User
                </button>
                </>
                }
                <span onClick={()=>navigate("/profile")}>Hi, {userData?.name}</span>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
