import fsPromises from 'fs/promises';
import path from 'path';
import getPassword from "./password"

const dataFilePath = path.join(process.cwd(), 'json/userData.json');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export { makeid }

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            // Read the existing data from the JSON file
            const jsonData = await fsPromises.readFile(dataFilePath);
            const objectData = JSON.parse(jsonData);
        
            // Get the data from the request body
            const { name, password } = req.body;

            var id = makeid(10);
            var newPassword = getPassword(password)

            var i = 0;
            var nameUsed = false;
            while (i != objectData.length) {
                var actualData = objectData[i];
                if (actualData.name == name) {
                    nameUsed = true;
                }
                i++;
            }

            if (nameUsed) {
              res.status(500).json({ message: 'Name already used', id: null});
              return;
            }

            // Add the new data to the object
            const newData = {
              id:id,
              name,
              password:newPassword
            };
            objectData.push(newData);
        
            // Convert the object back to a JSON string
            const updatedData = JSON.stringify(objectData, null, 2);
        
            // Write the updated data to the JSON file
            await fsPromises.writeFile(dataFilePath, updatedData);
        
            // Send a success response
            res.status(200).json({ message: 'Data stored successfully', id: id});
          } catch (error) {
            console.error(error);
            // Send an error response
            res.status(500).json({ message: 'Error storing data' });
          }

    }
}    