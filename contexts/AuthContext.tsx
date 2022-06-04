import { request } from "http";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/apiClient";

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
    signOut: () => void;
    isAuthenticated: boolean;
    user: User | undefined;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData)

// Connection to a broadcast channel
let authChannel: BroadcastChannel


export function signOut(broadcastMessage: boolean = true) {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    if (broadcastMessage) authChannel.postMessage('signOut')

    Router.push('/')
}

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;    

    useEffect(() => {
        authChannel = new BroadcastChannel('auth');
        authChannel.onmessage = message => { 
            switch (message.data) {
                case 'signOut':
                    const sendBroadcastMessage = true
                    signOut(!sendBroadcastMessage)
                    break;
            
                default:
                    break;
            }
        }

    }, [])

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()

        if (token) {
            api.get('/me')
                .then((response) => {
                    const { email, permissions, roles } = response.data
                    setUser({ email, permissions, roles })
                })
                .catch(() => {
                    signOut()
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
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
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
            signOut,
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