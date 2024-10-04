const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "ساعدني",
    description: 'Feeling lost?', // الوصف: شعور بالضياع؟
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            const globPromise = promisify(glob);
            // البحث عن ملفات الأوامر في المجلد المخصص للموسيقى
            const commandFiles = await globPromise(`${process.cwd()}/commands/music/**/*.js`);

            // إعداد الـ Embed الرئيسي
            let embed = new EmbedBuilder()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

            // إضافة حقول الأوامر إلى الـ Embed
            commandFiles.map((value) => {
                const file = require(value);
                const splitted = value.split("/");
                const directory = splitted[splitted.length - 2];

                if (file.name) {
                    const properties = { directory, ...file };
                    embed.addFields({ name: `${prefix}${properties.name}`, value: `${properties.description}`, inline: false });
                }
            });

            // إعداد الصفحة الإضافية للأزرار
            let row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Invite Bot') // دعوة البوت
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`))
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Server Support') // دعم الخادم
                        .setURL(`https://discord.gg/developer-tools`));

            // إرسال الـ Embed مع الأزرار
            message.reply({ embeds: [embed], components: [row] });
        } catch (err) {
            console.log(err);
        }
    },
};
