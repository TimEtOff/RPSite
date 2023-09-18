import Head from "next/head";
import AnimatedGradient from "../components/animated-gradient";
import Layout from "../components/layout";
import styles from "../styles/character.module.css"
import styles2 from '../styles/Home.module.css';
import Link from "next/link";
import cookieCutter from "cookie-cutter"

export default function CharacterPage() {

    var json;
    var characters;

/*    async function getCharacters() {

        var response = await fetch('http://localhost:3002/pages/api/character/new-character', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: "CjLPe8w8ls" }),
        });

        var newjson = await response.json();

        console.log(newjson.message);
        console.log(newjson.characters);
        json = newjson;

    } */

    function getCharacters() {
        return fetch('/api/character/new-character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: "CjLPe8w8ls" }),
        });
    }

    function test() {
        var updated = false;
        console.log("Début");

        (async function(){
            json = await (await getCharacters()).json();
            console.log("Milieu");
            
            updated = true;
        })()

        setTimeout(function(){
            if (updated) {
                console.log(json);
                characters = json.characterId;
                console.log(characters);
                console.log("Fin");
            }
        }, 2000)
        

    }

    

    /*
    {characters.map((character) => {
                        return (<div>{}</div>)
                    })
                    }
    */
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
                    <button onClick={test}>TEEEEEEEEEEST PTN</button>
                    
                </div>
            </main>
        </Layout>
    )
}