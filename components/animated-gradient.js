import styles from "../styles/components/animated-gradient.module.css"

export default function AnimatedGradient({ children, height }) {
    if (height == undefined) {
        height = "50vh";
    }
    
    return (
        <div className={styles.header} style={{height: height}}>
            <div className={styles.children}> {children} </div>
        </div>

    )
}