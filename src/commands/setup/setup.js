const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const setupSchema = require('../../models/setupSchema');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const botconfig = require("../../botconfig.json");
const {
    Permissions
} = require('discord.js');

var setup = [];


module.exports = {

    permission: "ADMINISTRATOR",

    role: false,

    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Initial setup for the bot to function properly')
        .addSubcommand(subcommand =>
            subcommand
            .setName('features')
            .setDescription('Alows a setup of aditional bot features not required for basic functioning')
            .addBooleanOption(option =>
                option.setName('autoban')
                .setDescription('Whether the bot should automatically ban users with record')
                .setRequired(true))
            .addBooleanOption(option =>
                option.setName('warn')
                .setDescription('Whether the bot should automatically DM roles that user with record joined')
                .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('initial')
            .setDescription("Initial setup of required features, see /help for more")
        ),


    async execute(interaction) {

        // ================= features setup =======================================================================
        if (interaction.options.getSubcommand() === 'features') {

            var output = [];

            setup[0] = interaction.options.getBoolean("autoban");
            setup[1] = interaction.options.getBoolean("warn");

            setup.forEach(s => {
                if (s) {
                    output.push("YES ✅");
                } else {
                    output.push("NO ❌");
                }
            });

            //embeds
            const setupEmbed = new MessageEmbed()
                .setColor('AQUA')
                .setTitle('Setup settings')
                .setDescription('This is how the bot will be set if confirmed')
                .addFields({
                    name: 'Autoban users with record',
                    value: `Bot will automatically ban users with record upon joining server: **${output[0]}**`
                })
                .addFields({
                    name: `PM moderators with role ${botconfig.roleName}`,
                    value: `Moderators will get a PM if user with a record joined the server: **${output[1]}**`
                });

            //buttons
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

            //collector 
            const collector = interaction.channel.createMessageComponentCollector({
                max: 1
            });
            collector.on('end', x => {
                buttons.components[0].setDisabled(true);
                buttons.components[1].setDisabled(true);
                interaction.editReply({
                    embeds: [setupEmbed],
                    ephemeral: true,
                    components: [buttons]
                })
            });


            //interaction with user
            interaction.followUp({
                ephemeral: true,
                embeds: [setupEmbed],
                components: [buttons]
            })

            output = [];

            //================ initial setup ============================================================
        } else if (interaction.options.getSubcommand() === 'initial') {

            botSetup(interaction).then(setRoomsObj => {

                // ================= interaction reply ===============================================================
                interaction.followUp({
                    ephemeral: true,
                    embeds: [
                        new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Initial setup finished')
                        .setDescription('Initial setup for bot could finish with these states:\n' +
                            'successful: ✅\nfailed: ❌\nskipped (already exists): ❕')
                        .addFields({
                            name: '\u200B',
                            value: '\u200B'
                        }, {
                            name: `Create ${botconfig.roleName} role: ${setRoomsObj.setRole}`,
                            value: "Special role required to use moderation features"
                        }, {
                            name: `Create Arnosht moderation channel category: ${setRoomsObj.category}`,
                            value: `Secret category only visible by administrators members with ${botconfig.roleName} role`
                        }, {
                            name: `Create #REPORT-LOG room: ${setRoomsObj.reportLog}`,
                            value: `Room for user reports submitted through bot`
                        }, {
                            name: `Create #JOIN-WARNINGS room: ${setRoomsObj.joinWarn}`,
                            value: `Room where bot will warn moderators about new users with record joining`
                        }, {
                            name: `Create #MOD-TEXT room: ${setRoomsObj.modText}`,
                            value: `Room where administrators and ${botconfig.roleName} role can text in secret`
                        }, {
                            name: `Create MOD-TALK voice channel: ${setRoomsObj.modTalk}`,
                            value: `Room where administrators and ${botconfig.roleName} role can voicechat in secret`
                        })

                    ]
                })
            }).catch(
                console.error
            );

        }


    },


    //=============== buttons method ===============================================================================
    async button(interaction) {

        if (interaction.customId === "cancel") {
            interaction.followUp({
                ephemeral: true,
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Action cancelled')
                ]
            })
            return;
        } else {

            setupSchema.findOne({
                guildID: interaction.guild.id
            }, (err, records) => {

                if (err) {

                    console.log(err);
                    return;

                } else if (!records) {

                    records = new setupSchema({
                        guildID: interaction.guild.id,
                        autoBan: setup[0],
                        warnUsers: setup[1]
                    })

                } else {

                    records.autoBan = setup[0];
                    records.warnUsers = setup[1];

                }

                records.save(err => {
                    if (err) {
                        console.log(err);
                        interaction.followUp({
                            ephemeral: true,
                            embeds: [
                                new MessageEmbed()
                                .setColor('RED')
                                .setTitle(`There has been an error while saving to database`)
                                .setDescription("┻━┻ ︵ \\( °□° )/ ︵ ┻━┻")
                            ]
                        })
                        return;
                    } else {
                        interaction.followUp({
                            ephemeral: true,
                            embeds: [
                                new MessageEmbed()
                                .setColor('GREEN')
                                .setTitle('Settings saved successfully')
                                .setDescription('Bot settings were successfully saved into configuration')
                            ]
                        })
                    }
                })

            });


        }


    },








}


