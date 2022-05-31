import axios, { AxiosError } from "axios";
import { setCookie, parseCookies } from 'nookies'

let cookies = parseCookies()

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    // headers: {
    //     Authorization: `Bearer ${cookies['nextauth.token']}`
    // }
})

api.defaults.headers.common['Authorization'] = `Bearer ${cookies['nextauth.token']}`

api.interceptors.response.use(response => {
    return response
}, (error) => {
    if (error.response?.status === 401) {        
        if (error.response.data.code === 'token.expired') {
            //renovar o token
            cookies = parseCookies()

            const { 'nextauth.refreshToken': refreshToken } = cookies

            api.post('/refresh', {
                refreshToken
            }).then(response => {
                const { token } = response.data
                console.log(token)

                setCookie(undefined, 'nextauth.token', token, {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/'
                })

                setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/'
                })                

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            })

        } else {
            // deslogar o usuário
        }
    }
})