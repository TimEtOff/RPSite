import { useState, useEffect } from 'react'
import { Character } from './character/character';
import { setCookie, getCookie, hasCookie } from 'cookies-next';
import styles from "../styles/components/character-list.module.css";

export default function CharacterList() {

    function handleClick(param) {
        return function (e) {
            console.log(param);
        }
    }

    const [characters, setCharacters] = useState(null)
    const [isLoading, setLoading] = useState(true)
 
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
            { characters.map((character) => {
            return (
            <div key={character.characterId} className={styles.character} suppressHydrationWarning>
                <h1>
                    {Character.getFromString(character.character).getFullName()}
                </h1>

                <ul>
                    <li>
                        <button className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-my-4">
                            Modifier
                        </button>
                    </li>

                    <li>
                        <button onClick={handleClick(character)} className="tw-bg-neutral-800 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-3 tw-my-4">
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