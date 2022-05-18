const { SlashCommandBuilder } = require('@discordjs/builders');

    module.exports = {

        permission: "ADMINISTRATOR", //BAN_MEMBERS, SEND_MESSAGES, MANAGE_MESSAGES...

        role: false, // true

        cooldown: "15s", //12h, 10s, 15h...

        data: new SlashCommandBuilder()
            .setName('testcommand')
            .setDescription('This is a test command'),



    async execute(interaction){

        interaction.followUp({
            content: "this is a response",
            ephemeral: true
        })

    }
}

