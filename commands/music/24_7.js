const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { joinVoiceChannel } = require('@discordjs/voice');
const { Utils } = require("devtools-ts");
const utilites = new Utils();
const db = require(`quick.db`);

module.exports = {
    name: "ثبت",
    description: "تغيير وضع 24/7. يجعل البوت لا يترك قناة الصوت حتى تتوقف عنه.",
    cooldown: 5000,
    aliases: ['24/7', '24-7'],
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) {
                return message.reply({ content: `:no_entry_sign: يجب أن تكون في الاستماع إلى \`${message.guild.members.me?.voice?.channel.name}\` لاستخدام ذلك!` });
            }

            let channel = message.member.voice.channel;

            if (!channel) {
                return message.reply({ content: ":no_entry_sign: يجب عليك الانضمام إلى قناة صوت لاستخدام هذا!" });
            }

            distube.voices.join(channel).then(() => {
                if (!db.get(`24_7_${message.guild.id}`)) {
                    db.set(`24_7_${message.guild.id}`, channel.id);
                    message.reply({ content: `:white_check_mark: تم تفعيل وضع 24/7 بنجاح!` });
                } else {
                    db.delete(`24_7_${message.guild.id}`);
                    message.reply({ content: `:white_check_mark: تم تعطيل وضع 24/7 بنجاح!` });
                }
            });
        } catch (err) {
            console.log(err);
        }
    },
};
