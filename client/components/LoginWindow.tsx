"use client"
import { useState } from 'react';
import styles from '../app/page.module.css'
import { Montserrat } from "next/font/google";
import { useRouter } from 'next/navigation'

const montserrat = Montserrat({ subsets: ["latin"] });

export default function LoginWindow() {
  const router = useRouter()

  const [errorMessage, seterrorMessage] = useState("")
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")

  async function login() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    const data = await response.json()
    if(data.error){
      seterrorMessage(data.error)
    }
    if(data.session){
      document.cookie = "session=" + data.session;
      router.push('/kurse')
    }
  }

  return (
    <div className={styles.form}>
      <div className={styles.pair}>
        <p>username</p>
        <input value={username} onKeyDown={(e) => {if(e.key == "Enter"){login()}}} onChange={(e) => { setusername(e.target.value) }} className={montserrat.className} />
      </div>
      <div className={styles.pair}>
        <p>passwort</p>
        <input value={password} onKeyDown={(e) => {if(e.key == "Enter"){login()}}} onChange={(e) => { setpassword(e.target.value) }} type='password' className={montserrat.className} />
      </div>
      {errorMessage && <p style={{color: "#F46767"}}>{errorMessage}</p>}
      <button onClick={login} className={montserrat.className}>Login</button>
    </div>
  )
}