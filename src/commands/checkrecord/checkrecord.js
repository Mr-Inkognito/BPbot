const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageEmbed
} = require('discord.js');

const banSchema = require("../../models/banDatabaseSchema");
const banReasons = require("../../models/banReasons");


module.exports = {

    permission: 'MANAGE_MESSAGES',

    role: true,

    data: new SlashCommandBuilder()
        .setName('checkrecord')
        .setDescription('Checks, if the person provided by discordID or mention has a record')
        .addSubcommand(subcommand =>
            subcommand
            .setName('usertag')
            .setDescription('Info about a record by tagging a user')
            .addUserOption(option => option
                .setName('user')
                .setDescription('Tag the desired user')
                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
            .setName('dc_id')
            .setDescription('Info about a record by Discord ID')
            .addStringOption(option => option
                .setName('id')
                .setDescription('Put the discord ID of a desired user')
                .setRequired(true))),


    async execute(interaction, client) {

        var id = interaction.options.getString('id');
        var user = interaction.options.getMember('user');
        var databaseID;
        var uniqueServers = [];
        var banReason;
        var username;
        var altnames = [];
        var count = 0;

        if (!id && user) {

            databaseID = user.id;
            username = user.user.username;

        } else if (id && !user) {

            if (/^\d+$/.test(id) && id.length == 18) {

                databaseID = id;

            } else {
                await interaction.followUp({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setTitle('Invalid Discord ID provided')
                        .setDescription(`Discord ID provided is not in a correct format`)
                    ],
                    ephemeral: true
                });
                return;
            }

        } else {
            console.log("there was an error, no id or user are passed or they are both passed at the same time")
            return;
        }

        banSchema.find({
            bannedMemberID: databaseID
        }, (err, records) => {
            if (err) {
                console.log(err);
            } else if (records.length > 0) {

                username = records[0].bannedMemberName;

                records.sort((a,b) => b.guildBanCount - a.guildBanCount);

                records.forEach(e => {

                    count += e.guildBanCount;

                    if (!altnames.includes(e.bannedMemberName)) {
                        altnames.push(e.bannedMemberName);
                    }

                    if (!uniqueServers.includes(e.guildID)) {
                        uniqueServers.push(e.guildID);
                    }
                })


                banReason = banReasons.execute(records[0].bannedmemberReason);

                interaction.followUp({
                    embeds: [new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle('Match found!')
                        .setDescription(`${username} has a record`)
                        .addFields({
                            name: 'Servers',
                            value: `${username} has been banned on ${uniqueServers.length} servers.`
                        }, {
                            name: 'Total number of bans',
                            value: `${username} has been banned ${count} times.`
                        }, {
                            name: 'Mostly banned for reason',
                            value: `${banReason}`
                        }, {
                            name: 'Alternate known names',
                            value: `${altnames || "No alternate names"}`
                        }, )
                        .setTimestamp()
                        .setFooter({
                            text: 'Arnosht is here to protect and serve',
                        })
                    ],
                    ephemeral: true
                });
            } else {
                interaction.followUp({
                    embeds: [new MessageEmbed()
                        .setColor('GREY')
                        .setTitle("Math not found!")
                        .setDescription(`${username} does not have any records`)
                        .setTimestamp()
                        .setFooter({
                            text: 'Arnosht is here to protect and serve',
                        })
                    ]
                })
            }
        })

    }
}