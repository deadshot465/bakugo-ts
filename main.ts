import { 
    startBot, MessageContent, 
    Message, editBotsStatus, StatusTypes, getApplicationInformation } from 'https://deno.land/x/discordeno/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import COMMANDS from './commands/index.ts';
import { RANDOM_RESPONSES  } from './commands/response.ts';
import { PRESENCES } from './shared/constants.ts';
import { getRandomNumber } from './shared/utility.ts'


let clientId: string | null = null;

function updatePresence() {
    editBotsStatus(StatusTypes.Online, PRESENCES[getRandomNumber(PRESENCES.length)])
    setTimeout(updatePresence, 3600 * 1000);
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
            if (clientId !== null && message.content.includes(clientId)) {
                await message.reply(<MessageContent>{
                    content: RANDOM_RESPONSES[getRandomNumber(RANDOM_RESPONSES.length)]
                });
            }

            await handleMessage(message);
        }
    }
});

async function handleMessage(message: Message) {
    const prefix = config().PREFIX;
    if (message.content.startsWith(prefix) && !message.member?.bot) {
        const trimmed = message.content.substring(prefix.length)
        const msgArgs = trimmed.split(' ');
        
        if (msgArgs.length === 0) {
            return;
        }

        const cmd = msgArgs[0].toLowerCase();

        // Try getting the command from the map.
        const command = COMMANDS.get(cmd);
        if (command !== undefined) {
            await command.handler(message);
        } else {
            if (cmd.startsWith('eval')) {
                await COMMANDS.get('eval')?.handler(message);
            }
        }
    }
}