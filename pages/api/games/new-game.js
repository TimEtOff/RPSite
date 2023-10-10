import { Character } from '@/components/character/character';
import fsPromises from 'fs/promises';
import path from 'path';
import { makeid } from "../register"

const dataFilePath = path.join(process.cwd(), 'json/games.json');

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            // Read the existing data from the JSON file
            const jsonData = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonData);
        
            // Get the data from the request body
            const { id } = req.body;
            var gameId = makeid(10);

            // Add the new data to the object
            const newData = {
              id,
              gameId: gameId,
              name: "Nouvelle partie",
              specialCat1: "",
              specialCat2: "",
              characters: []
            };
            /**
             * characters model:
             * [{
             *    id,
             *    character (Character class),
             *    inventory: [{
             *        (Item class)
             *    }, {}]
             * }, {}]
             */
            
            objectData.push(newData);
        
            // Convert the object back to a JSON string
            const updatedData = JSON.stringify(objectData, null, 2);
        
            // Write the updated data to the JSON file
            await fsPromises.writeFile(dataFilePath, updatedData);
        
            // Send a success response
            res.status(200).json({ message: 'Data stored successfully', gameId:gameId});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error storing data' });
          }

    }
}    