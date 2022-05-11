const {
    MessageEmbed
} = require('discord.js');
const welcomeSchema = require('../../models/welcomeSchema');
const setupSchema = require("../../models/setupSchema");
const banSchema = require("../../models/banDatabaseSchema");
const botconfig = require("../../botconfig.json");
const banReasons = require("../../models/banReasons");


module.exports = {
    name: 'guildMemberAdd',
    once: false,

    async execute(member, client) {

        //getting settings
        setupSchema.findOne({
            guildID: member.guild.id
        }, (err, records) => {
            if (err) {
                console.log(err);
            } else if (records) {

                if (records.warnUsers === true || records.autoBan === true) {

                    banSchema.find({
                        bannedMemberID: member.user.id
                    }, (banErr, banrecords) => {

                        

                        if (banErr) {
                            console.log(banErr);
                        } else if (banrecords.length > 0) {
                            
                        
                            var altnames = [];

                            banrecords.forEach(rec=>{
                                if(!altnames.includes(rec.bannedMemberName)){
                                    altnames.push(rec.bannedMemberName);
                                }
                            })


                            if (records.warnUsers === true) {
                                let role = member.guild.roles.cache.find(role => role.name === botconfig.roleName);
                                member.guild.roles.cache.get(role.id).members.forEach(m => m.send({
                                    embeds: [
                                        new MessageEmbed()
                                        .setColor('RED')
                                        .setTitle('WARNING - user with record joined')
                                        .setDescription(`User that just joined has a database record`)
                                        .addFields({
                                            name: "Username",
                                            value: `${member.user.username}`
                                        })
                                        .addFields({
                                            name: "Server",
                                            value: `${member.guild.name}`
                                        })
                                        .addFields({
                                            name: "Known alternate names",
                                            value: `${altnames || "No alternate names"}`
                                        })
                                        .setFooter({
                                            text: `You got this message because you have a role ${botconfig.roleName}`
                                        })
                                    ]
                                }))
                            }
                            if (records.autoBan === true) {
                                member.ban({
                                    days: 0,
                                    reason: "This user was automatically banned by bot because they had record"
                                })
                            }

                        } else {
                            //welcoming
                            welcomeSchema.findOne({
                                guildID: member.guild.id
                            }, (err, records) => {

                                if (err) {
                                    console.log(err);
                                } else if (records) {

                                    const welcomeEmbed = new MessageEmbed()
                                        .setColor('GREEN')
                                        .setTitle(`${member.user.username}, welcome to ${member.guild.name}`)
                                        .setDescription("(👉ﾟヮﾟ)👉")
                                        .addFields({
                                            name: `${client.user.username} TOS`,
                                            value: `By staying in server protected by ${client.user.username} ` +
                                                `you agree, that in case of getting banned, your username and Discord ID (publicly available) ` +
                                                `will be stored in the ${client.user.username} database to provide better moderation on other servers.`
                                        }, )
                                        .setTimestamp()
                                        .setFooter({
                                            text: 'Arnosht is here to protect and serve',
                                        })

                                    member.guild.channels.cache.get(records.channelID).send({
                                        content: `${member}`,
                                        embeds: [welcomeEmbed],
                                    }).then(message => message.react("❤️"));

                                }

                            });
                        }

                    })

                }
                else{
                    //welcoming
                    welcomeSchema.findOne({
                        guildID: member.guild.id
                    }, (err, records) => {

                        if (err) {
                            console.log(err);
                        } else if (records) {

                            const welcomeEmbed = new MessageEmbed()
                                .setColor('GREEN')
                                .setTitle(`${member.user.username}, welcome to ${member.guild.name}`)
                                .setDescription("(👉ﾟヮﾟ)👉")
                                .addFields({
                                    name: `${client.user.username} TOS`,
                                    value: `By staying in server protected by ${client.user.username} ` +
                                        `you agree, that in case of getting banned, your username and Discord ID (publicly available) ` +
                                        `will be stored in the ${client.user.username} database to provide better moderation on other servers.`
                                }, )
                                .setTimestamp()
                                .setFooter({
                                    text: 'Arnosht is here to protect and serve',
                                })

                            member.guild.channels.cache.get(records.channelID).send({
                                content: `${member}`,
                                embeds: [welcomeEmbed],
                            }).then(message => message.react("❤️"));

                        }

                    });
                }

            }
        })

    },
};