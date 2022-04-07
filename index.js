const Discord = require("discord.js");
require('dotenv/config');
const config = require("./botconfig.json");
const client = new Discord.Client({ intents: 32767 });

client.on("ready", ()=>{
    console.log("bot is ready");
    console.log("version 1.0");
    console.log("bot is online");
});

client.on("messageCreate", (message)=>{
    if(message.author.bot){
        return;
    }
    if(message.content.startsWith(config.prefix)){
        message.channel.send("I work");
    }
});

client.login(process.env.TOKEN);