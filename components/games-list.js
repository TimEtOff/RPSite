import { useState, useEffect } from 'react'
import { Character } from './character/character';
import { setCookie, getCookie, hasCookie } from 'cookies-next';
import styles from "../styles/components/character-list.module.css";
import Dialog from './dialog';
import Router from 'next/router';

export default function GamesList({ editGame, addCharacter, editCharacter, reset, needReload }) {

    const [games, setGames] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [editedGame, setEditedGame] = useState(null)

    function newGame() {
        return function (e) {
            if (hasCookie('id')) {
                var id = getCookie('id');
                var newGameId;
                fetch('/api/games/new-game', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id })
                }).then((res) => res.json())
                .then((json) => {
                    newGameId = json.gameId;
                    fetch('/api/games/get-game', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: id, gameId: newGameId })
                    }).then((res) => res.json())
                    .then((json) => {
                        var i = 0;
                        var newGames = [];
                        while (i != games.length) {
                            newGames.push(games[i]);
                            i++;
                        }
                        newGames.push({
                            id: id, 
                            gameId: newGameId, 
                            name: json.gameData.name, 
                            specialCat1: json.gameData.specialCat1, 
                            specialCat2: json.gameData.specialCat2, 
                            characters: json.gameData.characters});
                        setGames(newGames);
                    })
                })
            } else {
                alert("Vous n'êtes pas connecté");
            }
        }
    }

    function deleteGame(param) {
        return function (e) {
            if (hasCookie('id')) {
                if (confirm("Toutes les données de cette partie (" + param.name + ") seront supprimées. Continuer ?")) {
                    var id = getCookie('id');
                    fetch('/api/games/delete-game', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: id, gameId: param.gameId })
                    })

                    var i = 0;
                    var newGames = [];
                    while (i != games.length) {
                        if (games[i].gameId != param.gameId) {
                            newGames.push(games[i]);
                        }
                        i++;
                    }
                    setGames(newGames);
                }
            } else {
                alert("Vous n'êtes pas connecté");
            }
        }
    }

    function returnToGamesList() {
        return function (e) {
            if (hasCookie('id')) {
                var id = getCookie('id');
                setEditedGame(null)
                setLoading(true);
                fetch('/api/games/get-games', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id }),
                })
                .then((res) => res.json())
                .then((json) => {
                    setGames(json.games)
                    setLoading(false)
                })
            } else {
                alert("Vous n'êtes pas connecté");
            }
            reset();
        }
    }

    function editGameHere(param) {
        return function (e) {
            if (hasCookie('id')) {
                var id = getCookie('id');
                fetch('/api/games/get-game', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id, gameId: param.gameId })
                }).then((res) => res.json())
                .then((json) => {
                    setEditedGame(json.gameData);
                })
            } else {
                alert("Vous n'êtes pas connecté");
            }
        }
    }

    function deleteChar(character) {
        return function (e) {
            if (confirm("Attention, si vous supprimez ce personnage (" + Character.getFromString(character.character).getFullName() + "), toutes les données seulement présentes dans la partie seront supprimées. Continuer ?")) {

                function getCharIndex(characterId, objectData) {
                    var i = 0;
                
                    while (i != objectData.length) {
                        var actualData = objectData[i]

                        if (actualData.characterId == characterId) {
                            return i;
                        }
                        i++;
                    }
                
                    return null;
                }

                var characters = editedGame.characters;
                characters.splice(getCharIndex(character.characterId, characters), 1)

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

                Router.push({
                    pathname: '/games',
                  }, 
                  undefined, { shallow: true }
                )
            }
        }
    }

    useEffect(() => {
        if (editedGame != null) {
            var id = getCookie('id');
            fetch('/api/games/get-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, gameId: editedGame.gameId })
            }).then((res) => res.json())
            .then((json) => {
                setEditedGame(json.gameData);
            })
        }
    }, [needReload])
 
    useEffect(() => {
        var id = getCookie('id');

        if (hasCookie('id')) {
            fetch('/api/games/get-games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            })
            .then((res) => res.json())
            .then((json) => {
                setGames(json.games)
                setLoading(false)
            })

        } else {
            setGames([{
                id: "", 
                gameId: "",
                name: "Non connecté", 
                specialCat1: "", 
                specialCat2: "", 
                characters: []
            }]);
            setLoading(false);
        }
    }, [])
 
    if (isLoading) return <p>Chargement...</p>

    if (editedGame == null) return (
        <div suppressHydrationWarning>
            <button onClick={newGame()} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-5 tw-mt-4">
                Nouvelle partie
            </button>
            { games.map((game) => {
            return (
            <div key={game.gameId} className={styles.character} suppressHydrationWarning> 
                <h1>
                    {game.name}
                </h1>

                <ul>
                    <li>
                        <button onClick={editGameHere(game)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-my-4">
                            Modifier
                        </button>
                    </li>

                    <li>
                        <button onClick={deleteGame(game)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-my-4">
                            Supprimer
                        </button>
                    </li>

                </ul>
            </div>
            )
        }) }
        </div>

    )

    return (
        <div suppressHydrationWarning>
            <h1 className=" tw-text-lg tw-mx-5 tw-mt-2 tw-font-bold">{editedGame.name}</h1>
            <button onClick={returnToGamesList()} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-ml-5 tw-mr-2 tw-mt-2">
                &larr; Retour
            </button>
            <button onClick={editGame(editedGame)} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-mt-2">
                Modifier
            </button>
            <button onClick={addCharacter(editedGame)} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-5 tw-mt-4">
                Ajouter un personnage
            </button>

            { editedGame.characters.map((characterData) => {
                var character = Character.getFromString(characterData.character);
            return (
                <div key={characterData.characterId} className={styles.character} suppressHydrationWarning>
                    <h1 style={{paddingTop:8}}>
                        {character.getFullName()}
                        <p className="tw-text-sm tw-text-neutral-400" style={{lineHeight: 1.2}}><i>par {characterData.userName}</i></p>
                    </h1>

                    <ul>
                        <li>
                            <button onClick={editCharacter(characterData, editedGame)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-my-2">
                                Modifier
                            </button>
                        </li>

                        <li>
                            <button onClick={deleteChar(characterData)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-my-2">
                                Supprimer
                            </button>
                        </li>

                    </ul>
                </div>
            )
        }) }
        </div>
    )

}