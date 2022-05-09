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
            .setName('set')
            .setDescription('Sets a channel to be a welcome channel for the bot')
            .addChannelOption(option =>
                option.setName('channel')
                .setDescription('Select a channel to send the welcome message into')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('unset')
            .setDescription('Unsets the welcome channel from settings')
        ),



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
                            .setDescription("You may configure one by using \`\`\`/welcomechannel set\`\`\`")
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
                            .setDescription(`Arnosht is welcoming new users`)
                        ],
                        emphemeral: true
                    })
                }
            });

            // ==============================deletes welcome channel from database======================================================
        } else if (interaction.options.getSubcommand() === "unset") {
            welcomeSchema.findOne({
                guildID: interaction.guild.id
            }, (err, records) => {
                if (err) {
                    console.log(err);
                }

                if (records) {
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
                        )

                    const confEmbed = new MessageEmbed()
                        .setColor("LIGHT_GREY")
                        .setTitle("Are you sure you want to unset welcome channel?")
                        .setDescription("You may create one later")

                    interaction.followUp({
                        embeds: [confEmbed],
                        ephemeral: true,
                        components: [buttons]
                    })

                    const collector = interaction.channel.createMessageComponentCollector({
                        max: 1
                    });
                    collector.on('end', x => {
                        buttons.components[0].setDisabled(true);
                        buttons.components[1].setDisabled(true);

                        interaction.editReply({
                            embeds: [confEmbed],
                            ephemeral: true,
                            components: [buttons]
                        })
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
            });


        }
        // ==============================creates a welcome channel db entry=============================================
        else if (interaction.options.getSubcommand() === "set") {
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
                        channelID: interaction.options.getChannel('channel').id
                    })
                } else {
                    settings.channelID = interaction.options.getChannel('channel').id;
                }
                settings.save(err => {

                    const success = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Welcome channel set to #${interaction.options.getChannel('channel').name}`)
                        .setDescription(`Arnosht is welcoming new users`)

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


    //============= buttons =======================================================================
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
                        .setTitle("Welcome channel unset successfully")
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
                    .setTitle('Action cancelled')
                ],
                ephemeral: true
            })
        }
    }
}