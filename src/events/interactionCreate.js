const { Message, Channel } = require("discord.js");

var command = "";

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client){
        /*if(!interaction.isCommand()){
            return;
        }*/

        

        if(interaction.isCommand()){
            command = client.commands.get(interaction.commandName);

            if(!command) return;

            try{
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