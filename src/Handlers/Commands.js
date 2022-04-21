const { Permissions } = require('../Validation/Permissions');
const { Client } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const ascii = require('ascii-table');
const { table } = require('console');


module.exports = async (client) => {
    const Table = new ascii("Commands loaded");

    commandsArray = [];

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/Commands/*/*.js`)).map(async (file) =>{
        const command = require(file);

        if(!command.name){
            return Table.addRow(file.split("/")[7], "❌ Missing command name ❌");
        }
        if(!command.description){
            return Table.addRow(command.name, "❌ Missing command description ❌");
        }
        if(command.permission){
            if(Permissions.includes(command.permission)){
                command.defaultPermission = false;
            }
            else{
                return Table.addRow(command.name, "❌ Invalid permission ❌");
            }
        }


        client.commands.set(command.name, command);
        commandsArray.push(command);

        await table.addRow(command.name, "COMMAND LOADED ✓");
    })

    console.log(Table.toString());

    //perm validation

    client.on('ready', async () =>{

        //test - 964166172423635015
        //peeps - 635561755405451272
        const Guild = await client.guilds.cache.get('964166172423635015');

        Guild.commands.set(commandsArray).then(async (command) => {
            const Roles = (commandName) => {
                const cmdPerms = commandsArray.find((c)=> c.name === commandName).permission;
                if(!cmdPerms){
                    return null;
                }
                return Guild.roles.cache.filter((r)=> r.permission.has(cmdPerms));
            }

            const fullPermissions = command.reduce((accumulator, r) => {
                const roles = Roles(r.name);
                if(!roles){
                    return accumulator;
                }
                const permissions = roles.reduce((a,r)=>{
                    return [...a, {id: r.id, type: "ROLE", permission: true}]
                }, [])

                return [...accumulator, {id: r.id, permission: true}]
            }, [])

            await Guild.command.permission.set({ fullPermissions });
        })
    })
}