import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/characters.json');
const dataFilePathUsers = path.join(process.cwd(), 'json/userData.json');

function getUserName(id, objectDataUsers) {
    var i = 0;
    var length = Object.keys(objectDataUsers).length;

    while (i != length) {
        var actualData = objectDataUsers[i]
        if (actualData.id === id) {
            return actualData.name;
        }
        i++;
    }
    return null;
}

function getChars(id, gameId, objectData, objectDataUsers) {
    var i = 0;
    var allChars = [];
    var length = Object.keys(objectData).length;

    while (i != length) {
        var actualData = objectData[i]
        if (actualData.gameId === gameId) {
            var username = getUserName(actualData.id, objectDataUsers);
            allChars.push({
                id: actualData.id,
                gameId: actualData.id,
                characterId: actualData.characterId,
                character: actualData.character,
                userName: username
            });
        }
        i++;
    }

    return allChars;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            // Read the existing data from the JSON file
            const jsonData = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonData);

            const jsonDataUsers = await fsPromises.readFile(dataFilePathUsers);
            const objectDataUsers = JSON.parse(jsonDataUsers);
        
            // Get the data from the request body
            const { id, gameId } = req.body;

            var chars = getChars(id, gameId, objectData, objectDataUsers);
        
            // Send a success response
            res.status(200).json({ message: 'Data stored successfully', characters: chars});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error storing data' });
          }

    }
}    