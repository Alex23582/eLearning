"use client"
import styles from './layout.module.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function Kurse({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { kurs: string }
}>) {
    const pathname = usePathname()
    const [coursename, setcoursename] = useState("")

    useEffect(() => {
        init()
    }, [])

    async function init() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/getCourseInfo/${params.kurs}`, {
            method: "GET",
            credentials: 'include'
        })
        const data = await response.json()
        setcoursename(data.name)
    }

    let displayNavbar = (pathname.endsWith("/info") || pathname.endsWith("/hausaufgaben") || pathname.endsWith("/faq"))

    return (
        <>
            <main className={styles.main}>
                {displayNavbar && <Link className={styles.backlink} href="/kurse">&#8617; Zurück zu meinen Kursen</Link>}
                <div className={styles.titlecontainer}>
                    <div className={styles.glow} />
                    <h2 className={styles.title}>{coursename}</h2>
                </div>
                {displayNavbar && <div className={styles.navbar}>
                    <Link className={`${styles.navbutton} ${pathname === `/kurse/${params.kurs}/info` ? styles.activenavbutton : ""}`} href={`/kurse/${params.kurs}/info`}>Infos</Link>
                    <Link className={`${styles.navbutton} ${pathname === `/kurse/${params.kurs}/hausaufgaben` ? styles.activenavbutton : ""}`} href={`/kurse/${params.kurs}/hausaufgaben`}>Hausaufgaben</Link>
                    <Link className={`${styles.navbutton} ${pathname === `/kurse/${params.kurs}/faq` ? styles.activenavbutton : ""}`} href={`/kurse/${params.kurs}/faq`}>Fragen & Antworten</Link>
                </div>}
                {children}
            </main>
        </>
    )
}