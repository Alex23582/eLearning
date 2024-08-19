"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { Montserrat } from "next/font/google";
import Link from 'next/link';
const montserrat = Montserrat({ subsets: ["latin"] });

export default function Hausaufgaben({ params }: { params: { kurs: string } }) {
    const [homeworklist, sethomeworklist] = useState<{ uuid: string, title: string, description: string, created: string, createdT: string, expiry: string, expiryT: string }[]>([])

    useEffect(() => {
        init()
    }, [])

    async function init() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/getHomeworkList/${params.kurs}`, {
            method: "GET",
            credentials: 'include'
        })
        const data = await response.json()
        sethomeworklist(data.homeworks)
    }

    const [filtertype, setfiltertype] = useState(0)
    return (
        <div className={styles.main}>
            <div className={styles.searchbar}>
                <input className={montserrat.className} placeholder='Aufgaben suchen' />
                <div className={styles.buttons}>
                    <button className={`${montserrat.className} ${filtertype == 0 ? styles.activeFilterButton : ""}`}>Offen</button>
                    <button className={`${montserrat.className} ${filtertype == 1 ? styles.activeFilterButton : ""}`}>Alle</button>
                </div>
            </div>
            <div className={styles.homeworkcontainer}>
                {homeworklist.map((hw, i) => {
                    return <Link href={`hausaufgaben/${hw.uuid}`} className={styles.homeworkbox} key={i}>
                        <div>
                            <h3>{hw.title}</h3>
                            <p className={styles.hwdescbox}>{hw.description}</p>
                        </div>
                        <div className={styles.datescontainer}>
                            <div className={styles.datecontainer}>
                                <h3>Start</h3>
                                <p>{hw.created}</p>
                                <p>{hw.createdT}</p>
                            </div>
                            <div className={styles.datecontainer}>
                                <h3>Abgabe</h3>
                                <p>{hw.expiry}</p>
                                <p>{hw.expiryT}</p>
                            </div>
                        </div>
                    </Link>
                })}
            </div>
        </div>
    )
}