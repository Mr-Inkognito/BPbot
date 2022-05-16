const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
require('dotenv').config();
const ascii = require('ascii-table');


const clientId = '960898693177942097';


module.exports = (client) => {

    const table = new ascii("Commands loaded");

    client.handleCommands = async (commandFolders, path) => {

        client.commandArray = [];

        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
                table.addRow(command.data.name, "COMMAND LOADED ✓")
                
            }
        }


        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

        (async () => {
            try {
                console.log(table.toString());
                console.log('Slash commands refresh started.');

                await rest.put(
                    Routes.applicationCommands(clientId),
                    { 
                        body: client.commandArray
                    },
                );

                console.log('Slash commands refreshed successfully.');
            } catch (error) {
                console.error(error);
            }
        })();

    };
};