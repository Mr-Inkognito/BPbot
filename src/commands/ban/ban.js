const {
	SlashCommandBuilder
} = require('@discordjs/builders');
const {
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
	MessageEmbed
} = require('discord.js');

const banReasons = require("../../models/banReasons");

var reason;
var user;
var author;

module.exports = {

	permission: "BAN_MEMBERS",

	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans person and saves their discord credits to database')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('Select a user')
			.setRequired(true)),



	async execute(interaction) {

		this.user = interaction.options.getMember('user');
		this.author = interaction.member;

		if (!this.user.bannable) {
			const banEmbedFail = new MessageEmbed()
				.setColor('RED')
				.setTitle('Member banning failed')
				.setDescription(`${this.user.user.username} has not been banned`)
				.addFields({
					name: 'Reason',
					value: 'You are not able to ban this person'
				})
				.setTimestamp()
				.setFooter({
					text: 'Arnosht is here to protect and serve',
				});

			interaction.reply({
				embeds: [banEmbedFail],
				ephemeral: true
			})
		} else {
			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([{
							label: 'Harrasment',
							description: 'This person is harrasing others and repeatetly broke the rules',
							value: 'harrasment',
						},
						{
							label: 'Stolen/bot account',
							description: 'This account has been stolen or contains a malicious script',
							value: 'botacc',
						},
					]),
				);
				

				const reasonPickerEmbed = new MessageEmbed()
				.setColor('GREY')
				.setTitle(`Reason to ban **${this.user.user.username}**`)
				.setDescription(`Specify a reason for why you want to ban this user`);


			await interaction.reply({
				embeds:[reasonPickerEmbed],
				components: [row],
				ephemeral: true
			});
		}
	},

	async menu(interaction) {

		this.reason = interaction.values.toString();

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('confirm')
				.setLabel('Confirm')
				.setStyle('SUCCESS')

			)
			.addComponents(
				new MessageButton()
				.setCustomId('cancel')
				.setLabel('Cancel')
				.setStyle('DANGER')
			);

			const confirmEmbed = new MessageEmbed()
			.setColor('GREY')
			.setTitle(`Are you sure you want to ban **${this.user.user.username}**`)
			.setDescription(`Reason: ${banReasons.execute(this.reason)}`);


		interaction.reply({
			embeds:[confirmEmbed],
			ephemeral: true,
			components: [buttons]

		});
	},

	async button(interaction) {

		const banEmbedSucc = new MessageEmbed()
			.setColor('GREEN')
			.setTitle('Member banned succesfully')
			.setDescription(`${this.user.user.username} has been banned succesfully and record has been created`)
			.addFields({
				name: 'Reason',
				value: banReasons.execute(this.reason)
			})
			.setTimestamp()
			.setFooter({
				text: 'Arnosht is here to protect and serve',
			});

		const embedCancel = new MessageEmbed()
			.setColor('RED')
			.setTitle('Canceling command...')
			.setTimestamp()
			.setFooter({
				text: 'Arnosht is here to protect and serve',
			});


		if (interaction.customId === "confirm") {

			this.user.ban({days: 7, reason: banReasons.execute(this.reason)});
			interaction.reply({
				embeds:[banEmbedSucc],
				ephemeral: true
			})
		} else if (interaction.customId === "cancel") {
			interaction.reply({
				embeds:[embedCancel],
				ephemeral: true
			})
		}
	}
}