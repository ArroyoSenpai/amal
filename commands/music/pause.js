const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "لحظة",
    description: "يوقف مؤقتًا المسار الحالي الذي يتم تشغيله.",
    cooldown: 5000,
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

            const song = queue.songs[0];
            let name = song.name;

            if (queue.paused) {
                message.reply({ content: `:no_entry_sign: **${name}** تم إيقافه مؤقتًا!` });
            } else {
                distube.pause(message);
                message.reply({ content: `:notes: تم وقف تشغيل **${name}**. اكتب \`${prefix}resume\` لإعادة التشغيل!` });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
