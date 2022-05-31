import type { NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

import styles from '../styles/Home.module.css'

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
