const { EmbedBuilder } = require("discord.js");
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "بنق",
    description: `اختبار وقت استجابة البوت.`, // وصف الأمر
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            message.reply({ content: `:ping_pong: بونج ${client.ws.ping} مللي ثانية` });
        } catch (err) {
            console.log(err);
        }
    },
};