function botSetup(interaction) {
    //output setup variables

    var setRooms = {
        category: "❌",
        reportLog: "❌",
        joinWarn: "❌",
        modTalk: "❌",
        setRole: "❌",
        modText: "❌",
        autoBanFeature: "❌",
        warnUsersFeature: "❌"
    };

    var channelIDs = {
        reportChID: null,
        joinWarnChID: null,
        modTalkChID: null,
        modTextChID: null
    };


    //test variables
    var role = interaction.guild.roles.cache.find(role => role.name === botconfig.roleName);
    var modtalk = interaction.guild.channels.cache.find(ch => ch.name === "arnosht-mod-talk");
    var modCategory = interaction.guild.channels.cache.find(ch => ch.name === "Arnosht-moderation");
    var reportLog = interaction.guild.channels.cache.find(ch => ch.name === "arnosht-report-log");
    var joinWarn = interaction.guild.channels.cache.find(ch => ch.name === "arnosht-join-warnings");
    var modText = interaction.guild.channels.cache.find(ch => ch.name === "arnosht-mod-text");
    var everyoneRoleID = interaction.guild.roles.cache.find(role => role.name === "@everyone").id;

    // ================= features setup ======================================
    setupSchema.findOne({
        guildID: interaction.guild.id
    }, (err, records)=>{
        if(err){
            console.error
        }

        if(!records){
            records = new setupSchema({
                guildID: interaction.guild.id,
                autoBan: false,
                warnUsers: false
            })
        }

        records.save(err=>{
            if(err){
                console.error
            }
            else{
                setRooms.autoBanFeature = "✅";
                setRooms.warnUsersFeature = "✅";
            }
        })


    })


    //==================== role setup ==========================================================
    if (!role) {
        interaction.guild.roles.create({
                name: botconfig.roleName,
                color: 'DARK_GREEN',
                reason: 'Role created by bot to function properly',
                hoist: true,
                permissions: new Permissions(1094679260886n),
                position: 1,
                mentionable: true
            })
            .then(r => {
                setRooms.setRole = "✅";

            })
            .catch(console.error)
    } else {
        setRooms.setRole = "❕";
    }





    //report channel setup

    if (reportLog) {
        setRooms.reportLog = "❕";
    } else {

        interaction.guild.channels.create('arnosht-report-log', {
            type: "GUILD_TEXT",
            position: 0
        }).then(channel => {

            channelIDs.reportChID = channel.id;

            setRooms.reportLog = "✅";
        }).catch(
            console.error
        );
    }

    //text-talk channel setup
    if (modText) {
        setRooms.modText = "❕";
    } else {

        interaction.guild.channels.create('arnosht-mod-text', {
            type: "GUILD_TEXT",
            position: 0
        }).then(channel => {

            channelIDs.modTextChID = channel.id;

            setRooms.modText = "✅";
        }).catch(
            console.error
        );
    }




    //join warn channel setup
    if (joinWarn) {
        setRooms.joinWarn = "❕";
    } else {

        interaction.guild.channels.create('arnosht-join-warnings', {
            type: "GUILD_TEXT",
            position: 0
        }).then(channel => {

            channelIDs.joinWarnChID = channel.id;

            setRooms.joinWarn = "✅";

        }).catch(console.error);
    }




    //moderator voice channel setup
    if (modtalk) {
        setRooms.modTalk = "❕";
    } else {
        interaction.guild.channels.create('arnosht-mod-talk', {
            type: "GUILD_VOICE",
            position: 0
        }).then(channel => {

            channelIDs.modTalkChID = channel.id;

            setRooms.modTalk = "✅";

        }).catch(console.error);
    }

    //category setup
    if (modCategory) {
        setRooms.category = "❕";
    } else {
        interaction.guild.channels.create('Arnosht-moderation', {
            type: "GUILD_CATEGORY",
            position: 0,
            permissionOverwrites: [{
                id: everyoneRoleID,
                deny: [Permissions.FLAGS.VIEW_CHANNEL],
            }, ],
        }).then(category => {

            let joinwarnCh = interaction.guild.channels.cache.get(channelIDs.joinWarnChID);
            let modtalkCh = interaction.guild.channels.cache.get(channelIDs.modTalkChID);
            let reportCh = interaction.guild.channels.cache.get(channelIDs.reportChID);
            let modTextCh = interaction.guild.channels.cache.get(channelIDs.modTextChID);
            let role = interaction.guild.roles.cache.find(role => role.name === botconfig.roleName);

            interaction.guild.roles.fetch()
                .then(roles => {

                    category.permissionOverwrites.edit(role, {
                        VIEW_CHANNEL: true
                    });

                    roles.forEach(r => {

                        if (r.name !== botconfig.roleName) {
                            category.permissionOverwrites.edit(r, {
                                VIEW_CHANNEL: false
                            });
                        }

                    });



                }).catch(console.error);

            setRooms.category = "✅";

            joinwarnCh.setParent(category, { lockPermissions: true});
            modtalkCh.setParent(category, { lockPermissions: true});
            reportCh.setParent(category, { lockPermissions: true});
            modTextCh.setParent(category, { lockPermissions: true});


        }).catch(
            console.error
        )
    }



    return new Promise(resolve => {
        if (setRooms === null) throw new Error('object returned empty from setup');
        setTimeout(() => resolve(setRooms), 2000);
    });
}
