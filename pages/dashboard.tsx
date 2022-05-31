import Head from "next/head"
import { useAuth } from "../contexts/AuthContext"

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth()

    return(
        <div>
            <Head>
                <title>Dashboard </title>
                <meta name="description" content="Auth with nextjs and backend" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>Hello word - dashboard</h1>
            <h2>{user?.email}</h2>
        </div>
    )
}