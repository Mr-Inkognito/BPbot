const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const welcomeSchema = require('../../models/welcomeSchema');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {

    permission: "ADMINISTRATOR",

    data: new SlashCommandBuilder()
        .setName('welcomechannel')
        .setDescription('Shows settings for welcome channel')
        .addSubcommand(subcommand =>
            subcommand
            .setName('info')
            .setDescription('Shows info about server\'s welcome channel'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('create')
            .setDescription('Creates a welcome channel for the bot')
            .addChannelOption(option =>
                option.setName('channel')
                .setDescription('Select a channel to sent the welcome message into')
                .setRequired(true)
            )
            .addBooleanOption(option =>
                option.setName('greet')
                .setDescription('Should the bot automatically greed new users upon joining or not')
                .setRequired(true)
            ))
        .addSubcommand(subcommand =>
            subcommand
            .setName('delete')
            .setDescription('Deletes the welcome channel from settings')),



    async execute(interaction) {
        //===================shows info about welcome channel======================================================
        if (interaction.options.getSubcommand() === 'info') {
            const error = new MessageEmbed()
                .setColor('RED')
                .setTitle(`There has been an error while getting the welcome channel`)
                .setDescription("┻━┻ ︵ \\( °□° )/ ︵ ┻━┻");

            welcomeSchema.findOne({
                guildID: interaction.guild.id
            }, (err, settings) => {
                if (err) {
                    console.log(err);


                    interaction.followUp({
                        embeds: [error],
                        empheral: true
                    });
                    return;
                }

                if (!settings) {
                    interaction.followUp({
                        embeds: [new MessageEmbed()
                            .setColor('RED')
                            .setTitle("There is no welcome channel set!")
                            .setDescription("You may configure one by using \`\`\`/welcomechannel create\`\`\`")
                        ],
                        empheral: true
                    })
                } else {
                    const wChannel = interaction.member.guild.channels.cache.get(settings.channelID);

                    interaction.followUp({
                        content: `${wChannel.name}`,
                        embeds: [new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle(`Welcome channel set to #${wChannel.name}`)
                            .setDescription(`Arnosht welcoming new users: **${settings.greet}**`)
                        ],
                        emphemeral: true
                    })
                }
            });

            // ==============================deletes welcome channel from database======================================================
        } else if (interaction.options.getSubcommand() === "delete") {

            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor("LIGHT_GREY")
                    .setTitle("Are you sure you want to delete welcome channel?")
                    .setDescription("You may create one later")
                ],
                ephemeral: true,
                components: [
                    new MessageActionRow()
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
                    )
                ]
            })
        }
        // ==============================creates a welcome channel db entry=============================================
        else if (interaction.options.getSubcommand() === "create") {
            const error = new MessageEmbed()
                .setColor('RED')
                .setTitle(`There has been an error while setting the welcome channel`)
                .setDescription("┻━┻ ︵ \\( °□° )/ ︵ ┻━┻");

            welcomeSchema.findOne({
                guildID: interaction.guild.id
            }, (err, settings) => {
                if (err) {
                    console.log(err);


                    interaction.followUp({
                        embeds: [error],
                        empheral: true
                    });
                    return;
                }

                if (!settings) {
                    settings = new welcomeSchema({
                        guildID: interaction.guild.id,
                        channelID: interaction.options.getChannel('channel').id,
                        greet: interaction.options.getBoolean('greet')
                    })
                } else {
                    settings.channelID = interaction.options.getChannel('channel').id;
                    settings.greet = interaction.options.getBoolean('greet');
                }
                settings.save(err => {

                    const success = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Welcome channel set to #${interaction.options.getChannel('channel').name}`)
                        .setDescription(`Arnosht is set to greet new people: **${settings.greet}**`)
                        .setTimestamp()
                        .setFooter({
                            text: 'Arnosht is here to protect and serve',
                        });

                    if (err) {
                        console.log(err);
                        interaction.followUp({
                            embeds: [error],
                            empheral: true
                        });
                    }

                    interaction.followUp({
                        embeds: [success],
                        empheral: true
                    });
                })
            });

        }
    },

    async button(interaction) {
        if (interaction.customId === "confirm") {
            var deleted = await welcomeSchema.deleteOne({
                guildID: interaction.guild.id
            });
            if (deleted.deletedCount === 1) {
                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("Welcome channel deleted successfully")
                    ],
                    ephemeral: true
                })
            } else {
                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`There is no welcome channel set!`)
                        .setDescription("┻━┻ ︵ \\( °□° )/ ︵ ┻━┻")
                    ],
                    ephemeral: true
                })
            }
        } else if (interaction.customId === "cancel") {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Canceling command...')
                    .setTimestamp()
                    .setFooter({
                        text: 'Arnosht is here to protect and serve',
                    })
                ],
                ephemeral: true
            })
        }
    }
}