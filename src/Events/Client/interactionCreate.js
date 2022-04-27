const { Message, Channel, MessageEmbed } = require("discord.js");
const { Perms } = require("../../Validation/Permissions");

var command = "";

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client){

        if(interaction.isCommand()){
            
            await  interaction.deferReply({ ephemeral: true });

            this.command = client.commands.get(interaction.commandName);
            
            if(!this.command) return interaction.followUp({content: "This command does not exist.", ephemeral: true});

            

            try{

                if(this.command.permission){

                    if(!Perms.includes(this.command.permission)){
                        console.log("error, invalid permission string");
                    }
                    else if(!interaction.member.permissions.has(this.command.permission)){
                        const permErrorEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`❌You do not have permission to use this command❌`)
                        .setDescription(`(╯°□°）╯︵ ┻━┻`)
                        .setTimestamp()
                        .setFooter({
                            text: 'Arnosht is here to protect and serve',
                        });

                        return interaction.followUp({embeds:[permErrorEmbed], ephemeral:true});
                    }
                    else{
                        await this.command.execute(interaction, client);
                    }
                }
                else{
                    await this.command.execute(interaction, client);
                }

                
            }
            catch(error){
                console.error(error);
                await interaction.followUp({
                    content: 'There was an error executing this command',
                    ephemeral: true
                });
            }
        }
        else if(interaction.isSelectMenu()){
            //console.log(interaction);
            await  interaction.deferReply({ ephemeral: true });
            await this.command.menu(interaction);
        }
        else if(interaction.isButton()){
            //console.log(interaction);
            await  interaction.deferReply({ ephemeral: true });
            await this.command.button(interaction);
        }
        else{
            return;
        }
    },
};