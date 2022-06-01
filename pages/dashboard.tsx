import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { WithSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
    const { user } = useAuth()

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

export const getServerSideProps = WithSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/me')
    console.log(response.data)

    return {
        props: {}
    }
})