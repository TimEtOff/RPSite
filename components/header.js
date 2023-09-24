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
            return "Non connecté"
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
                <p suppressHydrationWarning >{ getConnectedOrNot() }</p>
            </ul>
    
        </div>
    )
}