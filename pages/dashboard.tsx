import Head from "next/head"
import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        api.get('/me')
            .then(response => console.log(response))
            .catch((err) => console.log(err) )
    }, [])

    return(
        <div>
            <Head>
                <title>Dashboard </title>
                <meta name="description" content="Auth with nextjs and backend" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>dashboard</h1>
            <h2>{user?.email}</h2>
        </div>
    )
}