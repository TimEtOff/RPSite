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
            Bienvenue sur le site officiel <Link href="/character">Astrauworld</Link>
          </h1>

          <p className={styles.description}>
            Le site est encore en <code>construction</code>, jugez pas
          </p>
        </AnimatedGradient>

        <div className={styles.grid}>
          <a href="https://github.com/AstrauworldMC/launcher/wiki" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
    </Layout>
  );
}