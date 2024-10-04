const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const wait = require('node:timers/promises').setTimeout;
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "شغل",
    description: "إضافة أغنية إلى قائمة الانتظار وتشغيلها.",
    cooldown: 5000,
    aliases: ['p', 'ش', 'شغل'],
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) {
                return message.reply({ content: `:no_entry_sign: يجب أن تكون في الاستماع إلى \`${message.guild.members.me?.voice?.channel.name}\` لاستخدام ذلك!` });
            }

            if (!message.member.voice.channel) {
                return message.reply({ content: ":no_entry_sign: يجب عليك الانضمام إلى قناة صوت لاستخدام هذا!" });
            }

            let player = args.slice(0).join(' ');

            if (!player) {
                return message.reply({ content: `:no_entry_sign: يجب عليك كتابة اسم الأغنية أو الرابط.` });
            }

            const queue = distube.getQueue(message);

            message.reply({ content: `:watch: جاري البحث ... (\`${player}\`)` }).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 3000);
            }).catch(() => {});

            const voiceChannel = message.member?.voice?.channel;

            if (voiceChannel) {
                await distube.play(voiceChannel, player, {
                    message,
                    textChannel: message.channel,
                    member: message.member,
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
