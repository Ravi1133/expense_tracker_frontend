import { createContext, useState, type ReactNode } from "react";
import { loginUser } from "../api/api";
import type { LoginPayload } from "../api/apiTypes";
type User = {
    name: string;
    password:string;
    email: string;
    token: string; // or any auth token
};
type UserContextType = {
    user: User | null;
    login: (userData: Pick<User,"email"|"password">) => void;
    logout: () => void;
    isAuthenticated: boolean;
};
type LoginPayloadType=Pick<User,"email"|"password">
export const UserContext = createContext<UserContextType|undefined>(undefined)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user,setUser]=useState<User|null>(null)
    const [isAuthenticated,setisAuthenticated]=useState(false)
    const login=async(userData:LoginPayloadType)=>{
        let response= await loginUser(userData)
        return response
    }
    const logout=async()=>{
       
    }

    return (
        <UserContext.Provider value={{user,login,logout,isAuthenticated}}>
            {children}
        </UserContext.Provider>
    ) 
}