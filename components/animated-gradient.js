import styles from "../styles/components/animated-gradient.module.css"

export default function AnimatedGradient({ children }) {
    return (
        <div className={styles.header}>
            <div className={styles.children}> {children} </div>
        </div>

    )
}