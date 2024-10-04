const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const db = require(`quick.db`);
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "تكرار",
    description: "تبديل وضع التكرار.",
    cooldown: 5000,
    aliases: ['loop', 'تكرار'],
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

            if (0 <= Number(args[0]) && Number(args[0]) <= 2) {
                distube.setRepeatMode(message, parseInt(args[0]));

                message.reply({
                    content: `:notes: **تم تعيين وضع التكرار إلى:** ${args[0].replace("0", "\`معطل\`").replace("1", "\`تكرار الأغنية\`").replace("2", "\`تكرار الطابور\`")}`
                });
            } else {
                message.reply({
                    content: `:no_entry_sign: يرجى استخدام رقم بين **0** و **2** | 0: **معطل**, 1: **تكرار الأغنية**, 2: **تكرار كل القائمة**`
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
