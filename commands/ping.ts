import IMessageHandler from '../interfaces/message_handler.ts'

const ping: IMessageHandler = {
    handler: async (message) => {
        const startTime = Date.now();
        const msg = await message.reply('π γγ³γ°δΈ­');
        const endTime = Date.now();
        const diff = endTime - startTime;
        await msg.edit(`π γγ³οΌ\n${diff}γγͺη§γγγ£γ¦γγ οΌγ―γ½γοΌ`);
    }
}

export default ping;