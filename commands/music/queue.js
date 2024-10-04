const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "قائمة",
    description: "يعرض قائمة الانتظار للأغاني الحالية في قائمة التشغيل.",
    cooldown: 5000,
    aliases: ['انتظار'],
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

            const reload = new ButtonBuilder()
                .setCustomId('reload')
                .setStyle(ButtonStyle.Primary)
                .setLabel('🔄');

            const next = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Primary);

            if (queue.songs.length === 1) {
                next.setDisabled(true);
            }

            const back = new ButtonBuilder()
                .setCustomId('back')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);

            const row = new ActionRowBuilder()
                .addComponents(back, reload, next);

            const exampleEmbed = new EmbedBuilder()
                .setTitle(queue.songs[0].name)
                .setURL(queue.songs[0].url)
                .addFields(
                    { name: 'الوقت', value: queue.songs[0].formattedDuration, inline: true },
                    { name: 'المشاهدات', value: queue.songs[0].views + ' مشاهدة', inline: true },
                    { name: 'الإعجابات', value: queue.songs[0].likes + ' إعجاب', inline: true },
                )
                .setImage(queue.songs[0].thumbnail)
                .setTimestamp()
                .setFooter({ text: `1 / ${queue.songs.length}` });

            return message.reply({
                embeds: [exampleEmbed],
                components: [row]
            });
        } catch (err) {
            console.log(err);
        }
    },
};
