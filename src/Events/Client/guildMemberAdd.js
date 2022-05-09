const {
    MessageEmbed
} = require('discord.js');
const welcomeSchema = require('../../models/welcomeSchema');



module.exports = {
    name: 'guildMemberAdd',
    once: false,

    async execute(member, client) {

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
                        value: `By staying in server protected by ${client.user.username} `+
                        `you agree, that in case of getting banned, your username and Discord ID (publicly available) `+
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

    },
};