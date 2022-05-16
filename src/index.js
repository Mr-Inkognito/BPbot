//imports
const Discord = require("discord.js");
const fs = require('fs');
const config = require("./botconfig.json");
require('dotenv').config();

//declarations
const client = new Discord.Client({ intents: 32767 });
client.commands = new Discord.Collection();

const funcions = fs.readdirSync('./src/functions').filter(file => file.endsWith(".js"));

//event handler
require("./functions/Events")(client);

//commands handler
const commandFolders = fs.readdirSync('./src/commands');


//bot start
(async () => {

    for(file of funcions){
        require(`./functions/${file}`)(client);
    }

    client.handleCommands(commandFolders, "./src/commands");

    client.login(process.env.TOKEN);
})();

