import styles from './page.module.css'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers';
import Link from 'next/link'
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });


const getCookie = async (name: string) => {
    return cookies().get(name)?.value ?? '';
}

async function getCourses() {
    const data = await fetch(`${process.env.LOCAL_BACKEND}/courses`, {
        headers: {
            "cookie": "session=" + await getCookie("session")
        },
        cache: 'no-cache'
    }).then((res) =>
        res.json()
    )

    if(data.error){
        redirect("/")
    }

    return  data as Array<{name: string, description:string, id: string}>
}

export default async function Kurse() {
    const data = await getCourses()
    return (
        <>
            <h1>Meine Kurse</h1>
            <main className={styles.main}>
                {data.map((kurs, i) => {
                    return <div className={styles.box} key={i}>
                        <div className={styles.boxcontent}>
                            <p>{kurs.name}</p>
                            <div className={styles.bar} />
                            <p className={styles.kursdesc}>{kurs.description}</p>
                        </div>
                        <Link href={`/kurse/${kurs.id}/info`} passHref legacyBehavior ><a className={montserrat.className}>Zum Kurs</a></Link>
                    </div>
                })}
            </main>
        </>
    )
}