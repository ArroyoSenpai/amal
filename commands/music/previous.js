const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "ارجع",
    description: "يشغل الأغنية السابقة في قائمة الانتظار.",
    cooldown: 5000,
    aliases: ['prev', 'back'],
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) {
                return message.reply({ content: `:no_entry_sign: يجب أن تكون في الاستماع إلى \`${message.guild.members.me?.voice?.channel.name}\` لاستخدام ذلك!` });
            }

            if (!message.member.voice.channel) {
                return message.reply({ content: ":no_entry_sign: يجب عليك الانضمام إلى قناة صوت لاستخدام هذا!" });
            }

            const queue = distube.getQueue(message);

            if (!queue) {
                return message.reply({ content: `:no_entry_sign: يجب أن يكون هناك تشغيل للموسيقى لاستخدام ذلك!` });
            }

            if (queue.previousSongs.length == 0) {
                return message.reply({ content: `:no_entry_sign: لا يوجد أغنية سابقة في هذه القائمة` });
            } else {
                await distube.previous(message);
                message.reply({ content: `:notes: تم تشغيل الأغنية السابقة` });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
