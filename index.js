const Discord = require("discord.js");
require('dotenv/config');
const client = new Discord.Client({ intents: 32767 });

client.on("ready", ()=>{
    console.log("bot is ready");
    console.log("version 1.0");
    console.log("bot is online");
});

client.login(process.env.TOKEN);