const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "اقلب",
    description: "يقلب القائمة.",
    cooldown: 5000,
    async execute(client, message) {
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

            if (!queue.autoplay && queue.songs.length <= 1) {
                return message.reply({ content: `:no_entry_sign:  هذه هي آخر أغنية في قائمة الانتظار` });
            }

            message.reply({ content: `:white_check_mark: تم قلب القائمة: \`Shuffle ${queue.songs.length - 1}\`` });
            return distube.shuffle(message);
        } catch (err) {
            console.log(err);
        }
    },
};
