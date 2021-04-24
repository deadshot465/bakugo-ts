import { Message } from 'https://deno.land/x/discordeno/mod.ts';

export default interface IMessageHandler {
    handler: (message: Message) => Promise<void>
}