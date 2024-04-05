import fs from 'fs'

const convertToRIBFormat = (data) => {
    let ribContent = "title RIBOSOME\ndefault helix\n";
    
    data.forEach((item) => {
        const { sequence, rib_content } = item;
        const lines = rib_content.split('\n').slice(2); // Exclude first two lines
        
        lines.forEach((line) => {
            const parts = line.split(/\s+/);
            if (parts.length >= 5) {
                const [ res, aminoacid,__, phi,___, psi] = parts;
                const Amin = aminoacid.toUpperCase() 
                ribContent += `res ${Amin}   phi  ${phi}  psi ${psi}\n`;
            } 
            
        });
    });

    return ribContent;
};

const inputFilename = 'output1.txt';
const outputFilename = 'output2.rib';

fs.readFile(inputFilename, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const inputData = JSON.parse(data);
        const ribContent = convertToRIBFormat(inputData);

        fs.writeFile(outputFilename, ribContent, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Data has been written to', outputFilename);
            }
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});
