import { useState, useEffect } from 'react'
import { Character } from './character/character';
import { setCookie, getCookie, hasCookie } from 'cookies-next';
import styles from "../styles/components/character-list.module.css";
import Dialog from './dialog';

export default function GamesList({ editGame }) {

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
                var id = getCookie('id');
                fetch('/api/games/delete-game', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id, gameId: param })
                })
                
                var i = 0;
                var newGames = [];
                while (i != games.length) {
                    if (games[i].gameId != param) {
                        newGames.push(games[i]);
                    }
                    i++;
                }
                setGames(newGames);
            } else {
                alert("Vous n'êtes pas connecté");
            }
        }
    }

    function returnToGamesList(param) {
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

    function addCharacter(param) {
        return function (e) {
            
        }
    }

    function onClose() {
        return function (e) {
            console.log("Close");
        }
    }
    
    function onOk() {
        return function (e) {
            console.log("OK");
        }
    }

 
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
                        <button onClick={deleteGame(game.gameId)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-my-4">
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
            <button onClick={returnToGamesList(games)} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-5 tw-mt-4">
                &larr; Retour
            </button>
            <button onClick={editGame(editedGame)} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-5 tw-mt-4">
                Modifier
            </button>
            <button onClick={addCharacter(editedGame)} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-5 tw-mt-4">
                Ajouter un personnage
            </button>

            <Dialog title="Test dialog" onClose={onClose} onOk={onOk}>
                <p>Text test lololololllloloooololololl</p>
            </Dialog>

            { editedGame.characters.map((characterData) => {
                var character = characterData.character;
            return (
                <div key={character.characterId} className={styles.character} suppressHydrationWarning>
                    <h1>
                        {Character.getFromString(character.character).getFullName()}
                    </h1>

                    <ul>
                        <li>
                            <button onClick="" className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-my-4">
                                Modifier
                            </button>
                        </li>

                        <li>
                            <button onClick="" className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-my-4">
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