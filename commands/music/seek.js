const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "تقديم",
    description: "يرتب إلى نقطة معينة في المقطوعة الصوتية الحالية.",
    cooldown: 5000,
    aliases: ['تقديم'],
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

            if (!queue.autoplay && queue.formattedCurrentTime <= song.formattedDuration) {
                return message.reply({ content: `:no_entry_sign:  الحد الأقصى للمدة المنقضية: [${queue.formattedCurrentTime} / ${song.formattedDuration}]` });
            }

            if (!args[0]) {
                return message.reply(`:rolling_eyes: - مثال \`${prefix}seek **1**\``);
            }

            message.reply({ content: `:notes: تم التقديم في المقطوعة لـ \`${args[0]} ثانية\`` });
            return distube.seek(message, Number(args[0] * 1000));
        } catch (err) {
            console.log(err);
        }
    },
};
