import { 
    startBot, Embed, EmbedAuthor, EmbedFooter, EmbedThumbnail, MessageContent, 
    Message, editBotsStatus, StatusTypes, getApplicationInformation } from 'https://deno.land/x/discordeno/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { getRandomNumber } from './utility.ts'

const PRESENCES = ['僕のヒーローアカデミア', 'デク', 'クソ髪', 'クソナード', '丸顔', 'クソメガネ', '半分野郎', 'アホ面'];
const RANDOM_RESPONSES = [
    '死ね！',
    'くだばれ！',
    'クソか！',
    '殺すぞ！',
    '遅んだよ！',
    'どこ見てんだよ！',
    'デクってのは何も出来ねー奴のことだな！',
    '俺は一番になってやる！',
    '黙ってついて来い！',
    '倒れねーってのは、クソ強ェだろ',
    '決めてンだよ俺ァ！勝負は必ず完全勝利！',
    '誰だよオメー',
    'ッんだこれ！',
    '勝つんだよ。それが…ヒーローなんだから',
    'てめェの何がオールマイトにそこまでさせたのか、確かめさせろ',
    'こっち来んな！'
];

let clientId: string | null = null;

function updatePresence() {
    editBotsStatus(StatusTypes.Online, PRESENCES[getRandomNumber(PRESENCES.length)])
    setTimeout(updatePresence, 20 * 1000);
}

startBot({
    token: config().TOKEN,
    intents: ['GUILD_MESSAGES', 'GUILDS'],
    eventHandlers: {
        async ready() {
            console.log('Successfully connected to the gateway.');
            const appInfo = await getApplicationInformation();
            clientId = appInfo.id;
            updatePresence();
        },

        async messageCreate(message: Message) {
            if (message.content.startsWith('b?ping')) {
                const startTime = Date.now();
                const msg = await message.reply('🏓 ピング中');
                const endTime = Date.now();
                const diff = endTime - startTime;
                await msg.edit(`🏓 ポン！\n${diff}ミリ秒かかってんだ！クソか！`);
            }

            if (message.content.startsWith('b?about')) {
                const embed: Embed = {
                    author: <EmbedAuthor>{
                        name: '僕のヒーローアカデミアの爆豪勝己',
                        icon_url: 'https://cdn.discordapp.com/avatars/727418737308729376/a370b8b4a3a9bed03fb7cb7cfc51b0f4.webp?size=1024https://cdn.discordapp.com/avatars/727418737308729376/a370b8b4a3a9bed03fb7cb7cfc51b0f4.webp?size=1024'
                    },
                    description: 'ザ・ランド・オブ・キュート・ボイズの爆豪勝己。\n \
                    爆豪勝己はアニメ・マンガ・ゲーム「[僕のヒーローアカデミア](https://heroaca.com/)」の一人の主人公です。\n \
                    爆豪バージョン0.1の開発者：\n \
                    **Tetsuki Syu#1250、Kirito#9286**\n \
                    制作言語・フレームワーク：\n \
                    [Deno](https://deno.land/)と[Discordeno](https://github.com/discordeno/discordeno)ライブラリ。',
                    footer: <EmbedFooter>{
                        text: '爆豪ボット：リリース 0.1 | 2021-03-29'
                    },
                    thumbnail: <EmbedThumbnail>{
                        url: 'https://cdn.discordapp.com/attachments/811517007446671391/822988374595862548/1200px-Typescript_logo_2020.png'
                    },
                    color: 0xE3DAC9
                };

                await message.reply(<MessageContent>{
                    embed: embed
                });
            }

            if (clientId !== null && message.content.includes(clientId)) {
                await message.reply(<MessageContent>{
                    content: RANDOM_RESPONSES[getRandomNumber(RANDOM_RESPONSES.length)]
                });
            }
        }
    }
});