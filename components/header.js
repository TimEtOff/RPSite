import Link from "next/link"
import styles from "../styles/components/header.module.css"
import Image from "next/image"
import { setCookie, getCookie, hasCookie, deleteCookie } from 'cookies-next';

export default function HeaderComponent() {

    function getServerSideProps() {
     //   setCookie('id', 'CjLPe8w8ls');
        //deleteCookie('id');
        var id = getCookie('id');//  -> !hasCookie('id')
     //   var id = "CjLPe8w8ls";
       
        // By returning { props: { posts } }, the Blog component
        // will receive `posts` as a prop at build time
        return id;
    }

    var id = getServerSideProps();

    function getConnectedOrNot() {
        if (id === "" || id == undefined) {
            return "Se connecter"
        } else {
            return "Connecté"
        }
    }

    return (
        <div className={styles.topnav}>
        
            <div className={styles.logo_link}>
            <Link href="/">
                    <Image
                    width={45}
                    height={45}
                    src="/logo.svg"
                    alt="logo"></Image>
                </Link>
            </div>
    
            <Link className={styles.title} href="/">JDR</Link>
    
            <ul>
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/character">Personnages</Link></li>
                <button suppressHydrationWarning className="tw-bg-neutral-700 hover:tw-bg-red-700 tw-text-white tw-px-5 tw-py-1 tw-text-sm tw-transition tw-ease-in-out tw-delay-40 hover:-tw-translate-y-1 hover:tw-scale-110 tw-duration-300 tw-rounded tw-mx-5 tw-mt-3">{ getConnectedOrNot() }</button>
            </ul>
    
        </div>
    )
}