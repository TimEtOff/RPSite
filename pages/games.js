import Head from "next/head";
import { useState, useEffect } from 'react'
import AnimatedGradient from "../components/animated-gradient";
import Layout from "../components/layout";
import styles from "../styles/character.module.css"
import styles2 from '../styles/Home.module.css';
import stylesList from '../styles/components/character-list.module.css';
import Link from "next/link";
import dynamic from "next/dynamic";
import { Character } from "@/components/character/character";
import { getCookie, hasCookie } from "cookies-next";
import { Ability } from "@/components/character/ability";
import { AbilityCategory } from "@/components/character/ability-category";
import GamesList from "@/components/games-list";
import Dialog from "@/components/dialog";
import Router from "next/router";
const CharacterList = dynamic(() => import('../components/character-list'), { ssr: false })

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export default function GamesPage() {

    const regexPattern = "[0\-9a\-zA\-Z&À\-ÖÙ\-ÿ\\-\\.°~#œŒ]"

    const [ editedGame, setEditedGame ] = useState(null);
    const [ editedCharacter, setEditedCharacter ] = useState(null);
    const [ availableCharacters, setAvailableCharacters ] = useState(null);

    function editGame(gameData) {
        return function (e) {
            console.log(gameData);
        }
    }

    function addCharacter(gameData) {
        return function (e) {
            setEditedGame(gameData);

            fetch('/api/games/get-available-characters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: getCookie('id'), gameId: gameData.gameId }),
            })
            .then((res) => res.json())
            .then((json) => {
                setAvailableCharacters(json.characters);
            })

            Router.push({
                pathname: '/games',
                query: { showDialog: 'y' }
              }, 
              undefined, { shallow: true }
            )
        }
    }

    function editCharacter(characterData, editedGame) {
        return function (e) {
            setEditedGame(editedGame);
            setEditedCharacter(characterData);
            console.log("// TODO Edit character");
        }
    }

    function reset() {
        return function (e) {
            setEditedGame(null);
            setEditedCharacter(null)
        }
    }

    function onClose() {
        setAvailableCharacters(null);
        setEditedGame(null);
        Router.push({
            pathname: '/games'
          }, 
          undefined, { shallow: true }
        )
    }

    function chooseCharacter(character) {
        return function (e) {
            var characters = editedGame.characters;
            characters.push({
                id: character.id,
                characterId: character.characterId + "-" + makeid(4),
                userName: character.userName,
                luck: 0,
                character: character.character,
                inventory: []
            });

            fetch('/api/games/update-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: getCookie('id'),
                    gameId: editedGame.gameId,
                    name: editedGame.name,
                    specialCat1: editedGame.specialCat1,
                    specialCat2: editedGame.specialCat2,
                    characters: characters
                }),
            })

            onClose();
        }
    }

    return (
        <Layout>
            <Head>
                <title>Parties gérées - JDR</title>
            </Head>

            <main>
            
                <Dialog title="Ajouter un personnage" onClose={onClose} disableOkButton={true}>
                    {availableCharacters?.map((character) => {
                        return (
                            <div key={character.characterId} className={stylesList.character} suppressHydrationWarning>
                                <h1 style={{paddingTop:8}}>
                                    {Character.getFromString(character.character).getFullName()}
                                    <p className="tw-text-sm tw-text-neutral-400" style={{lineHeight: 1.2}}><i>par {character.userName}</i></p>
                                </h1>
                
                                <ul>
                                    <li>
                                        <button onClick={chooseCharacter(character)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-my-3">
                                            Choisir
                                        </button>
                                    </li>
                
                                </ul>
                            </div>
                        )
                    })}
                </Dialog>

                <AnimatedGradient>
                    <h1 className={styles.title}>
                        Parties gérées
                    </h1>

                    <p className={styles2.description}>
                        Jouez et modifiez vos parties crées
                    </p>
                </AnimatedGradient>

                <div className="height:80vh tw-container">
                    <div className={styles.characters} suppressHydrationWarning>
                        <GamesList 
                            editGame={editGame} 
                            addCharacter={addCharacter} 
                            editCharacter={editCharacter}
                            reset={reset}/>
                    </div>

                    <div className={styles.characterForm} suppressHydrationWarning>
                        
                    </div>
                </div>
            </main>
        </Layout>
    )
}