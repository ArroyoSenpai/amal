const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { joinVoiceChannel } = require('@discordjs/voice');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "تعال",
    description: "الانضمام إلى قناة الصوت.",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId) {
                return message.reply({ content: `:no_entry_sign: أنا هنا بالفعل في \`${message.guild.members.me?.voice?.channel.name}\`` });
            }

            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) {
                return message.reply({ content: `:no_entry_sign: يجب أن تكون في الاستماع إلى \`${message.guild.members.me?.voice?.channel.name}\` لاستخدام ذلك!` });
            }

            let channel = message.member.voice.channel;

            if (!channel) {
                return message.reply({ content: ":no_entry_sign: يجب عليك الانضمام إلى قناة صوت لاستخدام هذا!" });
            }

            distube.voices.join(channel).then(() => {
                message.reply({ content: `:white_check_mark: انضم بنجاح إلى \`${channel.name}\`` });
            }).catch(() => {
                message.reply({ content: `:no_entry_sign: لا يمكن الانضمام إلى هذه القناة.` });
            });
        } catch (err) {
            console.log(err);
        }
    },
};
