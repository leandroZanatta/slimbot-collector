import axios from 'axios';
import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";

export default class CadastroService {

    private header: any;
    private cookies: Map<string, string>;
    private carteira: ICarteiraProps;

    constructor(carteira: ICarteiraProps) {
        this.carteira = carteira;
        this.cookies = new Map();
        this.header = {
            'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'host': this.carteira.host
        }
    }

    public async efetuarCadastro(): Promise<number> {

        let config = {
            method: 'get',
            url: this.carteira.refer,
            header: this.header
        };

        const response = await axios.request(config)

        const sitekey: string = this.getSiteKey(response.data);
        const crsfToken: string = this.getCrsfToken(response.data);

        this.updateCookie(response.headers['set-cookie']);

      

        return 1;
    }


    private updateCookie(cookies: Array<any> | undefined) {

        if (cookies) {

            for (var i = 0; i < cookies.length; i++) {

                this.cookies.set(cookies[i].substring(0, cookies[i].indexOf("=")), cookies[i]);
            }
        }

    }

    private getSiteKey(data: string): string {

        const strIndex: string = "sitekey: '";

        const indexInicial: number = data.indexOf(strIndex);

        return data.substring((indexInicial + strIndex.length), data.indexOf("',", indexInicial)).trim();
    }


    private getCrsfToken(data: string): string {

        const strIndex: string = "<meta name=\"csrf-token\" content=\"";

        const indexInicial: number = data.indexOf(strIndex);

        const retorno: string = data.substring((indexInicial + strIndex.length), data.indexOf("/>", indexInicial) - 1);

        if (retorno.endsWith("\"")) {
            return retorno.substring(0, retorno.length - 1);
        }

        return retorno;
    }



}