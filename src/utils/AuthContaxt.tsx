import { createContext, useEffect, useState, type ReactNode } from "react";
import { getAllCategory, loginUser } from "../api/api";
import type { CategoryResponse, LoginPayload } from "../api/apiTypes";

// Define what you want to store in context
export type User = {
    email: string;
    name: string;
    gender: string;
    id: number;
    status: string;
    token: string;
    role: string
};

type LoginPayloadType = Pick<LoginPayload, "email" | "password">;

type UserContextType = {
    user: User | null;
    login: (userData: LoginPayloadType) => Promise<User>;
    logout: () => void;
    isAuthenticated: boolean;
    categories?: CategoryResponse["categories"]
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [categories, setcategories] = useState<CategoryResponse["categories"]>([])
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const login = async (userData: LoginPayloadType) => {
        // API returns full response
        const response = await loginUser(userData);
        // Extract only needed fields
        const userInfo: User = {
            token: response.token,
            email: response.email,
            name: response.name,
            gender: response.gender,
            id: response.id,
            status: response.status,
            role: response.role
        };
        setIsAuthenticated(true)
        localStorage.setItem("token", userInfo.token);
        localStorage.setItem("userData", JSON.stringify(userInfo))
        setUser(userInfo);
        setIsAuthenticated(true);
        return userInfo;
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, []);

    async function getCetegory() {
        let categories = await getAllCategory()
        setcategories(categories.categories)
    }

    useEffect(() => {
        getCetegory()
    }, [])

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
    };

    return (
        <UserContext.Provider value={{ user, login, logout, categories, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};
