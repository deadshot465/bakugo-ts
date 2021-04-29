import about from './about.ts';
import evaluate from './eval.ts';
import ping from './ping.ts';
import { response } from './response.ts';
import IMessageHandler from '../interfaces/message_handler.ts';

const commands = new Map<string, IMessageHandler>();
commands.set('about', about);
commands.set('ping', ping);
commands.set('eval', evaluate);
commands.set('response', response);

export default commands;