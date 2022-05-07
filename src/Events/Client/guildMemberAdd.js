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
            } else if (records && records.greet === true) {

                const welcomeEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`${member.user.username}, welcome to ${member.guild.name}`)
                    .setDescription("(👉ﾟヮﾟ)👉")
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