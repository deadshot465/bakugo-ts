import { config } from 'https://deno.land/x/dotenv/mod.ts';
import IMessageHandler from '../interfaces/message_handler.ts';
import { textDecoder, textEncoder } from '../shared/utility.ts';

const RANDOM_RESPONSES_PATH = './assets/randomResponses.json';

export const RANDOM_RESPONSES: Array<string> = JSON.parse(textDecoder.decode(await Deno.readFile(RANDOM_RESPONSES_PATH)));

export const response: IMessageHandler = {
    handler: async (message) => {
        const cmdPrefix = config().PREFIX + 'response ';
        const content = message.content.substring(cmdPrefix.length);
        const split = content.split(' ');
        const cmd = split.shift()?.toLowerCase();
        const context = split.join(' ');

        switch (cmd) {
            case 'add':
                await addResponse(context);
                await message.reply('ちっ、面倒臭いけどやってやろう。');
                break;
            case 'remove':
                if (await removeResponse(context)) {
                    await message.reply('うるせぇ。もうしねぇよ。');
                } else {
                    await message.reply('クソか！俺様がこんなことを言うと思ってやがってんの？');
                }
                break;
        }
    }
}

async function addResponse(context: string) {
    RANDOM_RESPONSES.push(context);
    await Deno.writeFile(RANDOM_RESPONSES_PATH, textEncoder.encode(JSON.stringify(RANDOM_RESPONSES)));
}

async function removeResponse(context: string): Promise<boolean> {
    const index = RANDOM_RESPONSES.findIndex(s => s === context);
    if (index !== -1) {
        RANDOM_RESPONSES.splice(index, 1);
        await Deno.writeFile(RANDOM_RESPONSES_PATH, textEncoder.encode(JSON.stringify(RANDOM_RESPONSES)));
    }
    return index !== -1;
}