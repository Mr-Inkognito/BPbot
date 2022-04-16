const { SlashCommandBuilder } = require('@discordjs/builders');
//const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Sets the welcome channel')
        .setDefaultPermission(false)
        .addChannelOption(option => 
			option.setName('channel')
			.setDescription('Select a channel to sent the welcome message into')
			.setRequired(true)
        )
        .addStringOption(option => 
            option.setName('text')
            .setDescription('Welcome message to be displayed')
            .setRequired(true)
        ),
        
      
          
        

    async execute(interaction){
        await interaction.reply({content: "reee", ephemeral: true});
    }
}
