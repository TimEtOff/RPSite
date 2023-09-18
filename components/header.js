import Link from "next/link"
import styles from "../styles/components/header.module.css"
import Image from "next/image"

export default function HeaderComponent() {
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
            </ul>

        </div>
    )
}