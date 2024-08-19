import type { Metadata } from "next";
import styles from './layout.module.css'
import { Montserrat } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "eLearning",
  description: "Example",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Link href="/" className={styles.title}><h2>ABC</h2></Link>
        <div className={styles.bar}>{[... Array(90)].map((_, i) => {
          return <p key={i}>ABC</p>
        })}</div>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}
