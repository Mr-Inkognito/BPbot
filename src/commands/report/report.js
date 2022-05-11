const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const botconfig = require("../../botconfig.json");

const {
    Permissions
} = require("discord.js");



module.exports = {

    permission: "SEND_MESSAGES",

    role: false,

    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Discretely report user directly to server moderation team'),



    async execute(interaction) {

        

        interaction.followUp({
            content: "command worked",
            ephemeral: true
        });
    }
}