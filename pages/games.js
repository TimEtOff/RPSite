import Head from "next/head";
import { useState, useEffect } from 'react'
import AnimatedGradient from "../components/animated-gradient";
import Layout from "../components/layout";
import styles from "../styles/character.module.css"
import styles2 from '../styles/Home.module.css';
import stylesList from '../styles/components/character-list.module.css';
import stylesGame from '../styles/games.module.css'
import dynamic from "next/dynamic";
import { Character } from "@/components/character/character";
import { getCookie, hasCookie } from "cookies-next";
import GamesList from "@/components/games-list";
import Dialog from "@/components/dialog";
import Router from "next/router";
import Input from "@/components/input";

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
    const [ editedCharTab, setEditedCharTab ] = useState(0);
    // 0 -> general infos/level; 1 -> inventory; 2 -> injuries?

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
                level: 0,
                availablePoints: 0,
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

    function handleSubmitChar(e) {
        e.preventDefault();

        if (!hasCookie('id')) {
            alert("Vous n'êtes pas connecté");
            return;
        }

        var newChars = editedGame.characters;
        var i = 0;
        while (i != Object.entries(newChars).length) {
            var actualChar = newChars[i];
            if (editedCharacter.characterId == actualChar.characterId) {
                newChars[i] = editedCharacter;
                break;
            }
            i++;
        }

        setEditedGame({...editedGame, characters:newChars})

        fetch('/api/games/update-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedGame),
        }).then((res) => {
            alert("Partie \"" + editedGame.name + "\"/\"" + Character.getFromString(editedCharacter.character).getFullName() + "\" sauvegardé")
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
                    <>
                        <div className={stylesGame.infos}>
                            <h1>Personnage ({Character.getFromString(editedCharacter.character).getFullName()})</h1>
                            <div className={stylesGame.tabs}>
                                <button name={editedCharTab == 0 ? ("selected") : ("not")} onClick={() => setEditedCharTab(0)}>
                                    Général
                                </button>
                                <button name={editedCharTab == 1 ? ("selected") : ("not")} onClick={() => setEditedCharTab(1)}>
                                    Inventaire
                                </button>
                                <button name={editedCharTab == 2 ? ("selected") : ("not")} onClick={() => setEditedCharTab(2)}>
                                    Blessures
                                </button>
                            </div>
                        </div>

                        <hr/>

                        <div className="tw-mx-3 tw-my-2">
                            <form onSubmit={handleSubmitChar}>
                            {(() => {
                                switch (editedCharTab) {
                                    case 0:
                                        var character = Character.getFromString(editedCharacter.character)

                                        return (
                                            <div className=" tw-grid tw-grid-rows-3" style={{display:"grid", gridTemplateRows:"repeat(2, auto)"}}>
                                                <div className="tw-flex">
                                                    <div className={styles.inputBox} style={{width:"5rem", marginBottom:"1rem", marginTop:"2rem"}}>
                                                        <Input type="number" name="luck" min="1" max="6"
                                                            value={editedCharacter.luck} regpattern={regexPattern}
                                                            onChange={e => setEditedCharacter({...editedCharacter, luck:parseInt(e.target.value)})}
                                                        />
                                                        <label>
                                                            Chance
                                                        </label>
                                                    </div>

                                                    <div className={styles.inputBox} style={{width:"30rem", marginBottom:"1rem", marginTop:"2rem", borderBottom:"none"}}>
                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mt-4 tw-mr-4"
                                                            onClick={() => {editedCharacter.level > 0 ? (setEditedCharacter({...editedCharacter, level:parseInt(editedCharacter.level)-1, availablePoints:parseInt(editedCharacter.availablePoints)-1})) : (null)}}>
                                                            Diminuer
                                                        </button>
                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mt-4"
                                                            onClick={() => {
                                                                    setEditedCharacter({...editedCharacter, level:parseInt(editedCharacter.level)+1, availablePoints:parseInt(editedCharacter.availablePoints)+1})
                                                                }}>
                                                            Augmenter
                                                        </button>
                                                        <label style={{transform:"translateY(-90%)", left:"3.5%"}}>
                                                            Niveau ({editedCharacter.level} actuel)
                                                        </label>
                                                    </div>
                                                </div>

                                                <hr style={{marginLeft:"1.1rem", marginRight:"9rem", marginBottom:"0.75rem", marginTop:"1rem"}}/>

                                                <div key="abilities" className={styles.abilities}>
                                                    <div key="constitutionAbilities" className={styles.constCat}>
                                                        <div key="Constitution" className={styles.abilityMain}>
                                                            <input type="number" name="constitutionAbilitiesCatLevel" style={{width: 40}} min="0" max="13"
                                                                value={character.constitutionAbilities.categoryLevel} readOnly/> 
                                                            <label>Constitution</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.constitutionAbilities.categoryLevel = parseInt(character.constitutionAbilities.categoryLevel)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.constitutionAbilities.categoryLevel = parseInt(character.constitutionAbilities.categoryLevel)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Force" className={styles.ability}>
                                                            <input type="number" name="constitutionAbilities0Level" style={{width: 40}} min="0" max="13"
                                                                value={character.constitutionAbilities.abilities[0].level} readOnly/> 
                                                            <label>Force</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.constitutionAbilities.abilities[0].level = parseInt(character.constitutionAbilities.abilities[0].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.constitutionAbilities.abilities[0].level = parseInt(character.constitutionAbilities.abilities[0].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Resistance" className={styles.ability}>
                                                            <input type="number" name="constitutionAbilities1Level" style={{width: 40}} min="0" max="13"
                                                                value={character.constitutionAbilities.abilities[1].level} readOnly/> 
                                                            <label>Résistance</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.constitutionAbilities.abilities[1].level = parseInt(character.constitutionAbilities.abilities[1].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.constitutionAbilities.abilities[1].level = parseInt(character.constitutionAbilities.abilities[1].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <br/>

                                                    <div key="mentalAbilities" className={styles.mentCat}>
                                                        <div key="Mental" className={styles.abilityMain}>
                                                            <input type="number" name="mentalAbilitiesCatLevel" style={{width: 40}} min="0" max="13"
                                                                value={character.mentalAbilities.categoryLevel} readOnly/> 
                                                            <label>Mental</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.mentalAbilities.categoryLevel = parseInt(character.mentalAbilities.categoryLevel)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.mentalAbilities.categoryLevel = parseInt(character.mentalAbilities.categoryLevel)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Intellect" className={styles.ability}>
                                                            <input type="number" name="mentalAbilities0Level" style={{width: 40}} min="0" max="13"
                                                                value={character.mentalAbilities.abilities[0].level} readOnly/> 
                                                            <label>Intellect</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.mentalAbilities.abilities[0].level = parseInt(character.mentalAbilities.abilities[0].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.mentalAbilities.abilities[0].level = parseInt(character.mentalAbilities.abilities[0].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Eloquence" className={styles.ability}>
                                                            <input type="number" name="mentalAbilities1Level" style={{width: 40}} min="0" max="13"
                                                                value={character.mentalAbilities.abilities[1].level} readOnly/> 
                                                            <label>Éloquence</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.mentalAbilities.abilities[1].level = parseInt(character.mentalAbilities.abilities[1].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.mentalAbilities.abilities[1].level = parseInt(character.mentalAbilities.abilities[1].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <br/>

                                                    <div key="dexteriteAbilities" className={styles.dextCat}>
                                                        <div key="Dexterite" className={styles.abilityMain}>
                                                            <input type="number" name="dexteriteAbilitiesCatLevel" style={{width: 40}} min="0" max="13"
                                                                value={character.dexteriteAbilities.categoryLevel} readOnly/> 
                                                            <label>Déxtérité</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.dexteriteAbilities.categoryLevel = parseInt(character.dexteriteAbilities.categoryLevel)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.dexteriteAbilities.categoryLevel = parseInt(character.dexteriteAbilities.categoryLevel)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Agilite" className={styles.ability}>
                                                            <input type="number" name="dexteriteAbilities0Level" style={{width: 40}} min="0" max="13"
                                                                value={character.dexteriteAbilities.abilities[0].level} readOnly/> 
                                                            <label>Agilité</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.dexteriteAbilities.abilities[0].level = parseInt(character.dexteriteAbilities.abilities[0].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.dexteriteAbilities.abilities[0].level = parseInt(character.dexteriteAbilities.abilities[0].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Furtivite" className={styles.ability}>
                                                            <input type="number" name="dexteriteAbilities1Level" style={{width: 40}} min="0" max="13"
                                                                value={character.dexteriteAbilities.abilities[1].level} readOnly/> 
                                                            <label>Furtivité</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.dexteriteAbilities.abilities[1].level = parseInt(character.dexteriteAbilities.abilities[1].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.dexteriteAbilities.abilities[1].level = parseInt(character.dexteriteAbilities.abilities[1].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                    </div> 

                                                    <br/>

                                                    <div key="survieAbilities" className={styles.survCat}>
                                                        <div key="Survie" className={styles.abilityMain}>
                                                            <input type="number" name="survieAbilitiesCatLevel" style={{width: 40}} min="0" max="13"
                                                                value={character.survieAbilities.categoryLevel} readOnly/> 
                                                            <label>Survie</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.survieAbilities.categoryLevel = parseInt(character.survieAbilities.categoryLevel)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.survieAbilities.categoryLevel = parseInt(character.survieAbilities.categoryLevel)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Perception" className={styles.ability}>
                                                            <input type="number" name="survieAbilities0Level" style={{width: 40}} min="0" max="13"
                                                                value={character.survieAbilities.abilities[0].level} readOnly/> 
                                                            <label>Perception</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.survieAbilities.abilities[0].level = parseInt(character.survieAbilities.abilities[0].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.survieAbilities.abilities[0].level = parseInt(character.survieAbilities.abilities[0].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Savoir-faire" className={styles.ability}>
                                                            <input type="number" name="survieAbilities1Level" style={{width: 40}} min="0" max="13"
                                                                value={character.survieAbilities.abilities[1].level} readOnly/> 
                                                            <label>Savoir-faire</label>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.survieAbilities.abilities[1].level = parseInt(character.survieAbilities.abilities[1].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.survieAbilities.abilities[1].level = parseInt(character.survieAbilities.abilities[1].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div key="specialAbilities1" className={styles.spe1Cat}>
                                                        <div key="Special1Cat" className={styles.abilityMain}>
                                                            <input type="number" name="specialAbilities1CatLevel" style={{width: 40}} min="0" max="13"
                                                                value={character.specialAbilities1.categoryLevel} readOnly/> 
                                                            <input type="text" name="specialAbilities1CatName" size={13} className="tw-ml-3" readOnly
                                                                value={character.specialAbilities1.name}/>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities1.categoryLevel = parseInt(character.specialAbilities1.categoryLevel)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities1.categoryLevel = parseInt(character.specialAbilities1.categoryLevel)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Special0" className={styles.ability}>
                                                            <input type="number" name="specialAbilities1Ab0Level" style={{width: 40}} min="0" max="13"
                                                                value={character.specialAbilities1.abilities[0].level} readOnly/> 
                                                            <Input type="text" name="specialAbilities1Ab0Name" size={13} className="tw-ml-3" style={{background:"transparent"}}
                                                                value={character.specialAbilities1.abilities[0].name} regpattern={regexPattern} readOnly/>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities1.abilities[0].level = parseInt(character.specialAbilities1.abilities[0].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities1.abilities[0].level = parseInt(character.specialAbilities1.abilities[0].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Special1" className={styles.ability}>
                                                            <input type="number" name="specialAbilities1Ab1Level" style={{width: 40}} min="0" max="13"
                                                                value={character.specialAbilities1.abilities[1].level} readOnly/> 
                                                            <Input type="text" name="specialAbilities1Ab1Name" size={13} className="tw-ml-3" style={{background:"transparent"}}
                                                                value={character.specialAbilities1.abilities[1].name} regpattern={regexPattern} readOnly/>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities1.abilities[1].level = parseInt(character.specialAbilities1.abilities[1].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities1.abilities[1].level = parseInt(character.specialAbilities1.abilities[1].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Special2" className={styles.ability}>
                                                            <input type="number" name="specialAbilities1Ab2Level" style={{width: 40}} min="0" max="13"
                                                                value={character.specialAbilities1.abilities[2].level} readOnly/> 
                                                            <Input type="text" name="specialAbilities1Ab2Name" size={13} className="tw-ml-3" style={{background:"transparent"}}
                                                                value={character.specialAbilities1.abilities[2].name} regpattern={regexPattern} readOnly/>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities1.abilities[2].level = parseInt(character.specialAbilities1.abilities[2].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities1.abilities[2].level = parseInt(character.specialAbilities1.abilities[2].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div key="specialAbilities2" className={styles.spe2Cat}>
                                                        <div key="specialAbilities2" className={styles.abilityMain}>
                                                            <input type="number" name="specialAbilities2CatLevel" style={{width: 40}} min="0" max="13"
                                                                value={character.specialAbilities2.categoryLevel} readOnly/> 
                                                            <input type="text" name="specialAbilities2CatName" size={13} className="tw-ml-3" readOnly
                                                                value={character.specialAbilities2.name}
                                                                onChange={e => editAbiltyCatName(setSpecialAbilities2, specialAbilities2, e)}/>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities2.categoryLevel = parseInt(character.specialAbilities2.categoryLevel)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities2.categoryLevel = parseInt(character.specialAbilities2.categoryLevel)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Special0" className={styles.ability}>
                                                            <input type="number" name="specialAbilities2Ab0Level" style={{width: 40}} min="0" max="13"
                                                                value={character.specialAbilities2.abilities[0].level} readOnly/> 
                                                            <Input type="text" name="specialAbilities2Ab0Name" size={13} className="tw-ml-3" style={{background:"transparent"}}
                                                                value={character.specialAbilities2.abilities[0].name} regpattern={regexPattern} readOnly/>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities2.abilities[0].level = parseInt(character.specialAbilities2.abilities[0].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities2.abilities[0].level = parseInt(character.specialAbilities2.abilities[0].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Special1" className={styles.ability}>
                                                            <input type="number" name="specialAbilities2Ab1Level" style={{width: 40}} min="0" max="13"
                                                                value={character.specialAbilities2.abilities[1].level} readOnly/> 
                                                            <Input type="text" name="specialAbilities2Ab1Name" size={13} className="tw-ml-3" style={{background:"transparent"}}
                                                                value={character.specialAbilities2.abilities[1].name} regpattern={regexPattern} readOnly/>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities2.abilities[1].level = parseInt(character.specialAbilities2.abilities[1].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities2.abilities[1].level = parseInt(character.specialAbilities2.abilities[1].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div key="Special2" className={styles.ability}>
                                                            <input type="number" name="specialAbilities2Ab2Level" style={{width: 40}} min="0" max="13"
                                                                value={character.specialAbilities2.abilities[2].level} readOnly/> 
                                                            <Input type="text" name="specialAbilities2Ab2Name" size={13} className="tw-ml-3" style={{background:"transparent"}}
                                                                value={character.specialAbilities2.abilities[2].name} regpattern={regexPattern} readOnly/>
                                                            {(() => {
                                                                if (editedCharacter.availablePoints > 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities2.abilities[2].level = parseInt(character.specialAbilities2.abilities[2].level)+1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)-1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    )
                                                                } else if (editedCharacter.availablePoints < 0) {
                                                                    return (
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-2 tw-py-0 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded"
                                                                            onClick={() => {
                                                                                character.specialAbilities2.abilities[2].level = parseInt(character.specialAbilities2.abilities[2].level)-1;
                                                                                setEditedCharacter({
                                                                                    ...editedCharacter, 
                                                                                    availablePoints:parseInt(editedCharacter.availablePoints)+1,
                                                                                    character: character.toString()
                                                                                })
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) 
                        
                                    case 1:
                                        return (
                                            <div style={{display:"grid", gridTemplateRows:"repeat(2, auto)"}}>
                                                <div style={{display: "flex"}}>
                                                    <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-mt-4"
                                                        onClick={() => {
                                                            var newInv = editedCharacter.inventory;
                                                            newInv.push({
                                                                itemId: makeid(5),
                                                                name: "Nouvel objet",
                                                                count: 1
                                                            })
                                                            setEditedCharacter({...editedCharacter, inventory: newInv})
                                                            setNeedReload(!needReload)
                                                        }}>
                                                        Ajouter un objet
                                                    </button>
                                                </div>

                                                <div style={{
                                                    width: "95%",
                                                    height: "45vh",
                                                    background: "#303030",
                                                    margin: "2.7%",
                                                    marginLeft: "0.75rem",
                                                    marginBottom: "2%",
                                                    overflowX: "hidden",
                                                    overflowY: "auto",
                                                    borderRadius: "20px"
                                                }}>
                                                    <div style={{display:"grid", gridTemplateRows:"repeat(auto, auto)"}}>
                                                        {editedCharacter.inventory.map((item) => {
                                                            return (
                                                                <div className="tw-flex" key={item.itemId} style={{borderBottom:"solid 2px #AAAAAA25"}}>
                                                                    <div className={styles.inputBox} style={{marginLeft:"1.3rem", marginTop:"0.10rem", marginBottom:"0.75rem", width:"15rem"}}>
                                                                        <Input value={item.name} 
                                                                        onChange={(e) => {item.name = e.target.value; setEditedCharacter({...editedCharacter}); setNeedReload(!needReload)}}/>
                                                                    </div>
                                                                    <h1 style={{margin:"1rem 1vh 0 0"}}> x{item.count}</h1>
                                                                    <div style={{marginTop:"0.7rem"}}>
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-4 tw-py-2 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-ml-2"
                                                                            onClick={() => {
                                                                                item.count -= 1;
                                                                                if (item.count <= 0) {
                                                                                    if (confirm("Supprimer cet objet (" + item.name + ") ?")) {
                                                                                        var i = 0;
                                                                                        var newInv = editedCharacter.inventory;
                                                                                        while (i != Object.entries(editedCharacter.inventory).length) {
                                                                                            if (editedCharacter.inventory[i].itemId == item.itemId) {
                                                                                                newInv.splice(i, 1);
                                                                                                break;
                                                                                            }
                                                                                            i++;
                                                                                        }
                                                                                        setEditedCharacter({...editedCharacter, inventory:newInv})
                                                                                    } else {
                                                                                        item.count += 1;
                                                                                    }
                                                                                }
                                                                                setEditedCharacter({...editedCharacter});
                                                                                setNeedReload(!needReload);
                                                                            }}>
                                                                            -
                                                                        </button>
                                                                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-4 tw-py-2 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-ml-2"
                                                                            onClick={() => {
                                                                                item.count += 1;
                                                                                setEditedCharacter({...editedCharacter});
                                                                                setNeedReload(!needReload);
                                                                            }}>
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                        
                                    case 2:
                                        return (
                                            <></>
                                        )
                        
                                    default:
                                        return (
                                            <h1>C'est cassé</h1>
                                        )
                                }
                            })()}
                                <button type="submit" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-mt-2">
                                    Sauvegarder
                                </button>
                            </form>
                        </div>
                    </>
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

                        <button type="button" className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-9 tw-mt-6"
                            onClick={() => {
                                var newChars = editedGame.characters;
                                function compare( a, b ) {
                                    if ( a.luck < b.luck ){
                                      return 1;
                                    }
                                    if ( a.luck > b.luck ){
                                      return -1;
                                    }
                                    return 0;
                                }
                                newChars = newChars.sort(compare);
                                setEditedGame({...editedGame, characters:newChars})

                                fetch('/api/games/update-game', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(editedGame),
                                }).then((res) => {
                                    alert("Personnages de la partie \"" + editedGame.name + "\" classés par chance.")
                                    Router.push({
                                        pathname: '/games'
                                      }, 
                                      undefined, { shallow: true }
                                    )
                                    setNeedReload(!needReload);
                                })
                                
                            }}>
                            Classer les personnages par chance
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