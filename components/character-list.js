import { useState, useEffect } from 'react'
import { Character } from './character/character';
import { setCookie, getCookie, hasCookie } from 'cookies-next';
import styles from "../styles/components/character-list.module.css";

export default function CharacterList({ editCharacter }) {

    const [characters, setCharacters] = useState(null)
    const [isLoading, setLoading] = useState(true)

    function newCharacter() {
        return function (e) {
            if (hasCookie('id')) {
                var id = getCookie('id');
                var newCharId;
                fetch('/api/character/new-character', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id })
                }).then((res) => res.json())
                .then((json) => {
                    newCharId = json.characterId;
                    fetch('/api/character/get-character', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: id, characterId: newCharId })
                    }).then((res) => res.json())
                    .then((json) => {
                        var i = 0;
                        var newChars = [];
                        while (i != characters.length) {
                            newChars.push(characters[i]);
                            i++;
                        }
                        newChars.push({id: id, gameId: json.characterData.gameId, characterId: newCharId, character: json.characterData.character});
                        setCharacters(newChars);
                    })
                })
            } else {
                alert("Vous n'êtes pas connecté");
            }
        }
    }

    function deleteCharacter(param) {
        return function (e) {
            if (hasCookie('id')) {
                if(confirm("Supprimer le personnage ?")) {
                var id = getCookie('id');
                fetch('/api/character/delete-character', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id, characterId: param })
                })
                
                var i = 0;
                var newChars = [];
                while (i != characters.length) {
                    if (characters[i].characterId != param) {
                        newChars.push(characters[i]);
                    }
                    i++;
                }
                setCharacters(newChars);
                }
            } else {
                alert("Vous n'êtes pas connecté");
            }
        }
    }
 
    useEffect(() => {
        var id = getCookie('id');

        if (hasCookie('id')) {
            fetch('/api/character/get-characters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            })
            .then((res) => res.json())
            .then((json) => {
                setCharacters(json.characters)
                setLoading(false)
            })
        } else {
            setCharacters([{id: "null", characterId: "null", character: new Character("Non", "connecté").toString()}]);
            setLoading(false);
        }
    }, [])
 
    if (isLoading) return <p>Chargement...</p>

    return (
        <div suppressHydrationWarning>
            <button onClick={newCharacter()} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-5 tw-mt-4">
                Nouveau personnage
            </button>

            { characters.map((character) => {
            return (
            <div key={character.characterId} className={styles.character} suppressHydrationWarning>
                <h1>
                    {Character.getFromString(character.character).getFullName()}
                </h1>

                <ul>
                    <li>
                        <button onClick={editCharacter(character)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-my-4">
                            Modifier
                        </button>
                    </li>

                    <li>
                        <button onClick={deleteCharacter(character.characterId)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-my-4">
                            Supprimer
                        </button>
                    </li>

                </ul>
            </div>
            )
        }) }
        </div>

    );

}