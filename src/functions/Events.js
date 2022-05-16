const { Events } = require('../Validation/EventNames');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const ascii = require('ascii-table');

module.exports = async (client) => {
    const table = new ascii("Events loaded");

    (await PG(`${process.cwd().replace(/\\/g, "/")}/src/Events/*/*.js`)).map(async (file)=>{
        const event = require(file);

        if(!Events.includes(event.name) || !event.name){
            const location = file.split("/");
            await table.addRow(
                `${event.name || "MISSING NAME"}`,
                 `❌Invalid or missing event name: ${location[7] + "/" + location[8]}❌`
            );
            return;
        }

        if(event.once){
            client.once(event.name, (...args) => event.execute(...args, client));
        }
        else{
            client.on(event.name, (...args) => event.execute(...args, client));
        };

        await table.addRow(event.name, "EVENT LOADED ✓")
    });

    console.log(table.toString());
}