import Head from "next/head"
import { setupAPIClient } from "../services/api"
import { WithSSRAuth } from "../utils/withSSRAuth"

export default function Metrics() {
    return(
        <div>
            <Head>
                <title>Metrics</title>
                <meta name="description" content="Auth with nextjs and backend" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>Métricas</h1>
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
}, {
    permissions: ['metrics.list'],
    roles: ['administrator']
})