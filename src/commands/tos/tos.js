const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

    module.exports = {

        permission: "SEND_MESSAGES",

        data: new SlashCommandBuilder()
            .setName('tos')
            .setDescription('Shows the general TOS of the bot'),



    async execute(interaction, client){
        interaction.followUp({
            ephemeral:true,
            embeds:[
                new MessageEmbed()
                    .setColor('AQUA')
                    .setTitle(`${client.user.username} TOS`)
                    .setDescription(`By staying in server protected by ${client.user.username} `+
                    `you agree, that in case of getting banned, your username and Discord ID (publicly available) `+
                    `will be stored in the ${client.user.username} database to provide better moderation on other servers.`)
            ]
        })
    }
}