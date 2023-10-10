import Head from 'next/head';
import Link from 'next/link';
import AnimatedGradient from '../components/animated-gradient';
import Layout from '../components/layout';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Acceuil - JDR</title>
      </Head>

      <main>
        <AnimatedGradient>
          <h1 className={styles.title}>
            Bienvenue sur le site
          </h1>

          <h1 className={styles.title}>
            de l'atelier JDR
          </h1>
        </AnimatedGradient>

        <div className={styles.grid}>
          <Link href="/character" className={styles.card}>
            <h3>Personnages &rarr;</h3>
            <p>Créez des personnages utilisables en jeu.</p>
          </Link>

          <Link href="/games" className={styles.card}>
            <h3>Parties &rarr;</h3>
            <p>Gérez des parties de JDR, en développement.</p>
          </Link>

          <Link href="https://github.com/TimEtOff/RPSite" className={styles.card}>
            <h3>GitHub &rarr;</h3>
            <p>
              Tout le code du site en open-source.
            </p>
          </Link>
        </div>
      </main>
    </Layout>
  );
}