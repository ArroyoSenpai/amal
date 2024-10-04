const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "وقف",
    description: "توقف عن تشغيل الأغنية الحالية ومسح قائمة التشغيل بأكملها.",
    cooldown: 5000,
    aliases: ['st', 'ايقاف', 'وقف'],
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

            message.reply({ content: `:notes: تم إيقاف المشغل وتم مسح قائمة الانتظار بأكملها.` });
            return distube.stop(message);
        } catch (err) {
            console.log(err);
        }
    },
};
