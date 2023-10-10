import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/games.json');

function deleteGame(id, gameId, objectData) {
    var i = 0;
    var updatedData = [];

    while (i != objectData.length) {
        var actualData = objectData[i]
        if (actualData.id == id) {
            if (actualData.gameId != gameId) {
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
            const { id, gameId } = req.body;

            var updatedData = deleteGame(id, gameId, objectData);

            await fsPromises.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));
        
            // Send a success response
            res.status(200).json({ message: 'Game deleted successfully'});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error deleting character' });
          }

    }
}    