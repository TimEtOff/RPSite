import Layout from "@/components/layout";
import Head from "next/head";
import styles from "../styles/login.module.css"
import AnimatedGradient from "@/components/animated-gradient";
import { useState } from "react";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";

export default function Login() {

    const [register, setRegister] = useState(false)
    const router = useRouter();

    function handleSubmit(e) {
        e.preventDefault();

        if (hasCookie('id') && hasCookie('name')) {
            var disconnect = confirm("Vous êtes déjà connecté en tant que " + getCookie('name') + ", vous déconnecter ?");
            if (disconnect) {
                deleteCookie('id');
                deleteCookie('name');
                router.reload();
            } else {
                return;
            }
        }

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        if (register) {
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: formJson.name, password: formJson.password }),
            })
            .then((res) => res.json())
            .then((json) => {
                var id = json.id;
                if (id == null) {
                    alert("Nom déjà utilisé, changez-le.")
                } else if (id == undefined) {
                    alert("Erreur lors de l'inscription.")
                } else {
                    setCookie('id', id);
                    setCookie('name', formJson.name)
                }
            })
        } else {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: formJson.name, password: formJson.password }),
            })
            .then((res) => res.json())
            .then((json) => {
                var id = json.id;
                if (id == null) {
                    alert("Nom ou mot de passe incorrect, veuillez réessayer.")
                } else if (id == undefined) {
                    alert("Erreur lors de la connexion.")
                } else {
                    setCookie('id', id);
                    setCookie('name', formJson.name);
                }
            })
        }

    }

    return(
        <Layout>
            <Head>
                <title>Connexion - JDR</title>
            </Head>

            <main>

                <AnimatedGradient height={"90vh"}>
                    <div className={styles.wrapper}>
                        <div className={styles.formBox}>
                            <h2>Connexion</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.inputBox}>
                                    <input type="text" name="name" required></input>
                                    <label>Nom</label>
                                </div>
                                <div className={styles.inputBox}>
                                    <input type="password" name="password" required></input>
                                    <label>Mot de passe</label>
                                </div>
                                <button onClick={() => {setRegister(false); document.forms[0].submit()}} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-float-left tw-mt-3">
                                    Connexion
                                </button>
                                <button onClick={() => {setRegister(true); document.forms[0].submit()}} className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-float-right tw-mt-3">
                                    Inscription
                                </button>
                            </form>
                        </div>
                    </div>
                </AnimatedGradient>

            </main>
        </Layout>
    )
}