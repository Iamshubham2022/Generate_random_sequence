const fs = require("fs");
const { promisify } = require("util");

let stored_data;

const execAsync = promisify(require("child_process").exec);

const POST = async (req) => {
  try {
    const { pdb_content } = await req.json();
    if (!pdb_content) {
      console.log("Error: PDB Content is missing");
      return new Response("Error: PDB Content is missing", { status: 400 });
    }
    stored_data = { pdb_content };
    console.log(`The stored data is: ${stored_data.pdb_content}`);
    return new Response("Success", { status: 200 });
  } catch (e) {
    console.log(`Error in POST request: ${e}`);
    return new Response("Error", { status: 500 });
  }
};

const GET = async () => {
  try {
    if (typeof stored_data?.pdb_content === "undefined") {
      console.log("PDB Content is undefined");
      return new Response("Error: PDB Content is undefined", { status: 500 });
    }
    console.log("PDB Content sent by api:", stored_data.pdb_content);
    const path = "./src/components/output.pdb";
    fs.writeFileSync(path, stored_data.pdb_content);
    const command = `pymol ${path}`;
    try {
      await execAsync(command);
    } catch (error) {
      console.error(`Error executing Ribosome: ${error}`);
      return;
    }
    return new Response(JSON.stringify(stored_data.pdb_content), {
      status: 200,
    });
  } catch (e) {
    console.log(`Error in GET request: ${e}`);
    return new Response("Error", { status: 500 });
  }
};

module.exports = { POST, GET };
