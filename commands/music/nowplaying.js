const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "عرض",
    description: "يظهر الأغنية التي يقوم البوت حاليًا بتشغيلها.",
    cooldown: 5000,
    aliases: ['الان', 'np', 'status'],
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
            const uni = `${song.playing ? ':notes: | ' : ':notes: | '}`;
            const part = Math.floor((queue.currentTime / song.duration) * 30);

            let embed = new EmbedBuilder()
                .setTitle(`${song.name}`)
                .setURL(`${song.url}`)
                .setDescription(`\nالمدة الحالية: \`[${queue.formattedCurrentTime}/${song.formattedDuration}]\`\n${uni}${'▇'.repeat(part) + '▇' + '—'.repeat(24 - part)}`)
                .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
                .setFooter({ text: `@ ${song.uploader.name} | المشاهدات: ${song.views} | الإعجاب: ${song.likes}` });

            message.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    },
};
