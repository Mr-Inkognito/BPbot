const { Message, Channel } = require("discord.js");

var command = "";

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client){
        if(!interaction.isCommand()){
            return;
        }

        

        if(interaction.isCommand()){
            await  interaction.deferReply({ ephemeral: true }).catch(()=>{});

            command = client.commands.get(interaction.commandName);

            if(!command) return interaction.followUp({content: "This command does not exist.", ephemeral: true});

            try{

                if(command.permission){
                    const perms = interaction.Channel.permissionFor(interaction.member);
                    if(!perms || !perms.has(command.permission)){
                        const permErrorEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`❌You do not have permission to use this command: ${command.permission}❌`)
                        .setDescription('(╯°□°）╯︵ ┻━┻')
                        .setTimestamp()
                        .setFooter({
                            text: 'Arnosht is here to protect and serve',
                        });

                        return interaction.editReply({embeds:[permErrorEmbed], ephemeral:true});
                    }
                }

                await command.execute(interaction);
            }
            catch(error){
                console.error(error);
                await interaction.reply({
                    content: 'There was an error executing this command',
                    ephemeral: true
                });
            }
        }
        else if(interaction.isSelectMenu()){
            //console.log(interaction);
            await command.menu(interaction);
        }
        else if(interaction.isButton()){
            //console.log(interaction);
            await command.button(interaction);
        }
    },
};