const mongoose = require('mongoose');

const databaseURL = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASS}@bpbot.0rsbj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client){
        console.log("Version 1.0.0");
        client.user.setActivity("/help",{ type: "LISTENING" });


        /*mongoose.connect(databaseURL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(()=>{
            console.log("Bot is connected to the database");
        }).catch((err)=>{
            console.log(err);
        });*/


        console.log("Bot is online and ready!");
    },
};