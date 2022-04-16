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

		//test if command caller has moderator role


		//Perms testing for kick members
		if (this.author.permissions.has('KICK_MEMBERS')) {
			//test if command caller has ability to kick desired member
			if (!this.user.kickable) {
				await interaction.reply({
					embeds: [this.kickEmbedFail],
					ephemeral: true
				});
			} else {

				//this.user.kick(this.reason);
				await interaction.reply({
					content: `Are you sure you want to kick ${this.user.user.username}`,
					ephemeral: true,
					components: [this.buttons]
				});

			}
		} else {
			await interaction.reply({
				embeds: [this.kickEmbedPermFail],
				ephemeral: true
			});
		}

	},

	async button(interaction) {

		//cancel embed
		const embedCancel = new MessageEmbed()
			.setColor('RED')
			.setTitle('Canceling command...')
			.setTimestamp()
			.setFooter({
				text: 'Arnosht is here to protect and serve',
			});

		//button test if user confirmed or canceled action
		if (interaction.customId === "confirmKick") {
			interaction.reply({
				embeds: [this.kickEmbedSucc],
				ephemeral: true
			})
		} else if (interaction.customId === "cancelKick") {
			interaction.reply({
				embeds: [embedCancel],
				ephemeral: true
			})
		}
	}
}