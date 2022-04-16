const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

var reason;
var user;
var author;

module.exports = {

    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks tagged person with specified reason')
		.addUserOption(option => 
			option.setName('target')
			.setDescription('Select a user to kick')
			.setRequired(true)),

        

    async execute(interaction){

		this.user = interaction.options.getUser('target');
        this.author = interaction.member;
       

        if(!this.author.permissions.has('KICK_MEMBERS')){
            await interaction.reply({content: "You can not use this command!", ephemeral: true});
        }
        else{
            await interaction.reply({content: "I kick u bish", ephemeral: true});
        }

       


    }, 

	async menu(interaction){

		this.reason = interaction.values;

		const buttons = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('confirm')
				.setLabel('Confirm')
				.setStyle('SUCCESS')
				
		)
		.addComponents(
			new MessageButton()
				.setCustomId('storno')
				.setLabel('Storno')
				.setStyle('DANGER')
		);

		interaction.reply({
			content: `Are you sure you want to ban ${this.user.username}`, 
			ephemeral: true,
			components: [buttons]

		});
	},

	async button(interaction){
		if(interaction.customId === "confirm"){
			interaction.reply({
				content: `You banned ${this.user.username}, fok them`,
				ephemeral: true
			})
		}
		else if(interaction.customId === "storno"){
			interaction.reply({
				content: "ok not banning them then :(",
				ephemeral: true
			})
		}
	}
}