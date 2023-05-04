import AsyncStorage from "@react-native-async-storage/async-storage";

export default class CookiesService {

    public async setCookiesStorage(host: string, cookies: Array<string> | undefined) {

        if (cookies) {

            let cookiesAtuais: Array<string> | null = await this.getCookiesStorage(host);

            if (cookiesAtuais == null) {
                cookiesAtuais = [];
            }

            for (var i = 0; i < cookies.length; i++) {

                const cookiesSplit = cookies[i].split(';');

                for (var j = 0; j < cookiesSplit.length; j++) {

                    let key: string = cookiesSplit[j].trim().split('=')[0].trim();
                    let index = -1;

                    if (cookiesAtuais != null) {

                        index = cookiesAtuais.findIndex(cookie => cookie.split('=')[0] === key);
                    }

                    index >= 0 ? cookiesAtuais[index] = cookiesSplit[j].trim() : cookiesAtuais.push(cookiesSplit[j].trim());
                }
            }

            await AsyncStorage.setItem(`${host.split('.')[0]}-cookies`, JSON.stringify(cookiesAtuais));
        }
    }

    public async removecookiesStorage(host: string) {

        await AsyncStorage.removeItem(`${host.split('.')[0]}-cookies`);
    }

    public async getCookiesStorage(host: string): Promise<Array<string> | null> {

        try {
            const item = await AsyncStorage.getItem(`${host.split('.')[0]}-cookies`);

            if (item) {

                return JSON.parse(item);
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }



}