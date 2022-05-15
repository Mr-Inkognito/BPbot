const mongoose = require('mongoose');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client){
        console.log("Version 1.0.0");
        client.user.setActivity("/help",{ type: "LISTENING" });


        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAlive: true
        }).then(()=>{
            console.log("Bot is connected to the database");
        }).catch((err)=>{
            console.log(err);
        });


        console.log("Bot is online and ready!");
    },
};