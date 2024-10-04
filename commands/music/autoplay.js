const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "الكل",
    description: "تبديل وضع التشغيل التلقائي للخادم الحالي.",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            const queue = distube.getQueue(message);

            if (!queue) {
                return message.reply({ content: `:no_entry_sign: يجب أن يكون هناك موسيقى تعمل لاستخدام ذلك!` });
            }

            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) {
                return message.reply({ content: `:no_entry_sign: يجب أن تكون في الاستماع إلى \`${message.guild.members.me?.voice?.channel.name}\` لاستخدام ذلك!` });
            }

            if (!message.member.voice.channel) {
                return message.reply({ content: ":no_entry_sign: يجب عليك الانضمام إلى قناة صوت لاستخدام هذا!" });
            }

            const mode = distube.toggleAutoplay(message);

            message.reply({ content: `:white_check_mark: تم تعيين وضع التشغيل التلقائي إلى **\`${queue.autoplay ? "تشغيل" : "إيقاف"}\`**` });
        } catch (err) {
            console.log(err);
        }
    },
};
