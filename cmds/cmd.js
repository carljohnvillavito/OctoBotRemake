const axios = require('axios');

const GITHUB_TOKEN = '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'; // Replace with your GitHub token
const REPO_OWNER = 'CjsPortfolio';
const REPO_NAME = 'OctoBotRemake';
const BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

let currentPath = '/';

const getGithubHeaders = () => ({
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
});

const listFiles = async (path) => {
    const response = await axios.get(`${BASE_URL}${path}`, { headers: getGithubHeaders() });
    return response.data;
};

const createFile = async (path, content) => {
    await axios.put(`${BASE_URL}${path}`, {
        message: `Created file ${path}`,
        content: Buffer.from(content).toString('base64')
    }, { headers: getGithubHeaders() });
};

const deleteFile = async (path, sha) => {
    await axios.delete(`${BASE_URL}${path}`, {
        headers: getGithubHeaders(),
        data: {
            message: `Deleted file ${path}`,
            sha: sha
        }
    });
};

const getFileContent = async (path) => {
    const response = await axios.get(`${BASE_URL}${path}`, { headers: getGithubHeaders() });
    return Buffer.from(response.data.content, 'base64').toString('utf8');
};

const updateFile = async (path, content, sha) => {
    await axios.put(`${BASE_URL}${path}`, {
        message: `Updated file ${path}`,
        content: Buffer.from(content).toString('base64'),
        sha: sha
    }, { headers: getGithubHeaders() });
};

module.exports = {
    description: "File system commands",
    role: "admin", // Only admin can use these commands
    cooldown: 5,
    credits: "User",
    execute: async function(api, event, args, commands) {
        const command = args[0];
        const argument = args[1];
        const content = args.slice(2).join(' ');

        switch (command) {
            case 'cd':
                if (argument === '..') {
                    currentPath = currentPath.split('/').slice(0, -2).join('/') + '/';
                } else {
                    currentPath += `${argument}/`;
                }
                api.sendMessage(`Changed directory to ${currentPath}`, event.threadID, event.messageID);
                break;

            case 'ls':
                try {
                    const files = await listFiles(currentPath);
                    const fileList = files.map(file => file.name).join('\n');
                    api.sendMessage(`Files in ${currentPath}:\n${fileList}`, event.threadID, event.messageID);
                } catch (error) {
                    api.sendMessage(`❌| Error listing files: ${error.message}`, event.threadID, event.messageID);
                }
                break;

            case 'pwd':
                api.sendMessage(`Current directory: ${currentPath}`, event.threadID, event.messageID);
                break;

            case 'add':
            case 'create':
                try {
                    await createFile(`${currentPath}${argument}`, content);
                    api.sendMessage(`Created file ${argument}`, event.threadID, event.messageID);
                } catch (error) {
                    api.sendMessage(`❌| Error creating file: ${error.message}`, event.threadID, event.messageID);
                }
                break;

            case 'delete':
                try {
                    const filesToDelete = await listFiles(currentPath);
                    const fileToDelete = filesToDelete.find(file => file.name === argument);
                    if (fileToDelete) {
                        await deleteFile(fileToDelete.path, fileToDelete.sha);
                        api.sendMessage(`Deleted file ${argument}`, event.threadID, event.messageID);
                    } else {
                        api.sendMessage(`File ${argument} not found`, event.threadID, event.messageID);
                    }
                } catch (error) {
                    api.sendMessage(`❌| Error deleting file: ${error.message}`, event.threadID, event.messageID);
                }
                break;

            case 'edit':
                try {
                    const filesToEdit = await listFiles(currentPath);
                    const fileToEdit = filesToEdit.find(file => file.name === argument);
                    if (fileToEdit) {
                        await updateFile(fileToEdit.path, content, fileToEdit.sha);
                        api.sendMessage(`Edited file ${argument}`, event.threadID, event.messageID);
                    } else {
                        api.sendMessage(`File ${argument} not found`, event.threadID, event.messageID);
                    }
                } catch (error) {
                    api.sendMessage(`❌| Error editing file: ${error.message}`, event.threadID, event.messageID);
                }
                break;

            case 'help':
                api.sendMessage(
                    "Available commands:\n" +
                    "cd <foldername> - Change directory\n" +
                    "cd .. - Go up one directory\n" +
                    "ls - List files in the current directory\n" +
                    "add <filename> <content> - Add a new file\n" +
                    "create <filename> <content> - Create a new file\n" +
                    "delete <filename> - Delete a file\n" +
                    "edit <filename> <content> - Edit a file\n" +
                    "pwd - Print working directory\n" +
                    "help - Display available commands",
                    event.threadID, event.messageID
                );
                break;

            default:
                api.sendMessage("Unknown command. Use 'help' to see available commands.", event.threadID, event.messageID);
        }
    }
};
