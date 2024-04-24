const { exec } = require('child_process');
const fs = require('fs');
const { promisify } = require('util');
const random = require('random');

let storedParameters;

const aminoAcidThreeLetterCodes = {
  A: 'Ala',
  C: 'Cys',
  D: 'Asp',
  E: 'Glu',
  F: 'Phe',
  G: 'Gly',
  H: 'His',
  I: 'Ile',
  K: 'Lys',
  L: 'Leu',
  M: 'Met',
  N: 'Asn',
  P: 'Pro',
  Q: 'Gln',
  R: 'Arg',
  S: 'Ser',
  T: 'Thr',
  V: 'Val',
  W: 'Trp',
  Y: 'Tyr',
};

const execAsync = promisify(exec);

const generateRandomSequences = async (
  sequenceLength,
  numberOfSequences,
  excluded_amino_acids
) => {
  const randomSequences = [];

  for (let n = 0; n < numberOfSequences; n++) {
    const randomSequence = await generateRandomSequence(sequenceLength);
    randomSequences.push(randomSequence);
  }

  return randomSequences;
};

const generateRandomSequence = async (
  sequenceLength,
  excluded_amino_acids = []
) => {
  const aminoAcids = [
    'A','C','D','E','F','G','H','I','K','L','M','N','P','Q','R','S','T','V','W','Y',
  ];
  let randomSequence = '';
  let entire_sequence = {};
  let ribContent = 'title SEQUENCE\r\n \r\n';
  ribContent += 'default helix\r\n \r\n';
  let pdbContent = '';

  for (let i = 0; i < sequenceLength; i++) {
    const filteredAminoAcids = aminoAcids.filter(
      (acid) => !excluded_amino_acids.includes(acid)
    );

    const randomAminoAcid =
      filteredAminoAcids[random.int(0, filteredAminoAcids.length - 1)].toUpperCase();
    randomSequence += randomAminoAcid;

    const threeLetterCode = aminoAcidThreeLetterCodes[randomAminoAcid];
    const code = threeLetterCode.toUpperCase();

    const phi_angle = random.float(-90, 90);
    const chi_angle = random.float(-90, 90);

    ribContent += `res ${code} phi ${phi_angle.toFixed(
      2
    )} psi ${chi_angle.toFixed(2)} \r\n`;

    const ribId = random.int(0, 1000);
    console.log(`RibId: ${ribId}`);

    const ribFilename = `./src/app/api/generate_sequences/sequence${ribId}.rib`;
    fs.writeFileSync(ribFilename, ribContent);
    const pdbFilename = `./src/app/api/generate_sequences/sequence${ribId}.pdb`;

    const command = `./src/app/api/generate_sequences/ribosome ${ribFilename} ${pdbFilename} ./src/app/api/generate_sequences/res.zmat`;

    try {
      await execAsync(command);

      const temp_pdbContent = fs.readFileSync(pdbFilename, 'utf8');
      pdbContent += temp_pdbContent;
      fs.unlinkSync(pdbFilename);
      fs.unlinkSync(ribFilename);
    } catch (error) {
      console.error(`Error executing Ribosome: ${error}`);
      return;
    }
  }

  const phi = random.float(-90, 90);
  const chi = random.float(-90, 90);

  entire_sequence = {
    id: random.int(0, 10000),
    sequence: randomSequence,
    phi_angle: phi,
    chi_angle: chi,
    rib_content: ribContent,
    pdb_content: pdbContent,
  };

  console.log(ribContent);

  return entire_sequence;
};

const POST = async (req) => {
  try {
    const { excludedAminoAcids, sequenceLength, numberOfSequences } = await req.json();

    storedParameters = {
      excludedAminoAcids,
      sequenceLength,
      numberOfSequences,
    };

    return new Response('Success', { status: 200 });
  } catch (e) {
    console.log(`Error in POST request: ${e}`);
    return new Response('Error', { status: 500 });
  }
};

const GET = async () => {
  try {
    const { excludedAminoAcids, sequenceLength, numberOfSequences } = storedParameters;
    const randomSequences = await generateRandomSequences(
      sequenceLength,
      numberOfSequences,
      excludedAminoAcids
    );

    return new Response(JSON.stringify(randomSequences), { status: 200 });
  } catch (e) {
    console.log(`Error in GET request: ${e}`);
    return new Response('Error', { status: 500 });
  }
};
