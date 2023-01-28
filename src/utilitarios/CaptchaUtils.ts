export const randomFromRange = (start: number, end: number) => {
    return Math.round(Math.random() * (end - start) + start);
}

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const randomWidgetId = () => {

    const length = between(10, 12);

    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

const between = (min: number, max: number) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

export const getRandomUserAgent = () => {

    return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36';
}