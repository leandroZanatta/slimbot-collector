import axios, { AxiosResponse } from 'axios';
import { stringify } from "qs-native";
import { IFaucetCarteiraProps } from "../repository/model/carteira/Carteira.meta";
import CookiesService from './CookiesService';
import { IUsuarioProps } from '../repository/model/usuario/Usuario.meta';

export default class CadastroService {

    private headers: any;
    private carteira: IFaucetCarteiraProps;
    private usuario: IUsuarioProps;
    private cookiesService: CookiesService;

    constructor(carteira: IFaucetCarteiraProps, usuario: IUsuarioProps) {
        this.carteira = carteira;
        this.usuario = usuario;
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

    public async obterPaginaCadastro(): Promise<AxiosResponse<any>> {

        let configGetCadastroPage = {
            method: 'get',
            url: this.carteira.refer,
            headers: this.headers
        };

        this.cookiesService.removecookiesStorage(this.carteira.host);

        const response = await axios.request(configGetCadastroPage)

        this.cookiesService.setCookiesStorage(this.carteira.host, response.headers['set-cookie']);

        return response;

    }

    public async efetuarCadastro(crsfToken: string, tokenCaptcha: string): Promise<AxiosResponse<any>> {

        let config = {
            method: 'post',
            url: `https://${this.carteira.host}/register`,
            headers: {
                ...this.headers,
                'X-CSRF-TOKEN': crsfToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                "Cookie": await this.cookiesService.getCookiesStorage(this.carteira.host)
            },
            data: stringify({
                email: this.usuario.email,
                password: this.usuario.senha,
                "password_confirmation": this.usuario.senha,
                "h-captcha-response": tokenCaptcha
            })
        };

        const response = await axios.request(config)

        this.cookiesService.setCookiesStorage(this.carteira.host, response.headers['set-cookie']);

        return response;
    }

    public async efetuarLogin(crsfToken: string, tokenCaptcha: string): Promise<AxiosResponse<any>> {

        let config = {
            method: 'post',
            url: `https://${this.carteira.host}/login`,
            headers: {
                ...this.headers,
                'X-CSRF-TOKEN': crsfToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                "Cookie": await this.cookiesService.getCookiesStorage(this.carteira.host)
            },
            data: stringify({
                email: this.usuario.email,
                password: this.usuario.senha,
                "h-captcha-response": tokenCaptcha
            })
        };

        const response = await axios.request(config)

        this.cookiesService.setCookiesStorage(this.carteira.host, response.headers['set-cookie']);

        return response;
    }

    public async obterPaginaInicial(): Promise<AxiosResponse<any>> {

        let config = {
            method: 'get',
            url: `https://${this.carteira.host}`,
            headers: {
                ...this.headers,
                "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                "Cookie": await this.cookiesService.getCookiesStorage(this.carteira.host)
            }
        };

        const response = await axios.request(config)

        this.cookiesService.setCookiesStorage(this.carteira.host, response.headers['set-cookie']);

        return response;
    }







}