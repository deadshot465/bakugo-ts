import { Embed, MessageContent } from 'https://deno.land/x/discordeno/mod.ts';
import IMessageHandler from '../interfaces/message_handler.ts'
import { BAKUGO_COLOR, BAKUGO_ICON, TYPESCRIPT_LOGO } from '../shared/constants.ts'

const about: IMessageHandler = {
    handler: async (message) => {
        const embed: Embed = {
            author: {
                name: '僕のヒーローアカデミアの爆豪勝己',
                icon_url: BAKUGO_ICON
            },
            description: 'ザ・ランド・オブ・キュート・ボイズの爆豪勝己。\n \
            爆豪勝己はアニメ・マンガ・ゲーム「[僕のヒーローアカデミア](https://heroaca.com/)」の一人の主人公です。\n \
            爆豪バージョン0.2.1の開発者：\n \
            **Tetsuki Syu#1250、Kirito#9286**\n \
            制作言語・フレームワーク：\n \
            [Deno](https://deno.land/)と[Discordeno](https://github.com/discordeno/discordeno)ライブラリ。',
            footer: {
                text: '爆豪ボット：リリース 0.2.1 | 2021-04-25'
            },
            thumbnail: {
                url: TYPESCRIPT_LOGO
            },
            color: BAKUGO_COLOR
        }
        
        await message.reply(<MessageContent>{
            embed: embed
        });
    }
}

export default about;