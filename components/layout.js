import styles from '../styles/components/layout.module.css';
import HeaderComponent from './header';
import FooterComponent from './footer';
import Head from 'next/head';

export const siteTitle = 'Next.js Sample Website';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/logo.ico" />
      </Head>

      <HeaderComponent></HeaderComponent>

      <div className={styles.container}>
        {children}

        <style>{`
         html, body {
           background: #121212;
         }
         main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #212121;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
          Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
          sans-serif;
        }
        * {
          box-sizing: border-box;
        }
         `
        }</style>
      </div>

    </div>
  );

  /*  original fonts:  -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif; */
}