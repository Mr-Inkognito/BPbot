const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js');




module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all commands implemented in Arnosht the Bouncer'),


    async execute(interaction) {

        const helpEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("All instructions Arnosht is capable of")
            .addFields({
                name: '/help',
                value: 'Shows all commands'
            }, {
                name: '/ban',
                value: 'Bans selected user from server and makes record for them in the central register'
            }, {
                name: '/kick',
                value: 'Kicks selected person from server'
            }, )
            .setTimestamp()
            .setFooter({
                text: "Arnosht is here to protect and serve"
            });


            await interaction.reply({
                ephemeral: true,
                embeds: [helpEmbed]
            });
    }
}