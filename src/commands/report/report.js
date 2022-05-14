const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const botconfig = require("../../botconfig.json");

const {
    MessageActionRow,
    MessageButton,
    MessageEmbed
} = require("discord.js");


var target, reason, description, author, modRole, repChannel;

module.exports = {

    permission: "SEND_MESSAGES",

    role: false,

    cooldown: "24h",

    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user directly to server moderation team')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Select the user that should be reported')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason for reporting the user')
            .setRequired(true)
            .addChoice('Harassess me or another user',' Harassess me or another user')
            .addChoice('Posting inappropriate images or files', 'Posting inappropriate images')
            .addChoice('Atacking a minority (racism, sexism...)', 'Atacking a minority (racism, sexism...)')
            .addChoice('Automatic "selfbot" account', 'Automatic "selfbot" account')
        )
        .addStringOption(option =>
            option.setName('description')
            .setDescription('Detailed description of the report')
            .setRequired(true)
        ),


    async execute(interaction) {

        target = interaction.options.getMember('user');
        author = interaction.member;
        reason = interaction.options.getString('reason');
        description = interaction.options.getString('description');
        modRole = interaction.guild.roles.cache.find(role => role.name === botconfig.roleName);
        repChannel = interaction.guild.channels.cache.find(ch => ch.name === "arnosht-report-log");

        if (!modRole) {
            interaction.followUp({
                ephemeral: true,
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setTitle('REPORT ERROR')
                    .setDescription(`This function has not been configured yet`)
                ]
            })
            return;
        } else if (!repChannel) {
            interaction.followUp({
                ephemeral: true,
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setTitle('REPORT ERROR')
                    .setDescription(`This function has not been configured yet`)
                ]
            })
            return;
        }

        const embed = new MessageEmbed()
            .setColor('AQUA')
            .setTitle('REPORT FILE')
            .setDescription(`Are you sure you want to send a report to ${modRole} team?`)
            .addFields({
                name: "User to be reported",
                value: `${target}` || "ERROR: no target set"
            }, {
                name: "Reason for reporting",
                value: `${reason}` || "ERROR: no reason set"
            }, {
                name: "Report description",
                value: `${description}` || "Error: no description set"
            })


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

        interaction.followUp({
            ephemeral: true,
            embeds: [embed],
            components: [buttons]
        });

        const collector = interaction.channel.createMessageComponentCollector({
            max: 1
        });
        collector.on('end', x => {
            buttons.components[0].setDisabled(true);
            buttons.components[1].setDisabled(true);
            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
                components: [buttons]
            })
        })

    },


    async button(interaction) {

      if(interaction.customId === "confirm"){
        repChannel.send({
            content: `${modRole}`,
            ephemeral: true,
            embeds: [
                new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('REPORT FILE')
                .setDescription('New report message')
                .addFields({
                    name: "Author of the report",
                    value: `${author}` || "ERROR: misisng author"
                }, {
                    name: "Reported user",
                    value: `${target}` || "ERROR: misisng target"
                }, {
                    name: "Reason for the report",
                    value: `${reason}` || "ERROR: misisng reason"
                }, {
                    name: "Detailed description of the report",
                    value: `${description}` || "ERROR: misisng description"
                }, )
            ]
        }).then(
            interaction.followUp({
                ephemeral: true,
                embeds:[
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Report successful ✅')
                        .setDescription(`The report has been sent successfully to the ${modRole} team`)
                ]
            })
        ).catch(
            console.error,
            /*interaction.followUp({
                ephemeral: true,
                embeds:[
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle('Report failed❌')
                        .setDescription(`Sending report failed. Please try again or contact administrator`)
                ]
            })*/
        );
      }
      else if(interaction.customId === "cancel"){
        interaction.followUp({
            ephemeral: true,
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setTitle('Action cancelled')
            ]
        })
        return;
      }


        
    }
}