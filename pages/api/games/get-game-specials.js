import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/games.json');

function getGame(gameId, objectData) {
    var i = 0;

    while (i != objectData.length) {
        var actualData = objectData[i]
        if (actualData.gameId == gameId) {
            return actualData;
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
            const { gameId } = req.body;

            var data = getGame(gameId, objectData);
            var special1 = "Special1"
            var special2 = "Special2"
            if (data != null) {
                special1 = data.specialCat1;
                special2 = data.specialCat2;
            }
        
            // Send a success response
            res.status(200).json({ message: 'Data found successfully', specialCat1:special1, specialCat2:special2});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error searching data' });
          }

    }
}    