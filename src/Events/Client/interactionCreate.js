const {
    Message,
    Channel,
    MessageEmbed
} = require("discord.js");
const {
    Perms
} = require("../../Validation/Permissions");
const botconfig = require("../../botconfig.json");

var command = "";

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {

        if (interaction.isCommand()) {


            await interaction.deferReply({
                ephemeral: true
            });

            this.command = client.commands.get(interaction.commandName);

            if (!this.command) return interaction.followUp({
                content: "This command does not exist.",
                ephemeral: true
            });



            try {

                if (this.command.permission) {

                    if (!Perms.includes(this.command.permission)) {
                        console.log("error, invalid permission string");
                    } else if (!interaction.member.permissions.has(this.command.permission)) {
                        const permErrorEmbed = new MessageEmbed()
                            .setColor('RED')
                            .setTitle(`❌You do not have permission to use this command❌`)
                            .setDescription(`(╯°□°）╯︵ ┻━┻`)
                            .setTimestamp()
                            .setFooter({
                                text: 'Arnosht is here to protect and serve',
                            });

                        return interaction.followUp({
                            embeds: [permErrorEmbed],
                            ephemeral: true
                        });
                    } else {

                        if (this.command.role) {
                            let role = interaction.member.guild.roles.cache.find(r => r.name === botconfig.roleName);
                            if (!interaction.member.roles.cache.has(role.id)) {
                                interaction.followUp({
                                    ephemeral: true,
                                    embeds: [
                                        new MessageEmbed()
                                        .setColor('RED')
                                        .setTitle(`❌You do not have role ${botconfig.roleName} to use this command❌`)
                                        .setDescription(`(╯°□°）╯︵ ┻━┻`)
                                        .setTimestamp()
                                        .setFooter({
                                            text: 'Arnosht is here to protect and serve',
                                        })
                                    ]
                                })
                            }
                            else{
                                await this.command.execute(interaction, client);
                            }
                        }
                        else{
                            await this.command.execute(interaction, client);
                        }
                        
                    }
                } else {
                    await this.command.execute(interaction, client);
                }


            } catch (error) {
                console.error(error);
                await interaction.followUp({
                    content: 'There was an error executing this command',
                    ephemeral: true
                });
            }
        } else if (interaction.isSelectMenu()) {
            //console.log(interaction);
            await interaction.deferReply({
                ephemeral: true
            });
            await this.command.menu(interaction);
        } else if (interaction.isButton()) {
            //console.log(interaction);
            await interaction.deferReply({
                ephemeral: true
            });
            await this.command.button(interaction);
        } else {
            return;
        }
    },
};