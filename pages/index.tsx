import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import { parseCookies } from 'nookies'
import { FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

import styles from '../styles/Home.module.css'
import { WithSSRGuest } from '../utils/withSSRGuest'

const Home: NextPage = () => {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignIn(event: FormEvent) {
    event.preventDefault()

    const data = {
      email,
      password
    }

    console.log(data)
    await signIn(data)
  }

  return (
    <form onSubmit={handleSignIn} className={styles.container}>
      <Head>
        <title>SignIn with nextjs </title>
        <meta name="description" content="Auth with nextjs and backend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button type='submit'>SignIn</button>
    </form>
  )
}

export default Home

export const getServerSideProps = WithSSRGuest(async (ctx) => {
  return {
    props: {}
  }  
})
