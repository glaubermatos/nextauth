import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password
            })
            
            console.log(response.data)
    
            setIsAuthenticated(true)
        } catch(error) {
            console.log(error)
        }        
    }

    return (
        <AuthContext.Provider value={{
            signIn,
            isAuthenticated
        }}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    return context
} 