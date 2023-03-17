import axios from 'axios';
import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";
import CaptchaService from './CaptchaService';
import CookiesService from './CookiesService';

export default class CadastroService {

    private headers: any;
    private carteira: ICarteiraProps;
    private captchaService: CaptchaService;
    private cookiesService: CookiesService;

    constructor(carteira: ICarteiraProps) {
        this.carteira = carteira;
        this.captchaService = new CaptchaService();
        this.cookiesService = new CookiesService();

        this.headers = {
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

        let configGetCadastroPage = {
            method: 'get',
            url: this.carteira.refer,
            headers: this.headers
        };

        this.cookiesService.removecookiesStorage(this.carteira.host);

        const response = await axios.request(configGetCadastroPage)

        const sitekey: string = this.getSiteKey(response.data);
        const crsfToken: string = this.getCrsfToken(response.data);

        this.cookiesService.setCookiesStorage(this.carteira.host, response.headers['set-cookie']);

        const tokenCaptcha = await this.captchaService.obterCaptcha({
            host: this.carteira.host,
            siteKey: sitekey,
        })

        let configRegister = {
            method: 'get',
            url: this.carteira.refer,
            headers: this.headers
        };

        const responseRegister = await axios.request(configRegister)



        return 1;
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