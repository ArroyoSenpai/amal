const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const db = require(`quick.db`)
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "مستوى",
    description: "تغيير/عرض مستوى الصوت الحالي.",
    cooldown: 5000,
    aliases: ['vol'],
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: يجب أن تكون متصل بقناة الصوت \`${message.guild.members.me?.voice?.channel.name}\` لاستخدام هذا الأمر!` });
            if (!message.member.voice.channel)
                return message.reply({ content: ":no_entry_sign: يجب عليك الانضمام إلى قناة صوتية لاستخدام هذا الأمر!" })
            const queue = distube.getQueue(message)
            if (!queue) return message.reply({ content: `:no_entry_sign: يجب أن يكون هناك موسيقى تعمل لاستخدام هذا الأمر!` })
            const volume = parseInt(args[0]);
            if (!volume) {
                return message.reply({ content: `:loud_sound: مستوى الصوت: \`${queue.volume}\`%` });
            }
            if (isNaN(volume)) {
                return message.reply({ content: ':no_entry_sign: الرجاء إدخال رقم صحيح' });
            }
            if (volume < 0 || volume > 150 || isNaN(volume))
                return message.reply({ content: ":no_entry_sign: **يجب أن يكون مستوى الصوت رقم صحيح بين 0 و 150!**" })
            if (volume < 0) volume = 0;
            if (volume > 150) volume = 150;
            db.set(`volume_${message.guild.id}`, volume)
            message.reply(`:loud_sound: تم تغيير مستوى الصوت من \`${queue.volume}\` إلى \`${volume}\``)
            distube.setVolume(message, volume);
        } catch (err) {
            console.log(err)
        }
    },
};
