const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "التالي",
    description: "الانتقال إلى أغنية في قائمة الانتظار.",
    cooldown: 5000,
    aliases: ['skipto'],
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
                return message.reply({ content: `:no_entry_sign: يجب أن يكون هناك موسيقى تعمل لاستخدام ذلك!` });
            }

            if (!queue.autoplay && queue.songs.length <= 1) {
                return message.reply({ content: `:no_entry_sign: هذه هي آخر أغنية في قائمة الانتظار` });
            }

            if (0 <= Number(args[0]) && Number(args[0]) <= queue.songs.length) {
                message.reply({ content: `:notes: تم الانتقال إلى الأغاني!` });

                return distube.jump(message, parseInt(args[0]))
                    .catch(err => message.reply({ content: `:no_entry_sign: رقم الأغنية غير صالح.` }));
            } else {
                message.reply({ content: `:no_entry_sign: يرجى استخدام رقم بين **0** و **${queue.songs.length}**` });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
