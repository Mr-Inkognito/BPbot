const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const {
	MessageActionRow,
	MessageButton,
	MessageEmbed
} = require('discord.js');

var reason;
var user;
var author;

var kickEmbedSucc;
var kickEmbedFail;
var kickEmbedPermFail;

var buttons;

module.exports = {

	permission: "KICK_MEMBERS",

	role: true,

	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks tagged person with specified reason')

		.addUserOption(option =>
			option.setName('user')
			.setDescription('Select a user to kick')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
			.setDescription('Select a reason for kicking')
			.setRequired(true)),



	async execute(interaction) {

		//argument getting and variable filling
		this.user = interaction.options.getMember('user');
		this.author = interaction.member;
		this.reason = interaction.options.getString('reason');


		// embed declaration
		this.kickEmbedSucc = new MessageEmbed()
			.setColor('GREEN')
			.setTitle('Member kicked succesfully')
			.setDescription(`${this.user.user.username} has been kicked succesfully`)
			.addFields({
				name: 'Reason',
				value: this.reason
			})
			.setTimestamp()
			.setFooter({
				text: 'Arnosht is here to protect and serve',
			});

		this.kickEmbedFail = new MessageEmbed()
			.setColor('RED')
			.setTitle('Member kicking failed')
			.setDescription(`${this.user.user.username} has not been kicked`)
			.addFields({
				name: 'Reason',
				value: 'You are not able to kick this person'
			})
			.setTimestamp()
			.setFooter({
				text: 'Arnosht is here to protect and serve',
			});



		//buttons declaration
		this.buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('confirmKick')
				.setLabel('Confirm')
				.setStyle('SUCCESS')

			)
			.addComponents(
				new MessageButton()
				.setCustomId('cancelKick')
				.setLabel('Cancel')
				.setStyle('DANGER')
			);


		//test if command caller has ability to kick desired member
		if (!this.user.kickable) {
			await interaction.followUp({
				embeds: [this.kickEmbedFail],
				ephemeral: true
			});
		} else {

			const embedkickConfirm = new MessageEmbed()
			.setColor('GREY')
			.setTitle(`Are you sure you want to kick ${this.user.user.username}`)
			.setDescription(`Reason: ${this.reason}`)
			
			await interaction.followUp({
				embeds: [embedkickConfirm],
				ephemeral: true,
				components: [this.buttons]
			});

			const collector = interaction.channel.createMessageComponentCollector({
				max: 1
			});
			collector.on('end', x => {
				this.buttons.components[0].setDisabled(true);
				this.buttons.components[1].setDisabled(true);
	
				interaction.editReply({
					embeds: [embedkickConfirm],
					ephemeral: true,
					components: [this.buttons]
				})
			})

		}

	},

	async button(interaction) {

		//cancel embed
		const embedCancel = new MessageEmbed()
			.setColor('RED')
			.setTitle('Action cancelled')
			.setTimestamp()
			.setFooter({
				text: 'Arnosht is here to protect and serve',
			});

		//button test if user confirmed or canceled action
		if (interaction.customId === "confirmKick") {
			this.user.kick(this.reason);
			interaction.followUp({
				embeds: [this.kickEmbedSucc],
				ephemeral: true
			})
		} else if (interaction.customId === "cancelKick") {
			interaction.followUp({
				embeds: [embedCancel],
				ephemeral: true
			})
		}
	}
}