import Head from "next/head";
import AnimatedGradient from "../components/animated-gradient";
import Layout from "../components/layout";
import styles from "../styles/character.module.css"
import styles2 from '../styles/Home.module.css';
import Link from "next/link";
import { Character } from "@/components/character/character";
import { useCookies } from 'next-client-cookies';

// const cookies = useCookies();
var json;
var characters;

function getCharacters(id) {
    return fetch((/*process.env.URL + */'http://localhost:3002/api/character/get-characters'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
}

export async function getStaticProps() {
//    var id = cookies.get("id");
    var id = "CjLPe8w8ls";

    if (id === "") {
        characters = [{id: "null", characterId: "null", character: new Character("Non", "connecté").toString()}]
    } else {
        // Call an external API endpoint to get posts
        json = await (await getCharacters(id)).json();
        characters = json.characters;
    }
   
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
      props: {
        characters,
      },
    }
  }

export default function CharacterPage({ characters }) {

    return (
        <Layout>
            <Head>
                <title>Création du personnage - JDR</title>
            </Head>

            <main>
                <AnimatedGradient>
                    <h1 className={styles.title}>
                        Création du personnage
                    </h1>

                    <p className={styles2.description}>
                        Documentation <Link href="">ici</Link>
                    </p>
                </AnimatedGradient>

                <div className={styles.characters}>
                    {characters.map((character) => {
                            return (
                            <div key={character.characterId} className={styles.character}>
                                <p>
                                    {Character.getFromString(character.character).getFullName()}
                                </p>
                            </div>
                            )
                        })
                    }
                    
                </div>
            </main>
        </Layout>
    )
}