import Head from "next/head";
import { useState, useEffect } from 'react'
import AnimatedGradient from "../components/animated-gradient";
import Layout from "../components/layout";
import styles from "../styles/character.module.css"
import styles2 from '../styles/Home.module.css';
import Link from "next/link";
import dynamic from "next/dynamic";
import { Character } from "@/components/character/character";
import { hasCookie } from "cookies-next";
import { Ability } from "@/components/character/ability";
import { AbilityCategory } from "@/components/character/ability-category";
const CharacterList = dynamic(() => import('../components/character-list'), { ssr: false })

export default function CharacterPage() {

    const [characterData, setCharacterData] = useState(null);

    const [name, setName] = useState("");
    const [lastname, setLastName] = useState("");

    const [constitutionAbilities, setConstitutionAbilities] = useState(new AbilityCategory(false, "Constitution", 0, [new Ability("Force", 0), new Ability("R\u00e9sistance", 0)]));
    const [mentalAbilities, setMentalAbilities] = useState(new AbilityCategory(false, "Mental", 0, [new Ability("Intellect", 0), new Ability("Eloquence", 0)]));
    const [dexteriteAbilities, setDexteriteAbilities] = useState(new AbilityCategory(false, "Dext\u00e9rit\u00e9", 0, [new Ability("Agilit\u00e9", 0), new Ability("Furtivit\u00e9", 0)]));
    const [survieAbilities, setSurvieAbilities] = useState(new AbilityCategory(false, "Survie", 0, [new Ability("Perception", 0), new Ability("Savoir-faire", 0)]));
    const [specialAbilities1, setSpecialAbilities1] = useState(new AbilityCategory(true, "", 0, [new Ability("", 0), new Ability("", 0), new Ability("", 0)]));
    const [specialAbilities2, setSpecialAbilities2] = useState(new AbilityCategory(true, "", 0, [new Ability("", 0), new Ability("", 0), new Ability("", 0)]));

    function editCharacter(characterData) {
        return function (e) {
            if (hasCookie('id')) {
                setCharacterData(characterData);
                var character = Character.getFromString(characterData.character);

                setName(character.name);
                setLastName(character.lastname);
                setConstitutionAbilities(character.constitutionAbilities);
                setMentalAbilities(character.mentalAbilities);
                setDexteriteAbilities(character.dexteriteAbilities);
                setSurvieAbilities(character.survieAbilities);
                setSpecialAbilities1(character.specialAbilities1);
                setSpecialAbilities2(character.specialAbilities2);
            }  else {
                alert("Vous n'êtes pas connecté")
            }
        }
    }

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        if (!hasCookie('id')) {
            alert("Vous n'êtes pas connecté");
            return;
        } else if (characterData == null) {
            alert("Aucun personnage sélectionné");
            return;
        }
        
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());

        var character = Character.getFromString(characterData.character);
        character.name = formJson.name;
        character.lastname = formJson.lastname;

        character.constitutionAbilities.categoryLevel = formJson.constitutionAbilitiesCatLevel;
        character.constitutionAbilities.abilities[0].level = formJson.constitutionAbilities0Level;
        character.constitutionAbilities.abilities[1].level = formJson.constitutionAbilities1Level;

        character.mentalAbilities.categoryLevel = formJson.mentalAbilitiesCatLevel;
        character.mentalAbilities.abilities[0].level = formJson.mentalAbilities0Level;
        character.mentalAbilities.abilities[1].level = formJson.mentalAbilities1Level;

        character.dexteriteAbilities.categoryLevel = formJson.dexteriteAbilitiesCatLevel;
        character.dexteriteAbilities.abilities[0].level = formJson.dexteriteAbilities0Level;
        character.dexteriteAbilities.abilities[1].level = formJson.dexteriteAbilities1Level;

        character.survieAbilities.categoryLevel = formJson.survieAbilitiesCatLevel;
        character.survieAbilities.abilities[0].level = formJson.survieAbilities0Level;
        character.survieAbilities.abilities[1].level = formJson.survieAbilities1Level;

    //    character.specialAbilities1.name = formJson.specialAbilities1CatName;
    //    character.specialAbilities1.categoryLevel = formJson.specialAbilities1CatLevel;
    //    character.specialAbilities1.abilities[0].name = formJson.specialAbilities1Ab0Name;
    //    character.specialAbilities1.abilities[1].name = formJson.specialAbilities1Ab1Name;
    //    character.specialAbilities1.abilities[2].name = formJson.specialAbilities1Ab2Name;
    //    character.specialAbilities1.abilities[0].level = formJson.specialAbilities1Ab0Level;
    //    character.specialAbilities1.abilities[1].level = formJson.specialAbilities1Ab1Level;
    //    character.specialAbilities1.abilities[2].level = formJson.specialAbilities1Ab2Level;

    //    character.specialAbilities2.name = formJson.specialAbilities2CatName;
    //    character.specialAbilities2.categoryLevel = formJson.specialAbilities2CatLevel;
    //    character.specialAbilities2.abilities[0].name = formJson.specialAbilities2Ab0Name;
    //    character.specialAbilities2.abilities[1].name = formJson.specialAbilities2Ab1Name;
    //    character.specialAbilities2.abilities[2].name = formJson.specialAbilities2Ab2Name;
    //    character.specialAbilities2.abilities[0].level = formJson.specialAbilities2Ab0Level;
    //    character.specialAbilities2.abilities[1].level = formJson.specialAbilities2Ab1Level;
    //    character.specialAbilities2.abilities[2].level = formJson.specialAbilities2Ab2Level;

        characterData.character = character.toString();

        fetch('/api/character/update-character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characterData),
        }).then((res) => {
            alert("Personnage \"" + character.getFullName() + "\" sauvegardé")
        })
        // TODO Passer le nouveau character à <CharacterList />

    }

    function editAbiltyCatLevel(constFunction, abilityCategory, e) {
        var value = e.target.value;
        var newAbilityCategory = AbilityCategory.getFromString(abilityCategory.toString());
        newAbilityCategory.categoryLevel = value;
        constFunction(newAbilityCategory);
    }

    function editAbiltyCatName(constFunction, abilityCategory, e) {
        var value = e.target.value;
        var newAbilityCategory = AbilityCategory.getFromString(abilityCategory.toString());
        newAbilityCategory.name = value;
        constFunction(newAbilityCategory);
    }

    function editAbiltyLevel(constFunction, abilityCategory, index, e) {
        var value = e.target.value;
        var newAbilityCategory = AbilityCategory.getFromString(abilityCategory.toString());
        newAbilityCategory.abilities[index].level = value;
        constFunction(newAbilityCategory);
    }

    function editAbiltyName(constFunction, abilityCategory, index, e) {
        var value = e.target.value;
        var newAbilityCategory = AbilityCategory.getFromString(abilityCategory.toString());
        newAbilityCategory.abilities[index].name = value;
        constFunction(newAbilityCategory);
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

                <div className="height:80vh tw-container">
                    <div className={styles.characters} suppressHydrationWarning>
                        <CharacterList editCharacter={editCharacter}/>
                    </div>

                    <div className={styles.characterForm} suppressHydrationWarning>
                        <form onSubmit={handleSubmit}>

                            <div className=" tw-container tw-ml-6 tw-mt-2">
                                <div className=" tw-mx-3 tw-my-4 tw-float-left">
                                    <label>
                                        Prénom
                                    </label>
                                    <input type="text" name="name" 
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        size="15"/>
                                </div>

                                <div className=" tw-mx-3 tw-my-4 tw-float-left">
                                    <label>
                                        Nom
                                    </label>
                                    <input type="text" name="lastname" 
                                        value={lastname}
                                        onChange={e => setLastName(e.target.value)}
                                        size="15"/>
                                </div>
                            </div>

                            <br/>

                            <div key="abilities">
                                <br/>
                                <div key="constitutionAbilities">
                                    <div key="Constitution">
                                        <input type="number" name="constitutionAbilitiesCatLevel" style={{width: 40}}
                                            value={constitutionAbilities.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setConstitutionAbilities, constitutionAbilities, e)}/> 
                                        <label>Constitution</label>
                                    </div>
                                    <div key="Force">
                                        <input type="number" name="constitutionAbilities0Level" style={{width: 40}}
                                            value={constitutionAbilities.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setConstitutionAbilities, constitutionAbilities, 0, e)}/> 
                                        <label>Force</label>
                                    </div>
                                    <div key="Resistance">
                                        <input type="number" name="constitutionAbilities1Level" style={{width: 40}}
                                            value={constitutionAbilities.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setConstitutionAbilities, constitutionAbilities, 1, e)}/> 
                                        <label>Résistance</label>
                                    </div>
                                </div>

                                <br/>

                                <div key="mentalAbilities">
                                    <div key="Mental">
                                        <input type="number" name="mentalAbilitiesCatLevel" style={{width: 40}}
                                            value={mentalAbilities.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setMentalAbilities, mentalAbilities, e)}/> 
                                        <label>Mental</label>
                                    </div>
                                    <div key="Intellect">
                                        <input type="number" name="mentalAbilities0Level" style={{width: 40}}
                                            value={mentalAbilities.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setMentalAbilities, mentalAbilities, 0, e)}/> 
                                        <label>Intellect</label>
                                    </div>
                                    <div key="Eloquence">
                                        <input type="number" name="mentalAbilities1Level" style={{width: 40}}
                                            value={mentalAbilities.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setMentalAbilities, mentalAbilities, 1, e)}/> 
                                        <label>Éloquence</label>
                                    </div>
                                </div>

                                <br/>

                                <div key="dexteriteAbilities">
                                    <div key="Dexterite">
                                        <input type="number" name="dexteriteAbilitiesCatLevel" style={{width: 40}}
                                            value={dexteriteAbilities.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setDexteriteAbilities, dexteriteAbilities, e)}/> 
                                        <label>Déxtérité</label>
                                    </div>
                                    <div key="Agilite">
                                        <input type="number" name="dexteriteAbilities0Level" style={{width: 40}}
                                            value={dexteriteAbilities.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setDexteriteAbilities, dexteriteAbilities, 0, e)}/> 
                                        <label>Agilité</label>
                                    </div>
                                    <div key="Furtivite">
                                        <input type="number" name="dexteriteAbilities1Level" style={{width: 40}}
                                            value={dexteriteAbilities.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setDexteriteAbilities, dexteriteAbilities, 1, e)}/> 
                                        <label>Furtivité</label>
                                    </div>
                                </div> 

                                <br/>

                                <div key="survieAbilities">
                                    <div key="Survie">
                                        <input type="number" name="survieAbilitiesCatLevel" style={{width: 40}}
                                            value={survieAbilities.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setSurvieAbilities, survieAbilities, e)}/> 
                                        <label>Survie</label>
                                    </div>
                                    <div key="Perception">
                                        <input type="number" name="survieAbilities0Level" style={{width: 40}}
                                            value={survieAbilities.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setSurvieAbilities, survieAbilities, 0, e)}/> 
                                        <label>Perception</label>
                                    </div>
                                    <div key="Savoir-faire">
                                        <input type="number" name="survieAbilities1Level" style={{width: 40}}
                                            value={survieAbilities.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setSurvieAbilities, survieAbilities, 1, e)}/> 
                                        <label>Savoir-faire</label>
                                    </div>
                                </div>
                            </div>

                            <br/>

                            <button className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-9 tw-mt-3">
                                Sauvegarder
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </Layout>
    )
}