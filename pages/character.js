import Head from "next/head";
import AnimatedGradient from "../components/animated-gradient";
import Layout from "../components/layout";
import styles from "../styles/character.module.css"
import styles2 from '../styles/Home.module.css';
import Link from "next/link";
import dynamic from "next/dynamic";
import { Character } from "@/components/character/character";
import { setCookie, getCookie, hasCookie } from 'cookies-next';
const CharacterList = dynamic(() => import('../components/character-list'), { ssr: false })

var json;
var characters;

// function getCharacters(id) {
//     return fetch((/*process.env.URL + */'http://localhost:3002/api/character/get-characters'), {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id }),
//     });
// }

// export async function getServerSideProps() {
//     console.log("getServerSideProps page")
// 
// //    setCookie('id', 'CjLPe8w8ls')
//     var id = getCookie('id');//  -> !hasCookie('id')
// //    var id = "CjLPe8w8ls";
//     console.log(id);
// 
//     if (id === "" || id == undefined) {
//         characters = [{id: "null", characterId: "null", character: new Character("Non", "connecté").toString()}]
//     } else {
//         // Call an external API endpoint to get posts
//         json = await (await getCharacters(id)).json();
//         characters = json.characters;
//     }
//    
//     // By returning { props: { posts } }, the Blog component
//     // will receive `posts` as a prop at build time
//     return {
//       props: {
//         characters,
//       },
//     }
// }

export default function CharacterPage() {

    function getCharacters(id) {
        return fetch('/api/character/new-character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });
    }

    function test() {
        var json;
        var characters = [];
        var updated = false;
        console.log("Début");

     //    setCookie('id', 'CjLPe8w8ls')
        var id = getCookie('id');//  -> !hasCookie('id')
     //    var id = "CjLPe8w8ls";
        console.log(id);

        if (id === "" || id == undefined) {
            characters = [{id: "null", characterId: "null", character: new Character("Non", "connecté").toString()}]
        } else {
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
    return characters;

    }

    function getDivs() {
        var characters = test();
        return characters.map((character) => {
            return (
            <div key={character.characterId} className={styles.character} suppressHydrationWarning>
                <p suppressHydrationWarning>
                    {Character.getFromString(character.character).getFullName()}
                </p>
            </div>
            )
        })
    }

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

                <div className={styles.characters} suppressHydrationWarning>
                    <CharacterList />
                </div>
            </main>
        </Layout>
    )
}