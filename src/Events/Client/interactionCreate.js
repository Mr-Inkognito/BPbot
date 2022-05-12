const {
    Message,
    Channel,
    MessageEmbed,
    Collection
} = require("discord.js");


const {
    Perms
} = require("../../Validation/Permissions");

const botconfig = require("../../botconfig.json");

var command = "";
const cooldowns = new Map();

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

                            if(!role){
                                interaction.followUp({
                                    ephemeral: true,
                                    embeds: [
                                        new MessageEmbed()
                                        .setColor('RED')
                                        .setTitle(`❌The role ${botconfig.roleName} is not created!❌`)
                                        .setDescription(`Please create one using \`\`\`/setup initial\`\`\``)
                                        .setTimestamp()
                                        .setFooter({
                                            text: 'Arnosht is here to protect and serve',
                                        })
                                    ]
                                })
                                return;
                            }

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
                            } else {

                                if (this.command.cooldown) {

                                    var comCooldown = getTimeSeconds(this.command.cooldown);
                                    if(comCooldown===null){
                                        console.log("ERROR: wrong cooldown command format");
                                        return;
                                    }
    
                                    if (!cooldowns.has(interaction.commandName)) {
                                        cooldowns.set(interaction.commandName, new Collection());
                                    }
    
                                    const curTime = Date.now();
                                    const timestamps = cooldowns.get(interaction.commandName);
                                    const cooldownammout = comCooldown * 1000;
                                    console.log(timestamps);
    
                                    if (timestamps.has(interaction.member.id)) {
                                        const expTime = timestamps.get(interaction.member.id) + cooldownammout;
    
                                        if (curTime < expTime) {
                                            const timeleft = (expTime - curTime) / 1000;
    
                                            interaction.followUp({ 
                                                ephemeral: true,
                                                embeds:[
                                                    new MessageEmbed()
                                                        .setColor('RED')
                                                        .setTitle(`You can use this command only once per: ${this.command.cooldown}`)
                                                        .setDescription(`Command will be available for you in ${timeleft.toFixed(0)} seconds`)
                                                ]
                                            });
                                            return;
                                        }
                                    }
    
    
                                    timestamps.set(interaction.member.id, curTime);
    
                                    console.log(timestamps);
    
                                    setTimeout(() => {
                                        timestamps.delete(interaction.member.id)
                                    }, cooldownammout);
    
                                    await this.command.execute(interaction, client);

                                } else {
                                    await this.command.execute(interaction, client);
                                }

                            }
                        } else {

                            if (this.command.cooldown) {

                                var comCooldown = getTimeSeconds(this.command.cooldown);
                                if(comCooldown===null){
                                    console.log("ERROR: wrong cooldown command format");
                                    return;
                                }

                                if (!cooldowns.has(interaction.commandName)) {
                                    cooldowns.set(interaction.commandName, new Collection());
                                }

                                const curTime = Date.now();
                                const timestamps = cooldowns.get(interaction.commandName);
                                const cooldownammout = comCooldown * 1000;

                                if (timestamps.has(interaction.member.id)) {
                                    const expTime = timestamps.get(interaction.member.id) + cooldownammout;

                                    if (curTime < expTime) {
                                        const timeleft = (expTime - curTime) / 1000;

                                        interaction.followUp({ 
                                            ephemeral: true,
                                            embeds:[
                                                new MessageEmbed()
                                                    .setColor('RED')
                                                    .setTitle(`You can use this command only once per: ${this.command.cooldown}`)
                                                    .setDescription(`Command will be available for you in ${timeleft.toFixed(0)} seconds`)
                                            ]
                                        });
                                        return;
                                    }
                                }


                                timestamps.set(interaction.member.id, curTime);


                                setTimeout(() => {
                                    timestamps.delete(interaction.member.id)
                                }, cooldownammout);

                                await this.command.execute(interaction, client);
                                
                            } else {
                                await this.command.execute(interaction, client);
                            }
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

            // ==================== action is menu ===================================
        } else if (interaction.isSelectMenu()) {
            //console.log(interaction);
            await interaction.deferReply({
                ephemeral: true
            });
            await this.command.menu(interaction);

            //=================== action is button =========================================
        } else if (interaction.isButton()) {

            if(interaction.customId==="cancel"){
                const timestamps = cooldowns.get(interaction.message.interaction.commandName);
                if(timestamps){
                    timestamps.delete(interaction.member.id)
                }
                
            }

            await interaction.deferReply({
                ephemeral: true
            });
            await this.command.button(interaction);

            // ============================ default ============================================
        } else {
            return;
        }
    },
};


function getTimeSeconds(cooldownString) {

    let cooldown;

    if(cooldownString.includes("s")){
        cooldown = cooldownString.replace("s", "");
        cooldown = parseInt(cooldown);
        return cooldown;
    }
    else if(cooldownString.includes("h")){
        cooldown = cooldownString.replace("h", "");
            cooldown = parseInt(cooldown);
            return cooldown*3600;
    }
    else{
        return null;
    }

}