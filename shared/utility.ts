export function getRandomNumber(max: number): number {
    return Math.floor(Math.random() * Math.floor(max))
}

export const textEncoder = new TextEncoder();
export const textDecoder = new TextDecoder();