import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/characters.json');

function getCharacters(id, objectData) {
    var i = 0;
    var allCharacters = [];
    var length = Object.keys(objectData).length;

    while (i != length) {
        var actualData = objectData[i]
        if (actualData.id === id) {
            allCharacters.push(actualData);
        }
        i++;
    }

    return allCharacters;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            // Read the existing data from the JSON file
            const jsonData = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonData);
        
            // Get the data from the request body
            const { id } = req.body;

            var characters = getCharacters(id, objectData);
        
            // Send a success response
            res.status(200).json({ message: 'Data stored successfully', characters: characters});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error storing data' });
          }

    }
}    