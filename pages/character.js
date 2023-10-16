import Head from "next/head";
import { useState, useEffect } from 'react'
import AnimatedGradient from "../components/animated-gradient";
import Layout from "../components/layout";
import styles from "../styles/character.module.css"
import styles2 from '../styles/Home.module.css';
import stylesForm from '../styles/login.module.css';
import Link from "next/link";
import dynamic from "next/dynamic";
import { Character } from "@/components/character/character";
import { Input } from "@/components/input"
import { hasCookie } from "cookies-next";
import { Ability } from "@/components/character/ability";
import { AbilityCategory } from "@/components/character/ability-category";
import Router from "next/router";
const CharacterList = dynamic(() => import('../components/character-list'), { ssr: false })

export default function CharacterPage() {

    const [needReload, setNeedReload] = useState(false);
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

    function getTotalPoints() {
        return parseInt(constitutionAbilities.categoryLevel) +
            parseInt(constitutionAbilities.abilities[0].level) +
            parseInt(constitutionAbilities.abilities[1].level) +
            parseInt(mentalAbilities.categoryLevel) +
            parseInt(mentalAbilities.abilities[0].level) +
            parseInt(mentalAbilities.abilities[1].level) +
            parseInt(dexteriteAbilities.categoryLevel) +
            parseInt(dexteriteAbilities.abilities[0].level) +
            parseInt(dexteriteAbilities.abilities[1].level) +
            parseInt(survieAbilities.categoryLevel) +
            parseInt(survieAbilities.abilities[0].level) +
            parseInt(survieAbilities.abilities[1].level) +
            parseInt(specialAbilities1.categoryLevel) +
            parseInt(specialAbilities1.abilities[0].level) +
            parseInt(specialAbilities1.abilities[1].level) +
            parseInt(specialAbilities1.abilities[2].level) +
            parseInt(specialAbilities2.categoryLevel) + 
            parseInt(specialAbilities2.abilities[0].level) +
            parseInt(specialAbilities2.abilities[1].level) +
            parseInt(specialAbilities2.abilities[2].level)
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

        fetch('/api/games/get-game-specials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({gameId: characterData.gameId}),
        }).then((res) => res.json())
        .then((json) => {
            character.specialAbilities1.name = json.specialCat1;
            character.specialAbilities2.name = json.specialCat2;

            character.name = formJson.name;
            character.lastname = formJson.lastname;
    
            character.constitutionAbilities.categoryLevel = character.verifyAbilityChange(character.constitutionAbilities.categoryLevel, formJson.constitutionAbilitiesCatLevel);
            character.constitutionAbilities.abilities[0].level = character.verifyAbilityChange(character.constitutionAbilities.abilities[0].level, formJson.constitutionAbilities0Level);
            character.constitutionAbilities.abilities[1].level = character.verifyAbilityChange(character.constitutionAbilities.abilities[1].level, formJson.constitutionAbilities1Level);
    
            character.mentalAbilities.categoryLevel = character.verifyAbilityChange(character.mentalAbilities.categoryLevel, formJson.mentalAbilitiesCatLevel);
            character.mentalAbilities.abilities[0].level = character.verifyAbilityChange(character.mentalAbilities.abilities[0].level, formJson.mentalAbilities0Level);
            character.mentalAbilities.abilities[1].level = character.verifyAbilityChange(character.mentalAbilities.abilities[1].level, formJson.mentalAbilities1Level);
    
            character.dexteriteAbilities.categoryLevel = character.verifyAbilityChange(character.dexteriteAbilities.categoryLevel, formJson.dexteriteAbilitiesCatLevel);
            character.dexteriteAbilities.abilities[0].level = character.verifyAbilityChange(character.dexteriteAbilities.abilities[0].level, formJson.dexteriteAbilities0Level);
            character.dexteriteAbilities.abilities[1].level = character.verifyAbilityChange(character.dexteriteAbilities.abilities[1].level, formJson.dexteriteAbilities1Level);
    
            character.survieAbilities.categoryLevel = character.verifyAbilityChange(character.survieAbilities.categoryLevel, formJson.survieAbilitiesCatLevel);
            character.survieAbilities.abilities[0].level = character.verifyAbilityChange(character.survieAbilities.abilities[0].level, formJson.survieAbilities0Level);
            character.survieAbilities.abilities[1].level = character.verifyAbilityChange(character.survieAbilities.abilities[1].level, formJson.survieAbilities1Level);
    
            character.specialAbilities1.categoryLevel = character.verifyAbilityChange(character.specialAbilities1.categoryLevel, formJson.specialAbilities1CatLevel);
            character.specialAbilities1.abilities[0].name = formJson.specialAbilities1Ab0Name;
            character.specialAbilities1.abilities[1].name = formJson.specialAbilities1Ab1Name;
            character.specialAbilities1.abilities[2].name = formJson.specialAbilities1Ab2Name;
            character.specialAbilities1.abilities[0].level = character.verifyAbilityChange(character.specialAbilities1.abilities[0].level, formJson.specialAbilities1Ab0Level);
            character.specialAbilities1.abilities[1].level = character.verifyAbilityChange(character.specialAbilities1.abilities[1].level, formJson.specialAbilities1Ab1Level);
            character.specialAbilities1.abilities[2].level = character.verifyAbilityChange(character.specialAbilities1.abilities[2].level, formJson.specialAbilities1Ab2Level);
    
            character.specialAbilities2.categoryLevel = character.verifyAbilityChange(character.specialAbilities2.categoryLevel, formJson.specialAbilities2CatLevel);
            character.specialAbilities2.abilities[0].name = formJson.specialAbilities2Ab0Name;
            character.specialAbilities2.abilities[1].name = formJson.specialAbilities2Ab1Name;
            character.specialAbilities2.abilities[2].name = formJson.specialAbilities2Ab2Name;
            character.specialAbilities2.abilities[0].level = character.verifyAbilityChange(character.specialAbilities2.abilities[0].level, formJson.specialAbilities2Ab0Level);
            character.specialAbilities2.abilities[1].level = character.verifyAbilityChange(character.specialAbilities2.abilities[1].level, formJson.specialAbilities2Ab1Level);
            character.specialAbilities2.abilities[2].level = character.verifyAbilityChange(character.specialAbilities2.abilities[2].level, formJson.specialAbilities2Ab2Level);
    
            characterData.character = character.toString();
    
            fetch('/api/character/update-character', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(characterData),
            }).then((res) => {
                alert("Personnage \"" + character.getFullName() + "\" sauvegardé")
                editCharacter(characterData)();
                setNeedReload(!needReload);
            })
        })
        
    }

    const regexPattern = "[0-9a\-zA\-Z&À\-ÖÙ\-ÿ\\-\\.°~#œŒ ]"

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
                        Modifiez vos personnages
                    </p>
                </AnimatedGradient>

                <div className="height:80vh tw-container">
                    <div className={styles.characters} suppressHydrationWarning>
                        <CharacterList editCharacter={editCharacter} needReload={needReload}/>
                    </div>

                    <div className={styles.characterForm} suppressHydrationWarning>
                        {characterData != null ? (<form onSubmit={handleSubmit}>

                            <div className={styles.name}>
                                <div className={styles.inputBox}>
                                    <Input type="text" name="name"
                                        value={name} regpattern={regexPattern}
                                        onChange={e => setName(e.target.value)}/>
                                    <label>
                                        Prénom
                                    </label>
                                </div>

                                <div className={styles.inputBox}>
                                    <Input type="text" name="lastname"
                                        value={lastname} regpattern={regexPattern}
                                        onChange={e => setLastName(e.target.value)}/>
                                    <label>
                                        Nom
                                    </label>
                                </div>

                                <div className={styles.inputBox} style={{width:"8rem"}}>
                                    <Input type="text" name="gameId"
                                        value={characterData != null ? (characterData.gameId) : ("")} regpattern={regexPattern}
                                        onChange={e => setCharacterData({...characterData, gameId:e.target.value})}/>
                                    <label>
                                        ID de la partie
                                    </label>
                                </div>
                            </div>

                            <div className="tw-flex">
                                <h1>Capacités {getTotalPoints()}/80</h1> <p className="tw-ml-2 tw-text-sm tw-text-neutral-400" style={{lineHeight: 1.7}}><i>(13pts max/capacité)</i></p>
                            </div>

                            <div key="abilities" className={styles.abilities}>
                                <div key="constitutionAbilities" className={styles.constCat}>
                                    <div key="Constitution" className={styles.abilityMain}>
                                        <input type="number" name="constitutionAbilitiesCatLevel" style={{width: 40}} min="0" max="13"
                                            value={constitutionAbilities.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setConstitutionAbilities, constitutionAbilities, e)}/> 
                                        <label>Constitution</label>
                                    </div>
                                    <div key="Force" className={styles.ability}>
                                        <input type="number" name="constitutionAbilities0Level" style={{width: 40}} min="0" max="13"
                                            value={constitutionAbilities.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setConstitutionAbilities, constitutionAbilities, 0, e)}/> 
                                        <label>Force</label>
                                    </div>
                                    <div key="Resistance" className={styles.ability}>
                                        <input type="number" name="constitutionAbilities1Level" style={{width: 40}} min="0" max="13"
                                            value={constitutionAbilities.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setConstitutionAbilities, constitutionAbilities, 1, e)}/> 
                                        <label>Résistance</label>
                                    </div>
                                </div>

                                <br/>

                                <div key="mentalAbilities" className={styles.mentCat}>
                                    <div key="Mental" className={styles.abilityMain}>
                                        <input type="number" name="mentalAbilitiesCatLevel" style={{width: 40}} min="0" max="13"
                                            value={mentalAbilities.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setMentalAbilities, mentalAbilities, e)}/> 
                                        <label>Mental</label>
                                    </div>
                                    <div key="Intellect" className={styles.ability}>
                                        <input type="number" name="mentalAbilities0Level" style={{width: 40}} min="0" max="13"
                                            value={mentalAbilities.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setMentalAbilities, mentalAbilities, 0, e)}/> 
                                        <label>Intellect</label>
                                    </div>
                                    <div key="Eloquence" className={styles.ability}>
                                        <input type="number" name="mentalAbilities1Level" style={{width: 40}} min="0" max="13"
                                            value={mentalAbilities.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setMentalAbilities, mentalAbilities, 1, e)}/> 
                                        <label>Éloquence</label>
                                    </div>
                                </div>

                                <br/>

                                <div key="dexteriteAbilities" className={styles.dextCat}>
                                    <div key="Dexterite" className={styles.abilityMain}>
                                        <input type="number" name="dexteriteAbilitiesCatLevel" style={{width: 40}} min="0" max="13"
                                            value={dexteriteAbilities.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setDexteriteAbilities, dexteriteAbilities, e)}/> 
                                        <label>Déxtérité</label>
                                    </div>
                                    <div key="Agilite" className={styles.ability}>
                                        <input type="number" name="dexteriteAbilities0Level" style={{width: 40}} min="0" max="13"
                                            value={dexteriteAbilities.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setDexteriteAbilities, dexteriteAbilities, 0, e)}/> 
                                        <label>Agilité</label>
                                    </div>
                                    <div key="Furtivite" className={styles.ability}>
                                        <input type="number" name="dexteriteAbilities1Level" style={{width: 40}} min="0" max="13"
                                            value={dexteriteAbilities.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setDexteriteAbilities, dexteriteAbilities, 1, e)}/> 
                                        <label>Furtivité</label>
                                    </div>
                                </div> 

                                <br/>

                                <div key="survieAbilities" className={styles.survCat}>
                                    <div key="Survie" className={styles.abilityMain}>
                                        <input type="number" name="survieAbilitiesCatLevel" style={{width: 40}} min="0" max="13"
                                            value={survieAbilities.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setSurvieAbilities, survieAbilities, e)}/> 
                                        <label>Survie</label>
                                    </div>
                                    <div key="Perception" className={styles.ability}>
                                        <input type="number" name="survieAbilities0Level" style={{width: 40}} min="0" max="13"
                                            value={survieAbilities.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setSurvieAbilities, survieAbilities, 0, e)}/> 
                                        <label>Perception</label>
                                    </div>
                                    <div key="Savoir-faire" className={styles.ability}>
                                        <input type="number" name="survieAbilities1Level" style={{width: 40}} min="0" max="13"
                                            value={survieAbilities.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setSurvieAbilities, survieAbilities, 1, e)}/> 
                                        <label>Savoir-faire</label>
                                    </div>
                                </div>

                                <div key="specialAbilities1" className={styles.spe1Cat}>
                                    <div key="Special1Cat" className={styles.abilityMain}>
                                        <input type="number" name="specialAbilities1CatLevel" style={{width: 40}} min="0" max="13"
                                            value={specialAbilities1.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setSpecialAbilities1, specialAbilities1, e)}/> 
                                        <input type="text" name="specialAbilities1CatName" size={13} className="tw-ml-3" readOnly
                                            value={specialAbilities1.name}
                                            onChange={e => editAbiltyCatName(setSpecialAbilities1, specialAbilities1, e)}/>
                                    </div>
                                    <div key="Special0" className={styles.ability}>
                                        <input type="number" name="specialAbilities1Ab0Level" style={{width: 40}} min="0" max="13"
                                            value={specialAbilities1.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setSpecialAbilities1, specialAbilities1, 0, e)}/> 
                                        <Input type="text" name="specialAbilities1Ab0Name" size={13} className="tw-ml-3"
                                            value={specialAbilities1.abilities[0].name} regpattern={regexPattern}
                                            onChange={e => editAbiltyName(setSpecialAbilities1, specialAbilities1, 0, e)}/>
                                    </div>
                                    <div key="Special1" className={styles.ability}>
                                        <input type="number" name="specialAbilities1Ab1Level" style={{width: 40}} min="0" max="13"
                                            value={specialAbilities1.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setSpecialAbilities1, specialAbilities1, 1, e)}/> 
                                        <Input type="text" name="specialAbilities1Ab1Name" size={13} className="tw-ml-3"
                                            value={specialAbilities1.abilities[1].name} regpattern={regexPattern}
                                            onChange={e => editAbiltyName(setSpecialAbilities1, specialAbilities1, 1, e)}/>
                                    </div>
                                    <div key="Special2" className={styles.ability}>
                                        <input type="number" name="specialAbilities1Ab2Level" style={{width: 40}} min="0" max="13"
                                            value={specialAbilities1.abilities[2].level}
                                            onChange={e => editAbiltyLevel(setSpecialAbilities1, specialAbilities1, 2, e)}/> 
                                        <Input type="text" name="specialAbilities1Ab2Name" size={13} className="tw-ml-3"
                                            value={specialAbilities1.abilities[2].name} regpattern={regexPattern}
                                            onChange={e => editAbiltyName(setSpecialAbilities1, specialAbilities1, 2, e)}/>
                                    </div>
                                </div>

                                <div key="specialAbilities2" className={styles.spe2Cat}>
                                    <div key="specialAbilities2" className={styles.abilityMain}>
                                        <input type="number" name="specialAbilities2CatLevel" style={{width: 40}} min="0" max="13"
                                            value={specialAbilities2.categoryLevel}
                                            onChange={e => editAbiltyCatLevel(setSpecialAbilities2, specialAbilities2, e)}/> 
                                        <input type="text" name="specialAbilities2CatName" size={13} className="tw-ml-3" readOnly
                                            value={specialAbilities2.name}
                                            onChange={e => editAbiltyCatName(setSpecialAbilities2, specialAbilities2, e)}/>
                                    </div>
                                    <div key="Special0" className={styles.ability}>
                                        <input type="number" name="specialAbilities2Ab0Level" style={{width: 40}} min="0" max="13"
                                            value={specialAbilities2.abilities[0].level}
                                            onChange={e => editAbiltyLevel(setSpecialAbilities2, specialAbilities2, 0, e)}/> 
                                        <Input type="text" name="specialAbilities2Ab0Name" size={13} className="tw-ml-3"
                                            value={specialAbilities2.abilities[0].name} regpattern={regexPattern}
                                            onChange={e => editAbiltyName(setSpecialAbilities2, specialAbilities2, 0, e)}/>
                                    </div>
                                    <div key="Special1" className={styles.ability}>
                                        <input type="number" name="specialAbilities2Ab1Level" style={{width: 40}} min="0" max="13"
                                            value={specialAbilities2.abilities[1].level}
                                            onChange={e => editAbiltyLevel(setSpecialAbilities2, specialAbilities2, 1, e)}/> 
                                        <Input type="text" name="specialAbilities2Ab1Name" size={13} className="tw-ml-3"
                                            value={specialAbilities2.abilities[1].name} regpattern={regexPattern}
                                            onChange={e => editAbiltyName(setSpecialAbilities2, specialAbilities2, 1, e)}/>
                                    </div>
                                    <div key="Special2" className={styles.ability}>
                                        <input type="number" name="specialAbilities2Ab2Level" style={{width: 40}} min="0" max="13"
                                            value={specialAbilities2.abilities[2].level}
                                            onChange={e => editAbiltyLevel(setSpecialAbilities2, specialAbilities2, 2, e)}/> 
                                        <Input type="text" name="specialAbilities2Ab2Name" size={13} className="tw-ml-3"
                                            value={specialAbilities2.abilities[2].name} regpattern={regexPattern}
                                            onChange={e => editAbiltyName(setSpecialAbilities2, specialAbilities2, 2, e)}/>
                                    </div>
                                </div>
                            </div>

                            <button className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-9 tw-mt-1">
                                Sauvegarder
                            </button>
                        </form>) : (
                            <h1 className="tw-text-center tw-text-xl" style={{paddingTop:"47%", margin:0}}
                            >Veillez sélectionner un élément à éditer</h1>
                        )}
                    </div>
                </div>
            </main>
        </Layout>
    )
}