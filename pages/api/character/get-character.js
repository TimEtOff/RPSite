import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/characters.json');

function getCharacter(id, characterId, objectData) {
    var i = 0;

    while (i != objectData.length) {
        var actualData = objectData[i]
        if (actualData.id === id) {
            if (actualData.characterId === characterId) {
                return actualData;
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
            const { id, characterId } = req.body;

            var data = getCharacter(id, characterId, objectData);
        
            // Send a success response
            res.status(200).json({ message: 'Data stored successfully', characterData: data});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error storing data' });
          }

    }
}    