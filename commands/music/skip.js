const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "سكب",
    description: "تخطي الأغنية الحالية.",
    cooldown: 5000,
    aliases: ['s', 'التالي', 'تخطي'],
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
                return message.reply({ content: `:no_entry_sign: يجب أن يكون هناك موسيقى تعمل لاستخدام هذا!` });
            }

            const song = queue.songs[0];
            let name = song.name;

            if (!queue.autoplay && queue.songs.length <= 1) {
                return message.reply({ content: `:no_entry_sign: هذه هي آخر أغنية في قائمة الانتظار` });
            }

            message.reply({ content: `:notes: تم تخطي **${name}**` });
            return distube.skip(message);
        } catch (err) {
            console.log(err);
        }
    },
};
