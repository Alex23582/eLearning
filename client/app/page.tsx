import LoginWindow from '@/components/LoginWindow';
import styles from './page.module.css'

const grundsaetze = [
  {
    "titel": "Hausaufgaben",
    "beschreibung": "Bitte mache deine Hausaufgaben regelmäßig und so gut du kannst. Wir schauen, dass du sie zuverlässig erledigst."
  },
  {
    "titel": "Sorgfalt",
    "beschreibung": "Versuche, deine Aufgaben genau und ordentlich zu bearbeiten. Deine Mühe wird gesehen und zählt."
  },
  {
    "titel": "Mitarbeit",
    "beschreibung": "Es ist wichtig, dass du im Unterricht aktiv mitmachst. Du kannst Fragen stellen oder gut zuhören – beides zählt!"
  },
  {
    "titel": "Selbstständigkeit",
    "beschreibung": "Probiere, Aufgaben so gut wie möglich alleine zu lösen. Auch wenn du Hilfe brauchst, zählt jeder Versuch."
  },
  {
    "titel": "Anstrengung",
    "beschreibung": "Wir achten darauf, wie sehr du dich bemühst, auch wenn etwas schwierig ist. Anstrengung ist genauso wichtig wie das Ergebnis."
  },
  {
    "titel": "Fragen",
    "beschreibung": "Trau dich, Fragen zu stellen, wenn du etwas nicht verstehst. Das zeigt, dass du Interesse am Lernen hast."
  },
  {
    "titel": "Pünktlichkeit",
    "beschreibung": "Sei pünktlich im Unterricht und erledige deine Aufgaben zuverlässig. Das hilft dir und der ganzen Klasse."
  },
  {
    "titel": "Soziales Verhalten",
    "beschreibung": "Sei freundlich und hilfsbereit zu deinen Mitschülern und Lehrern. Guter Umgang miteinander ist uns wichtig."
  },
  {
    "titel": "Materialien",
    "beschreibung": "Gehe sorgfältig mit deinen Sachen und unseren Unterrichtsmaterialien um. So hast du immer alles, was du brauchst."
  },
  {
    "titel": "Durchhaltevermögen",
    "beschreibung": "Zeig, dass du auch bei längeren Aufgaben nicht aufgibst. Ausdauer ist wichtig und wird von uns belohnt."
  },
  {
    "titel": "Respekt",
    "beschreibung": "Behandle deine Mitschüler und Lehrer mit Respekt. Eine respektvolle Atmosphäre ist wichtig für ein gutes Lernumfeld."
  },
  {
    "titel": "Verantwortung",
    "beschreibung": "Übernimm Verantwortung für dein Handeln und deine Aufgaben. Zeig, dass du zuverlässig und vertrauenswürdig bist."
  }
]

export default function Home() {
  return (
    <>
      <h1>Herzlich Willkommen</h1>
      <div className={styles.main}>
        <div className={styles.box}>
          <p>Aktuelles</p>
          <div className={styles.bar} />
        </div>
        <div className={styles.box}>
          <p>Lernplattform Login</p>
          <div className={styles.bar} />
          <LoginWindow />
        </div>
      </div>
      <h1>Mehr zur ABC</h1>
      <p>Lorem Ipsum</p>
      <h1>Bewertungsgrundsätze</h1>
      <div className={styles.grundsatze}>
        {grundsaetze.map((grundsatz, i) => {
          return <div className={styles.box} key={i}>
            <div>
              <p>{grundsatz.titel}</p>
              <div className={styles.bar} />
            </div>
            <p className={styles.boxdesc}>{grundsatz.beschreibung}</p>
          </div>
        })}
      </div>
    </>
  );
}
