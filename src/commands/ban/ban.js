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
const banSchema = require("../../models/banDatabaseSchema");

var reason;
var user;
var author;
var days;
var guild;

module.exports = {

	permission: "BAN_MEMBERS",

	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans person and saves their discord credits to database')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('Select a user')
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName('days')
			.setDescription('Number of days of messages to delete')
			.setRequired(true)
			.addChoice('0', 0)
			.addChoice('1', 1)
			.addChoice('2', 2)
			.addChoice('3', 3)
			.addChoice('4', 4)
			.addChoice('5', 5)
			.addChoice('6', 6)
			.addChoice('7', 7)),



	async execute(interaction) {

		this.user = interaction.options.getMember('user');
		this.author = interaction.member;
		this.days = interaction.options.getInteger('days');
		this.guild = interaction.guild;

		//check if bot is able to ban the target

		//if false
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

			interaction.followUp({
				embeds: [banEmbedFail],
				ephemeral: true
			})

		}
		//if true
		else {
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


			await interaction.followUp({
				embeds: [reasonPickerEmbed],
				components: [row],
				ephemeral: true
			});
		}
	},
	//pick menu interaction
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


		interaction.followUp({
			embeds: [confirmEmbed],
			ephemeral: true,
			components: [buttons]

		});

		const collector = interaction.channel.createMessageComponentCollector({
			max: 1
		});
		collector.on('end', x => {
			buttons.components[0].setDisabled(true);
			buttons.components[1].setDisabled(true);

			interaction.editReply({
				embeds: [confirmEmbed],
				ephemeral: true,
				components: [buttons]
			})
		})
	},
	//pick button interaction
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
			.setTitle('Action canceled')
			.setTimestamp()
			.setFooter({
				text: 'Arnosht is here to protect and serve',
			});


		if (interaction.customId === "confirm") {

			const error = new MessageEmbed()
				.setColor('RED')
				.setTitle(`There has been an error while searching through database`)
				.setDescription("┻━┻ ︵ \\( °□° )/ ︵ ┻━┻");

			const error2 = new MessageEmbed()
				.setColor('RED')
				.setTitle(`There has been an error while saving to database`)
				.setDescription("┻━┻ ︵ \\( °□° )/ ︵ ┻━┻");

			//database adding
			banSchema.findOne({
				guildID: this.guild.id,
				bannedMemberID: this.user.id,
				bannedmemberReason: this.reason,
				bannedMemberName: this.user.user.username
			}, (err, settings) => {
				if (err) {
					console.log(err);
					interaction.followUp({
						embeds: [error],
						ephemeral: true
					})
					return;
				}

				if (!settings) {
					settings = new banSchema({
						guildID: this.guild.id,
						guildName: this.guild.name,
						bannedMemberID: this.user.id,
						bannedMemberName: this.user.user.username,
						bannedmemberReason: this.reason,
						guildBanCount: 1
					})
				} else {

					var count = settings.guildBanCount;
					count = ++count;
					settings.guildBanCount = count;

				}

				settings.save(err => {
					if (err) {
						console.log(err);
						interaction.followUp({
							embeds: [error2],
							ephemeral: true
						});
						return;
					}
				})

			})
			//actuall banning
			this.user.ban({
				days: days,
				reason: banReasons.execute(this.reason)
			});

			await interaction.followUp({
				embeds: [banEmbedSucc],
				ephemeral: true
			})
		} else if (interaction.customId === "cancel") {
			interaction.followUp({
				embeds: [embedCancel],
				ephemeral: true
			})
		}
	}
}