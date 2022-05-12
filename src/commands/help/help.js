const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    MessageEmbed
} = require('discord.js');




module.exports = {

    permission:"SEND_MESSAGES",

    role: false,

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all commands implemented in Arnosht the Bouncer'),


    async execute(interaction) {

        const helpEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("All instructions Arnosht is capable of")
            .setDescription('WARNING: if you do not run the /setup initial command at least once, bot will not function as intended!'.toUpperCase())
            .addFields({
                name: '/help',
                value: 'Shows all commands'
            }, {
                name: '/ban',
                value: 'Bans selected user from server and makes record for them in the central register'
            }, {
                name: '/kick',
                value: 'Kicks selected person from server'
            }, {
                name: '/checkrecord',
                value: 'Checks, if the person provided has a record\n'+
                'Options:\n \t- By tagging a user on the server\n \t- By providing a discord id'
            },{
                name: '/tos',
                value: 'Shows a general TOS used by the bot'
            },{
                name: '/welcomechannel',
                value: 'Settings for channel for new users to be greeted to'
            },{
                name: '/setup initial',
                value: "Initial setup of channels, categories and roles required for the bot to function properly (required)"
            }
            ,{
                name: '/setup features',
                value: "Setup of special features not required for functioning, such as automatic ban or PM warnings"
            })
            .setTimestamp()
            .setFooter({
                text: "Arnosht is here to protect and serve"
            });


            await interaction.followUp({
                ephemeral: true,
                embeds: [helpEmbed]
            });
    }
}