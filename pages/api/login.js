import fsPromises from 'fs/promises';
import path from 'path';
import getPassword from "./password"

const dataFilePath = path.join(process.cwd(), 'json/userData.json');

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            // Read the existing data from the JSON file
            const jsonData = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonData);
        
            // Get the data from the request body
            const { name, password } = req.body;

            var newPassword = getPassword(true, password)
            var id;

            var i = 0;
            var found = false;
            while (i != objectData.length) {
                var actualData = objectData[i];
                if (actualData.name === name) {
                    if (actualData.password === newPassword) {
                        id = actualData.id;
                        found = true;
                    }
                }
                i++;
            }
        
            if (found) {
                // Send a success response
                res.status(200).json({ message: 'Password ok', id: id});
            } else {
                res.status(500).json({ message: 'Wrong name/password', id: null });
            }
            
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error during authentication' });
          }

    }
}    