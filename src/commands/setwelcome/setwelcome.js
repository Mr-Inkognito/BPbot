const { SlashCommandBuilder } = require('@discordjs/builders');
const welcomeSchema = require('../../models/welcomeSchema');
const { MessageEmbed } = require('discord.js');

module.exports = {

    permission: "ADMINISTRATOR",

    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Sets the welcome channel')
        .addChannelOption(option => 
			option.setName('channel')
			.setDescription('Select a channel to sent the welcome message into')
			.setRequired(true)
        )
        .addStringOption(option => 
            option.setName('text')
            .setDescription('Welcome message to be displayed')
            .setRequired(true)
        ),
        
    async execute(interaction){
        const error = new MessageEmbed()
				.setColor('RED')
				.setTitle(`There has been an error while setting the welcome channel`)
				.setDescription("┻━┻ ︵ \\( °□° )/ ︵ ┻━┻");
        
        welcomeSchema.findOne({ guildID: interaction.guild.id }, (err, settings)=>{
            if(err){
                console.log(err);
                

                interaction.reply({embeds: [error], empheral:true});
                return;
            }

            if(!settings){
                settings = new welcomeSchema({
                    guildID: interaction.guild.id,
                    channelID: interaction.options.getChannel('channel').id,
                    text: interaction.options.getString('text')
                })
            }
            else{
                settings.welcome_channel_id = interaction.options.getChannel('channel').id;
            }
            settings.save(err=>{
                const success = new MessageEmbed()
				.setColor('GREEN')
				.setTitle(`Welcome channel set to ${interaction.options.getChannel('channel')}`)
                .setTimestamp()
			    .setFooter({
				    text: 'Arnosht is here to protect and serve',
			    });

                if(err){
                    console.log(err);
                    nteraction.reply({embeds: [error], empheral:true});
                }

                interaction.reply({content:`set channel to ${interaction.options.getChannel('channel')}`,embeds: [success], empheral: true});
            })
        });

    }
}
