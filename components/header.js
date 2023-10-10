import Link from "next/link"
import Router from 'next/router';
import styles from "../styles/components/header.module.css"
import Image from "next/image"
import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';

export default function HeaderComponent() {

    function getConnectedOrNot() {
        var id = getCookie('id');
        if (id == "" || id == undefined) {
            return "Se connecter"
        } else {
            return "Connecté (" + getCookie('name') + ")"
        }
    }

    function buttonClicked() {
        if (hasCookie('id')) {
            var disconnect = confirm("Vous êtes déjà connecté en tant que " + getCookie('name') + ", vous déconnecter ?");
            if (disconnect) {
                deleteCookie('id');
                deleteCookie('name');
            }
        } 
        Router.push('/login');
    }

    return (
        <div className={styles.topnav}>
        
            <div className={styles.logo_link}>
            <Link href="/">
                    <Image
                    width={42}
                    height={42}
                    src="/logo.svg"
                    alt="logo"></Image>
                </Link>
            </div>
    
            <Link className={styles.title} href="/">JDR</Link>
    
            <ul>
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/character">Personnages</Link></li>
                <li><Link href="/games">Parties</Link></li>
                <button suppressHydrationWarning className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-5 tw-mt-3" onClick={buttonClicked} >{ getConnectedOrNot() }</button>
            </ul>
    
        </div>
    )
}