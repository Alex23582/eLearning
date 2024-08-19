import { DragEvent, useState } from 'react'
import styles from './UploadWindow.module.css'
import Link from 'next/link';

const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export default function UploadWindow({ hwid, files }: { hwid: string, files: { name: string, time: string }[] }) {
    const [currentFiles, setcurrentFiles] = useState(files)
    const [dragActive, setdragActive] = useState(false)
    const [loading, setloading] = useState(false)

    async function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setloading(true)
        setdragActive(false)
        let files = []
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const file = e.dataTransfer.files[i]
            files.push({
                name: file.name,
                data: await toBase64(file)
            })
        }

        const newFiles = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/uploadFile/${hwid}`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                files,
            }),
            credentials: 'include'
        })).json()
        setcurrentFiles(newFiles)
        setloading(false)
    };

    return (
        <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setdragActive(true) }} onDragLeave={() => { setdragActive(false) }} className={`${styles.files} ${styles.secondfiles} ${dragActive ? styles.dragactive : ""}`}>

            {!loading && <>
                <p className={styles.hint}>Hochgeladene Dateien</p>
                {currentFiles.length == 0 && <p className={`${styles.hint} ${styles.centerhint}`}>Dateien hier reinziehen um hochzuladen</p>}
                {currentFiles.map((file, i) => {
                    return <Link target='__blank' key={i} href={`${process.env.NEXT_PUBLIC_BACKEND}/file/${hwid}/1/${encodeURIComponent(file.name)}`} className={styles.filecontainer}>
                        <p>{file.name}</p>
                        <p className={styles.filetime}>{file.time}</p>
                    </Link>
                })}
            </>}
            {loading && <div className={styles.loader}>
                <div className={`loader`} />
                <p>Hochladen</p>
            </div>}
        </div>
    )
}