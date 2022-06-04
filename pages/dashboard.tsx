import { GetServerSidePropsContext } from "next"
import Head from "next/head"
import { destroyCookie } from "nookies"
import { useEffect } from "react"
import { moveMessagePortToContext } from "worker_threads"
import { Can } from "../components/Can"
import { useAuth } from "../contexts/AuthContext"
import { useCan } from "../hooks/useCan"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import { WithSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
    const { user } = useAuth()

    const userCanSeeMetrics = useCan({
        permissions: ['metrics.list'],
        roles: ['administrator', 'editor']
    })

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

            <h1>dashboard: {user?.email}</h1>
            
            { userCanSeeMetrics && <div>Métricas</div>}

            <Can permissions={['metrics.list']}>
                <div>Métricas component</div>
            </Can>
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