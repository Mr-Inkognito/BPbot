const {
    SlashCommandBuilder
} = require('@discordjs/builders');



module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all commands implemented in Arnosht the Bouncer'),


    async execute(interaction) {
        await interaction.reply({
            content: "/help - shows all commands\n/ban - bans user from server and saves them and the reason to The database\n/kick - kicks person",
            ephemeral: true
        });
    }
}