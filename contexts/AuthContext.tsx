import { request } from "http";
import Router from "next/router";
import { setCookie, parseCookies } from 'nookies'
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
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
    user: User | undefined;
}

const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User>()

    const isAuthenticated = !!user;    

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()

        if (token) {
            api.get('/me').then((response) => {
                const { email, permissions, roles } = response.data
                setUser({ email, permissions, roles })
            })
        }
    }, [])

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

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            // api.interceptors.request.use(request => {
            //     request.headers = { 'Authorization': 'Bearer '+token}
            //     return request
            // })

            Router.push('/dashboard')

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