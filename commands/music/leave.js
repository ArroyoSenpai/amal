const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const { joinVoiceChannel } = require('@discordjs/voice');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "اطلع",
    description: "مغادرة القناة الصوتية.",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId !== message.member.voice.channelId) {
                return message.reply({ content: `:no_entry_sign: لست هناك بالفعل \`${message.member.voice.channel.name}\`` });
            }

            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) {
                return message.reply({ content: `:no_entry_sign: يجب أن تكون في الاستماع إلى \`${message.guild.members.me?.voice?.channel.name}\` لاستخدام ذلك!` });
            }

            let channel = message.member.voice.channel;

            if (!channel) {
                return message.reply({ content: ":no_entry_sign: يجب عليك الانضمام إلى قناة صوت لاستخدام هذا!" });
            }

            distube.voices.leave(message.guild);

            return message.reply({ content: `:white_check_mark: تم مغادرة \`${channel.name}\` بنجاح` });
        } catch (err) {
            console.log(err);
        }
    },
};
