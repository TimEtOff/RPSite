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
import { hasCookie } from "cookies-next";
import { Ability } from "@/components/character/ability";
import { AbilityCategory } from "@/components/character/ability-category";
import GamesList from "@/components/games-list";
const CharacterList = dynamic(() => import('../components/character-list'), { ssr: false })

export default function GamesPage() {

    const regexPattern = "[0\-9a\-zA\-Z&À\-ÖÙ\-ÿ\\-\\.°~#œŒ]"

    function editGame(gameData) {
        return function (e) {
            console.log(gameData);
        }
    }

    return (
        <Layout>
            <Head>
                <title>Parties gérées - JDR</title>
            </Head>

            <main>
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
                        <GamesList editGame={editGame}/>
                    </div>

                    <div className={styles.characterForm} suppressHydrationWarning>
                        
                    </div>
                </div>
            </main>
        </Layout>
    )
}