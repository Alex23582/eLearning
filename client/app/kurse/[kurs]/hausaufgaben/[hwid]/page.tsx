"use client"
import { useEffect, useState } from 'react'
import styles from './page.module.css'
import { Montserrat } from "next/font/google";
import Link from 'next/link';
import UploadWindow from '@/components/UploadWindow';
const montserrat = Montserrat({ subsets: ["latin"] });

type files = { name: string, time: string }

export default function Homework({ params }: { params: { hwid: string, kurs: string } }) {
    const [hwInfo, setHwInfo] = useState<{ title: string, submittext: string, description: string, created: string, createdT: string, expiry: string, expiryT: string, shortname: string, teacher: string, files: files[], sentfiles: files[] }>()
    const [submitted, setsubmitted] = useState(false)
    const [submitTextBox, setsubmitTextBox] = useState("")

    useEffect(() => {
        init()
    }, [])

    async function init() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/getHomework`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                hwid: params.hwid,
                courseid: params.kurs
            }),
            credentials: 'include'
        })
        const data = await response.json()
        console.log(data)
        setHwInfo(data)
        if (data.submittext) {
            setsubmitted(true)
            setsubmitTextBox(data.submittext)
        }
    }

    async function submit() {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/submitHomework`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                hwid: params.hwid,
                submittext: submitTextBox
            }),
            credentials: 'include'
        })
        setsubmitted(true)
    }


    if (!hwInfo) {
        return <h1>Loading</h1>
    }

    return (
        <>
            <Link className={styles.backlink} href={`/kurse/${params.kurs}/hausaufgaben/`}>&#8617; Zurück</Link>
            <div className={styles.topbar}>
                <p className={styles.teacherbox}>Lehrkraft: {hwInfo.teacher}</p>
                <h3>{hwInfo.title}</h3>
                <div className={styles.timeinfoboxcontainer}>
                    <div className={styles.timebox}>
                        <p>Start</p>
                        <p>{hwInfo.created}<br />{hwInfo.createdT}</p>
                    </div>
                    <div className={styles.timebox}>
                        <p>Abgabe</p>
                        <p>{hwInfo.expiry}<br />{hwInfo.expiryT}</p>
                    </div>
                </div>
            </div>
            <div className={styles.main}>
                <p className={styles.desc}>{hwInfo.description}</p>
                <h4 className={styles.submittitle}>Abgabe</h4>
                <div className={styles.files}>
                    <p className={styles.hint}>Angehängte Dateien</p>
                    {hwInfo.files.map((file, i) => {
                        return <Link target='__blank' key={i} href={`${process.env.NEXT_PUBLIC_BACKEND}/file/${params.hwid}/0/${encodeURIComponent(file.name)}`} className={styles.filecontainer}>
                            <p>{file.name}</p>
                            <p className={styles.filetime}>{file.time}</p>
                        </Link>
                    })}
                </div>
                <UploadWindow hwid={params.hwid} files={hwInfo.sentfiles} />
                <textarea value={submitTextBox} onChange={(e) => { setsubmitTextBox(e.target.value) }} className={`${styles.submittext} ${montserrat.className}`} placeholder='Textanhang'></textarea>
                <div className={styles.buttonscontainer}>
                    <button className={montserrat.className}>Frage stellen</button>
                    <button onClick={submit} className={montserrat.className}>{submitted ? "Update" : "Speichern"}</button>
                </div>
            </div>
        </>
    )
}