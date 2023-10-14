## Updated and more portable version of [RPGame](https://github.com/TimEtOff/RPGame)

## Setup/Fork/Fetch
- Run [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) to setup Nextjs project.
- Install these modules (with `npm install` or equivalent):
    - `cookies-next`
    - `fs`
    - `--save-dev typescript @types/react @types/node`
    - `@nextui-org/dropdown`
    - *(`crypto-js` can be used for password encryption)*
- Pull github repository.
- Create `json/` folder with these files:
    - `json/characters.json` file with `[]` in it.
    - `json/userData.json` with `[]` in it.
    - `json/games.json` with `[]` in it.
- Create a `pages/api/password.js` file with the following function:
    ```js
    export default function getPassword(password) {
        // Do your things

        return valueThatWillBeCompared
    }   
    ```
**Port used:** 3002