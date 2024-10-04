const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
const distube = require('../../client/distube')
const ytsr = require("@distube/ytsr")
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "بحث",
    description: "ابحث عن أغنية وشغل الموسيقى.",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) {
                return message.reply({ content: `:no_entry_sign: يجب أن تكون في الاستماع إلى \`${message.guild.members.me?.voice?.channel.name}\` لاستخدام ذلك!` });
            }

            if (!message.member.voice.channel) {
                return message.reply({ content: ":no_entry_sign: يجب عليك الانضمام إلى قناة صوت لاستخدام هذا!" });
            }

            const voiceChannel = message.member?.voice?.channel;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("one")
                        .setEmoji("1️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("two")
                        .setEmoji("2️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("three")
                        .setEmoji("3️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("four")
                        .setEmoji("4️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("five")
                        .setEmoji("5️⃣")
                        .setStyle(ButtonStyle.Secondary)
                );

            const options = {
                member: message.member,
                textChannel: message.channel,
                message,
            };

            const searchString = args.slice(0).join(' ');

            if (!searchString) {
                return message.reply(`:no_entry_sign: **الرجاء تضمين استعلام.**`);
            }

            const searchResults = await ytsr(searchString, { safeSearch: true, limit: 5 });

            let index = 1;
            const result = searchResults.items.slice(0, 5).map(x => `**${index++}. [${x.name}](${x.url})**`).join("\n");

            const embed = new EmbedBuilder()
                .setDescription(result)
                .setFooter({ text: `الرجاء الاستجابة خلال 30 ثانية` });

            message.reply({ content: "", embeds: [embed], components: [row] }).then((msg) => {
                const filter = i => i.user.id === message.author.id;

                const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });

                collector.on('collect', async (message) => {
                    const id = message.customId;

                    if (id === "one") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, searchResults.items[0].url, options);
                    } else if (id === "two") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, searchResults.items[1].url, options);
                    } else if (id === "three") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, searchResults.items[2].url, options);
                    } else if (id === "four") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, searchResults.items[3].url, options);
                    } else if (id === "five") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, searchResults.items[4].url, options);
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === "time") {
                        msg.delete({ content: ``, embeds: [], components: [] });
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }
    }
};
