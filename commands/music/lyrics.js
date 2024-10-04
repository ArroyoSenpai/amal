const { EmbedBuilder, channelLink } = require("discord.js");
const { escapeMarkdown } = require("discord.js");
const distube = require('../../client/distube');
const lyricsFinder = require("@jeve/lyrics-finder");
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "كلمات",
    description: "عرض كلمات الأغنية",
    cooldown: 5000,
    async execute(client, message) {
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
            let data;

            try {
                data = await lyricsFinder.LyricsFinder(`${song.name}`);
            } catch {
                data = false;
            }

            if (!data || !data?.trim) {
                return message.reply({ content: `:rolling_eyes: لا توجد كلمات لـ **${song.name}**` });
            }

            let embeds = [];

            if (data.length >= 2048) {
                const messages = splitMessage(data, {
                    maxLength: 4000,
                    char: '\n',
                });

                for (const message of messages) {
                    let embed = new EmbedBuilder()
                        .setDescription(`${message}`);

                    if (!embeds.length) {
                        embed.setTitle(`كلمات ${song.name}`);
                    }

                    if (embeds.length < 10) { embeds.push(embed); }
                }
            }

            if (embeds.length) { message.reply({ embeds }); }
        } catch (err) {
            console.log(err);
        }
    },
};

function verifyString(
    data,
    error = Error,
    errorMessage = `Expected a string, got ${data} instead.`,
    allowEmpty = true,
) {
    if (typeof data !== 'string') throw new error(errorMessage);
    if (!allowEmpty && data.length === 0) throw new error(errorMessage);
    return data;
}

function splitMessage(text, { maxLength = 1024, char = '\n', prepend = '', append = '' }) {
    text = verifyString(text);

    if (text.length <= maxLength) return [text];

    let splitText = [text];

    if (Array.isArray(char)) {
        while (char.length > 0 && splitText.some(elem => elem.length > maxLength)) {
            const currentChar = char.shift();

            if (currentChar instanceof RegExp) {
                splitText = splitText.flatMap(chunk => chunk.match(currentChar));
            } else {
                splitText = splitText.flatMap(chunk => chunk.split(currentChar));
            }
        }
    } else {
        splitText = text.split(char);
    }

    if (splitText.some(elem => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');

    const messages = [];
    let msg = '';

    for (const chunk of splitText) {
        if (msg && (msg + char + chunk + append).length > maxLength) {
            messages.push(msg + append);
            msg = prepend;
        }

        msg += (msg && msg !== prepend ? char : '') + chunk;
    }

    return messages.concat(msg).filter(m => m);
}
