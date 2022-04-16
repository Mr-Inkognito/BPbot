module.exports = {
    name: 'ready',
    once: true,
    async execute(client){
        console.log("Bot is starting...");
        console.log("Version 1.0.0");
        console.log("Bot is online!");

        client.user.setActivity("/help",{ type: "LISTENING" });
    },
};