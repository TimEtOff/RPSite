import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/games.json');

function getGameIndex(id, gameId, objectData) {
    var i = 0;

    while (i != objectData.length) {
        var actualData = objectData[i]
        if (actualData.id === id) {
            if (actualData.gameId === gameId) {
                return i;
            }
        }
        i++;
    }

    return null;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            // Read the existing data from the JSON file
            const jsonData = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonData);
        
            // Get the data from the request body
            const { id, gameId, name, specialCat1, specialCat2, characters } = req.body;

            // Add the new data to the object
            const newData = {
                id,
                gameId,
                name,
                specialCat1,
                specialCat2,
                characters
            };
            /**
             * characters model:
             * [{
             *    id,
             *    characterId (true characterId + makeId(4)),
             *    userName,
             *    luck, 
             *    level,
             *    availablePoints,
             *    character (Character class),
             *    inventory: [{
             *        (Item class)
             *    }, {}]
             * }, {}]
             */

            objectData[getGameIndex(id, gameId, objectData)] = newData;
        
            // Convert the object back to a JSON string
            const updatedData = JSON.stringify(objectData, null, 2);
        
            // Write the updated data to the JSON file
            await fsPromises.writeFile(dataFilePath, updatedData);
        
            // Send a success response
            res.status(200).json({ message: 'Data stored successfully'});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error storing data' });
          }

    }
}    