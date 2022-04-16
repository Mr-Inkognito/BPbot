const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

var reason;
var user;

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans person and saves their discord credits to database')
		.addUserOption(option => 
			option.setName('target')
			.setDescription('Select a user')
			.setRequired(true)),

        

    async execute(interaction){

		this.user = interaction.options.getUser('target');


        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'Harrasment',
							description: 'This person is harrasing others and repeatetly broken the rules',
							value: 'harrasment',
						},
						{
							label: 'Stolen/bot account',
							description: 'This account has been stolen or contains a malicious script',
							value: 'botacc',
						},
					]),
			);


		


        await interaction.reply({content: "Reason for ban", components: [row], ephemeral: true});
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