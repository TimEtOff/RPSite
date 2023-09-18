import fsPromises from 'fs/promises';
import path from 'path';
import { Character } from "@/components/character/character";

const dataFilePath = path.join(process.cwd(), 'json/userData.json');

export default async function handler(req, res) {
    if (req.method==='GET') {

        if (req.body.startsWith("Character[")) {
            var character = Character.getFromString(req.body);

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'max-age=180000');
            res.end(JSON.stringify("Personnage nommé " + character.getFullName()));

        }

    } else if (req.method === 'POST') {

        try {
            // Read the existing data from the JSON file
            const jsonData = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonData);
        
            // Get the data from the request body
            const { name, email } = req.body;
            // Add the new data to the object
            const newData = {
              name,
              email
            };
            objectData.push(newData);
        
            // Convert the object back to a JSON string
            const updatedData = JSON.stringify(objectData);
        
            // Write the updated data to the JSON file
            await fsPromises.writeFile(dataFilePath, updatedData);
        
            // Send a success response
            res.status(200).json({ message: 'Data stored successfully' });
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error storing data' });
          }

    }
}    