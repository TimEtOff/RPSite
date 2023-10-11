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
import Input from "@/components/input";
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

    const regexPattern = "[0\-9a\-zA\-Z&À\-ÖÙ\-ÿ\\-\\.°~#œŒ ]"

    const [ needReload, setNeedReload ] = useState(false);

    const [ editedGame, setEditedGame ] = useState(null);
    const [ completeGameEdit, setCompleteGameEdit ] = useState(false);
    const [ editedCharacter, setEditedCharacter ] = useState(null);
    const [ availableCharacters, setAvailableCharacters ] = useState(null);

    function editGame(gameData) {
        return function (e) {
            setEditedGame(gameData);
            setEditedCharacter(null);
            setCompleteGameEdit(true);
        }
    }

    function addCharacter(gameData) {
        return function (e) {
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
                setEditedGame(gameData);
            })

            Router.push({
                pathname: '/games',
                query: { chooseCharacter: 'y' }
              }, 
              undefined, { shallow: true }
            )
        }
    }

    function editCharacter(characterData, editedGame) {
        return function (e) {
            setEditedGame(editedGame);
            setEditedCharacter(characterData);
            setCompleteGameEdit(true);
        }
    }

    function reset() {
        setEditedGame(null);
        setEditedCharacter(null);
        setCompleteGameEdit(false);
    }

    function onClose() {
        setAvailableCharacters(null);
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

    function handleSubmitGame(e) {
        e.preventDefault();

        if (!hasCookie('id')) {
            alert("Vous n'êtes pas connecté");
            return;
        }

        fetch('/api/games/update-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedGame),
        }).then((res) => {
            alert("Partie \"" + editedGame.name + "\" sauvegardé")
            Router.push({
                pathname: '/games'
              }, 
              undefined, { shallow: true }
            )
            setNeedReload(!needReload);
        })
        
    }

    function getForm() {
        if (completeGameEdit) {

            if (editedCharacter != null) {
                // When a character is edited
                return (
                    <h1>Character ({Character.getFromString(editedCharacter.character).getFullName()})</h1>
                )
            } else {
                // When the game is edited
                return (
                    <form onSubmit={handleSubmitGame}>
                        <div className={styles.name} style={{display:"grid", gridTemplateRows:"repeat(2, auto)", height:"auto", }}>
                            <div className="tw-flex">
                                <div className={styles.inputBox} style={{marginBottom:"20px"}}>
                                    <Input type="text" name="name"
                                        value={editedGame.name} regpattern={regexPattern}
                                        onChange={e => setEditedGame({...editedGame, name:e.target.value})}
                                    />
                                    <label>
                                        Nom
                                    </label>
                                </div>

                                <div className={styles.inputBox} style={{width:"25%", marginBottom:"20px", borderBottom:"0"}}>
                                    <Input type="text" name="gameId"
                                        value={editedGame.gameId} readOnly
                                    />
                                    <label>
                                        ID à partager
                                    </label>
                                </div>
                            </div>

                            <div className="tw-flex">
                                <div className={styles.inputBox} style={{width:"35%"}}>
                                    <Input type="text" name="specialCat1"
                                        value={editedGame.specialCat1} regpattern={regexPattern}
                                        onChange={e => setEditedGame({...editedGame, specialCat1:e.target.value})}
                                    />
                                    <label>
                                        Catégorie spéciale 1
                                    </label>
                                </div>

                                <div className={styles.inputBox} style={{width:"35%"}}>
                                    <Input type="text" name="specialCat2"
                                        value={editedGame.specialCat2} regpattern={regexPattern}
                                        onChange={e => setEditedGame({...editedGame, specialCat2:e.target.value})}
                                    />
                                    <label>
                                        Catégorie spéciale 2
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-9 tw-mt-1">
                            Sauvegarder
                        </button>
                    </form>
                )
            }
            
        } else {
            // When nothing is edited
            return (
                <h1 className="tw-text-center tw-text-xl" style={{paddingTop:"47%", margin:0}}
                >Veillez sélectionner un élément à éditer</h1>
            )
        }
    }

    return (
        <Layout>
            <Head>
                <title>Parties gérées - JDR</title>
            </Head>

            <main>
            
                <Dialog title="Ajouter un personnage" onClose={onClose} disableOkButton={true} searchParam="chooseCharacter">
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
                            reset={reset}
                            needReload={needReload}/>
                    </div>

                    <div className={styles.characterForm} suppressHydrationWarning>
                        {getForm()}
                    </div>
                </div>
            </main>
        </Layout>
    )
}