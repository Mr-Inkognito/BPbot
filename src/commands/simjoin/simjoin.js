const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    permission: "SEND_MESSAGES",

    data: new SlashCommandBuilder()
        .setName('simjoin')
        .setDescription('simulates person joining the server'),
        

    async execute(interaction, client){

        var member = interaction.member;
        client.emit('guildMemberAdd', member);

        await interaction.followUp({content: "Simulated join event", ephemeral: true});
    }
}