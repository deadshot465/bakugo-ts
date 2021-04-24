import { Message, MessageContent } from 'https://deno.land/x/discordeno/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { BAKUGO_COLOR, TYPESCRIPT_LOGO } from '../shared/constants.ts';
import IMessageHandler from '../interfaces/message_handler.ts';

interface JudgeZeroRequestBody {
    language_id : number
    source_code : string
}

interface JudgeZeroPostResponse {
    token : string
}

interface JudgeZeroGetResponse {
    status_id : number
    stdout : string
    stderr : string
    message : string
    memory : number
    time : string
    compile_output : string
}

const SUBMISSION_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*'
const TYPESCRIPT_ID = 74;
const MAX_ATTEMPTS = 5;

const evaluate: IMessageHandler = {
    handler: async (message) => {
        const codeBlock = message.content.substring(message.content.indexOf('`'), message.content.lastIndexOf('`') + 1)
        const split = codeBlock.split('\n');
        split.pop();
        split.shift();
        const actualCode = split.join('\n');

        const authHeader = generateAuthHeader();
        const body: JudgeZeroRequestBody = {
            language_id: TYPESCRIPT_ID,
            source_code: btoa(actualCode)
        };
        const response = await createEvalRequest(authHeader, body);
        
        const result = await tryGetEvalResult(response.token, authHeader, MAX_ATTEMPTS);
        if (result !== null) {
            await message.reply(generateEvalEmbed(message, result));
        } else {
            await message.reply({
                content: `こんなに簡単なコードでも書けねぇか？さっさと死ねや！`
            });
        }
    }
}

function generateAuthHeader(): Headers {
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('x-rapidapi-key', config().RAPID_API_KEY);
    headers.append('x-rapidapi-host', 'judge0-ce.p.rapidapi.com');

    return headers;
}

async function createEvalRequest(header: Headers, body: JudgeZeroRequestBody): Promise<JudgeZeroPostResponse> {
    const response = await fetch(SUBMISSION_URL, {
        headers: header,
        method: 'POST',
        body: JSON.stringify(body)
    });

    return response.json()
}

async function tryGetEvalResult(token: string, header: Headers, maxAttempt: number): Promise<JudgeZeroGetResponse | null> {
    let response = await getEvalResult(token, header);
    for (let i = 0; i < maxAttempt && response.status_id === 2; i++) {
        response = await getEvalResult(token, header);
    }

    if (response.status_id === 2) {
        return null; 
    }

    return response;
}

async function getEvalResult(token: string, header: Headers): Promise<JudgeZeroGetResponse> {
    const response = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`, {
        headers: header,
        method: 'GET'
    });
    const data: JudgeZeroGetResponse = await response.json();
    
    if (data.stdout !== null && data.stdout !== '') {
        data.stdout = atob(data.stdout);
    }

    if (data.compile_output !== null && data.compile_output !== '') {
        data.compile_output = atob(data.compile_output);
    }

    return data;
}

function generateEvalEmbed(message: Message, result: JudgeZeroGetResponse): MessageContent {
    if (result.stderr) {
        let msg = `アホか！貴様のコードにはエラーが出てきたんだよ：${result.stderr}`;
        if (result.message) {
            msg += `\nまあ、無個性だったらしょうがないな！他のメッセージも送ってやるわ。感謝しろや！${result.message}`;
        }
        return {
            content: msg
        };
    }

    if (!result.stdout) {
        if (result.compile_output) {
            let msg = `無個性のくせにヒーローになるわけねぇだろう！屋上から飛び降りで死ね！：${result.compile_output}`;
            if (msg.length > 2047) {
                msg = msg.substring(0, 2000);
            }
            return {
                content: msg
            };
        }
    }

    const guildId = message.guildID;
    const description = `なんだこりゃ？ヴィランが言いそうなクソ痴話か、${message.member?.name(guildId)}！\n\`\`\`bash\n${result.stdout}\n\`\`\``;
    if (description.length > 2047) {
        return {
            content: '馬鹿野郎！メッセージが長すぎたんだよ！'
        };
    }

    return {
        embed: {
            author: {
                name: message.member?.name(guildId),
                icon_url: message.member?.avatarURL
            },
            description: description,
            color: BAKUGO_COLOR,
            thumbnail: {
                url: TYPESCRIPT_LOGO
            },
            fields: [
                {
                    name: '費やす時間',
                    value: `${result.time} 秒`,
                    inline: true
                },
                {
                    name: 'メモリー',
                    value: `${result.memory} KB`,
                    inline: true
                }
            ]
        }
    };
}

export default evaluate;