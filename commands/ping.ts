import IMessageHandler from '../interfaces/message_handler.ts'

const ping: IMessageHandler = {
    handler: async (message) => {
        const startTime = Date.now();
        const msg = await message.reply('🏓 ピング中');
        const endTime = Date.now();
        const diff = endTime - startTime;
        await msg.edit(`🏓 ポン！\n${diff}ミリ秒かかってんだ！クソか！`);
    }
}

export default ping;