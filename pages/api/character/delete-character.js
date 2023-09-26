import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/characters.json');

function deleteCharacter(id, characterId, objectData) {
    var i = 0;
    var updatedData = [];

    while (i != objectData.length) {
        var actualData = objectData[i]
        if (actualData.id == id) {
            if (actualData.characterId != characterId) {
                updatedData.push(actualData);
            }
        } else {
            updatedData.push(actualData);
        }
        i++;
    }

    return updatedData;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            // Read the existing data from the JSON file
            const jsonData = await fsPromises.readFile(dataFilePath);
            var objectData = JSON.parse(jsonData);
        
            // Get the data from the request body
            const { id, characterId } = req.body;

            var updatedData = deleteCharacter(id, characterId, objectData);

            await fsPromises.writeFile(dataFilePath, JSON.stringify(updatedData));
        
            // Send a success response
            res.status(200).json({ message: 'Character deleted successfully'});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error deleting character' });
          }

    }
}    