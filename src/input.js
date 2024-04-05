import fs from 'fs'
import {createInterface } from 'readline';
import { generateRandomSequences } from './main.js';


const rl =createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter the Sequenclength of Aminoacid: ", function (Sequenclength) {
    Sequenclength = parseInt(Sequenclength);

    if (isNaN(Sequenclength)) {
        console.error("Invalid input for string length. Please enter a valid number.");
        rl.close();
        return;
    }
    rl.question("Enter the value that how many Number of Sequence you want :", function(numberOfSequences){
        numberOfSequences=parseInt(numberOfSequences)

        const excludedAminoAcids = ['X', 'Z', 'J', 'B', 'U'];
        const randomSequences = generateRandomSequences( Sequenclength, numberOfSequences, excludedAminoAcids);
    writeDataToFile( Sequenclength, randomSequences);

        rl.close();
    }); 
});

const writeDataToFile = (sequenceLength, randomSequences) => {
    const filename = 'output1.txt';
    const data = JSON.stringify(randomSequences);

    fs.writeFile(filename, data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data has been written to', filename);
        }
    });
};

