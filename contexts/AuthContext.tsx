import { useRouter } from "next/router";
import { setCookie } from 'nookies'
import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    isAuthenticated: boolean;
    user: User;
}

const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const router = useRouter()
    const [user, setUser] = useState<User>()

    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password
            })
            
            const { token, refreshToken, permissions, roles } = response.data

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //30 days
                path: '/'
            })
            setCookie(undefined, 'nextauth.refreshTooken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, //30 days
                path: '/'
            })

            setUser({
                email,
                permissions,
                roles
            })

            router.push('/dashboard')

        } catch(error) {
            console.log(error)
        }        
    }

    return (
        <AuthContext.Provider value={{
            signIn,
            isAuthenticated,
            user
        }}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    return context
} 