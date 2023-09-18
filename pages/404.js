import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import styles from '../styles/Home.module.css';
import AnimatedGradient from '../components/animated-gradient';

export default function Error404() {
    return (
        <Layout>
            <Head>
                <title>Erreur 404</title>
                <style>{`
                    p {
                        font-weight: bold;
                    }
                `}</style>
            </Head>

            <main>
                <AnimatedGradient>
                    <h1 className={styles.title}>
                        La page que vous cherchez n'a pas été trouvée (Erreur 404)
                    </h1>

                    <p className={styles.description}>
                        <Link href="/">Retour à la page d'acceuil</Link>
                    </p>
                </AnimatedGradient>
            </main>
        </Layout>

    )
}