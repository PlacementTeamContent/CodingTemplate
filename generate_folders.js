const fs = require("fs");

const parent_json_path = "./parent_json";
const output_json_path = "./output_json";
const env_path = "./.env";

const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true, force: true });
    }
}

const createFile = (file_path, content) => {
    fs.writeFile(file_path, content, 'utf8', (err) => {
        if (err) {
            console.error('An error occurred while writing the file:', err);
            return;
        }
        });
}

function start() {
    try {
        createFolder(parent_json_path);
        createFolder(output_json_path);
        createFile(env_path, "PARENT_JSON_FILE_NAME = ")
    } catch (error) {
      console.error("Error during processing:", error);
    }
}
  
start();