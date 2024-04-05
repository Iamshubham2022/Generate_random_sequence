import random from 'random';

const aminoAcidThreeLetterCodes = {
    'A': 'Ala',
    'C': 'Cys',
    'D': 'Asp',
    'E': 'Glu',
    'F': 'Phe',
    'G': 'Gly',
    'H': 'His',
    'I': 'Ile',
    'K': 'Lys',
    'L': 'Leu',
    'M': 'Met',
    'N': 'Asn',
    'P': 'Pro',
    'Q': 'Gln',
    'R': 'Arg',
    'S': 'Ser',
    'T': 'Thr',
    'V': 'Val',
    'W': 'Trp',
    'Y': 'Tyr'
};

const generateRandomSequences = (sequenceLength, numberOfSequences, excludedAminoAcids) => {
    const randomSequences = [];

    for (let n = 0; n < numberOfSequences; n++) {
        const randomSequence = generateRandomSequence(sequenceLength, excludedAminoAcids);
        randomSequences.push(randomSequence);
    }
    return randomSequences;
}

const generateRandomSequence = (sequenceLength, excludedAminoAcids = []) => {
    const aminoAcids = [
        "A", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "Y",
    ];
    let randomSequence = "";
    let entire_sequence = {};

    let ribContent = "title RIBOSOME\n";
    ribContent += "default helix\n";

    for (let i = 0; i < sequenceLength; i++) {
        const filteredAminoAcids = aminoAcids.filter(acid => !excludedAminoAcids.includes(acid));
        const randomAminoAcid = filteredAminoAcids[random.int(0, filteredAminoAcids.length - 1)].toUpperCase();
        randomSequence += randomAminoAcid;

        const threeLetterCode = aminoAcidThreeLetterCodes[randomAminoAcid];
        const code = threeLetterCode.toLowerCase();

        const phi_angle = random.float(-90, 90);
        const chi_angle = random.float(-90, 90);

        ribContent += `res ${code}   phi  ${phi_angle.toFixed(1)}  psi ${chi_angle.toFixed(1)}\n`;
    }

    entire_sequence = {
        id: random.int(0, 10000),
        sequence: randomSequence,
        rib_content: ribContent,
    };

    console.log(ribContent);

    return entire_sequence;
}

export { generateRandomSequences };