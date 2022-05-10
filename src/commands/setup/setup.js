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
const { Permissions } = require('discord.js');

var setup = [];


module.exports = {

    permission: "ADMINISTRATOR",

    role: false,

    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Initial setup for the bot to function properly')
        .addBooleanOption(option =>
            option.setName('role')
            .setDescription('Whether the bot should create a role required by the bot (recommended)')
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName('autoban')
            .setDescription('Whether the bot should automatically ban users with record')
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName('warn')
            .setDescription('Whether the bot should automatically warn roles that user with record joined')
            .setRequired(true)),


    async execute(interaction) {

        var output = [];

        setup[0] = interaction.options.getBoolean("role");
        setup[1] = interaction.options.getBoolean("autoban");
        setup[2] = interaction.options.getBoolean("warn");

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
                name: `Create role ${botconfig.roleName}`,
                value: `Automatic setup of the moderator role required for moderation commands and warnings: **${output[0]}**`
            })
            .addFields({
                name: 'Autoban users with record',
                value: `Bot will automatically ban users with record upon joining server: **${output[1]}**`
            })
            .addFields({
                name: `PM moderators with role ${botconfig.roleName}`,
                value: `Moderators will get a PM if user with a record joined the server: **${output[2]}**`
            })
            .setFooter({
                text: "Note: if you do not enable either warning or banning,"+
                " the bot will not check user records upon joining"
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
            empheral: true,
            embeds: [setupEmbed],
            components: [buttons]
        })

        output = [];

    },

    async button(interaction) {

        if (interaction.customId === "cancel") {
            interaction.followUp({
                empheral: true,
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
                        autoBan: setup[1],
                        warnUsers: setup[2]
                    })

                } else {

                    records.autoBan = setup[1];
                    records.warnUsers = setup[2];

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
                    }
                })

            });

            if(setup[0] === true){
                var role = interaction.guild.roles.cache.find(role => role.name === botconfig.roleName)

                if(role){
                    interaction.followUp({
                        ephemeral: true,
                        embeds:[
                            new MessageEmbed()
                                .setColor('GREEN')
                                .setTitle('Settings saved successfully')
                                .setDescription('Bot settings were successfully saved into configuration')
                                .addFields({
                                    name: `${botconfig.roleName} role was **NOT** created ❌`,
                                    value: "Reason: role already exists!"
                                })
                        ]
                    })
                }
                else{
                    interaction.guild.roles.create({
                        name: botconfig.roleName,
                        color: 'YELLOW',
                        reason: 'Role created by bot to function properly',
                        hoist: true,
                        permissions: new Permissions(1094679260886n),
                        position: 1,
                        mentionable: true
                      })
                    .then(interaction.followUp({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor('GREEN')
                                .setTitle('Settings saved successfully')
                                .setDescription('Bot settings were successfully saved into configuration')
                                .addFields({
                                    name: `${botconfig.roleName} role was created successfully ✅`,
                                    value: "Manual review of the permissions is recommended"
                                })
                                
                        ]
                    }))
                    .catch(err=>{
                        console.log(err);
                        interaction.followUp({
                            ephemeral: true,
                            embeds: [
                                new MessageEmbed()
                                    .setColor('GREEN')
                                    .setTitle('Settings saved successfully')
                                    .setDescription('Bot settings were successfully saved into configuration')
                                    .addFields({
                                        name: `${botconfig.roleName} role was **NOT** created ❌`,
                                        value: "Reason: there has been an error while creating the role, please contact the owner."
                                    })
                                   
                            ]
                        })
                    })
                }
            }
            else{
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




        }


    }

}