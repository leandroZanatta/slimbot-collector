import axios from "axios";
import { WebSQLDatabase } from "expo-sqlite";
import { stringify } from "qs-native";
import CarteiraRepository from "../repository/CarteiraRepository";
import ExecucaoFaucetRepository from "../repository/ExecucaoFaucetRepository";
import FaucetRepository from "../repository/FaucetRepository";
import Carteira from "../repository/model/carteira/Carteira";
import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";
import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import ExecucaoFaucet from "../repository/model/execucaofaucet/EcecucaoFaucet";
import { IFaucetCarteiraProps } from "../repository/model/faucet/Faucet.meta";
import { getRandomUserAgent } from "../utilitarios/CaptchaUtils";
import CookiesService from "./CookiesService";

interface DadosPaginaProps {
    isLogged: boolean;
    crsfToken: string,
    siteKey: string
    timeOut?: number;
    numRols?: number | null;
    balance?: number;
}

interface DataCollector {
    proximoRoll: Date,
    coinsGanhos: number;
    totalBalanco: number;
}

interface ResultsCollector {
    status: boolean;
    error?: string;
    rollsPendentes?: number;
    dadosColeta?: DataCollector;
}

export default class CollectorService {

    private cookiesService: CookiesService;

    constructor() {
        this.cookiesService = new CookiesService();
    }

    public async collectFaucet(db: WebSQLDatabase, configuracoes: IConfiguracaoProps, faucetCarteira: IFaucetCarteiraProps) {

        console.log('Iniciando coleta de ' + faucetCarteira.carteira);

        const carteira: ICarteiraProps | null = await new CarteiraRepository(db).findFirst(Carteira.Builder().id(faucetCarteira.codigoCarteira));

        if (carteira != null) {
            debugger
            console.log(`${carteira.descricao} - Data de coleta: ${faucetCarteira.proximaExecucao}, Saldo atual da carteira: ${faucetCarteira.saldoAtual}`);

            const dadosPagina: DadosPaginaProps = await this.obterDadosPaginaInicial(carteira, configuracoes);

            const faucetRepository = new FaucetRepository(db);

            if (dadosPagina.timeOut == 0) {

                const dadosColeta: Array<DataCollector> = await this.executarRollsPendentes(carteira, dadosPagina);

                if (dadosColeta.length > 0) {

                    const execucaoFaucetRepository = new ExecucaoFaucetRepository(db);

                    console.log(`${carteira.descricao} - Coletas: ${JSON.stringify(dadosColeta)}`);

                    for (var c = 0; c < dadosColeta.length; c++) {
                        execucaoFaucetRepository.save(ExecucaoFaucet.Builder().codigoFaucet(faucetCarteira.id).dataExecucao(new Date()).valorRoll(dadosColeta[c].coinsGanhos));
                    }

                    const ultimaColeta = dadosColeta[dadosColeta.length - 1];

                    faucetRepository.atualizarDadosFaucet(carteira.id, ultimaColeta.proximoRoll, ultimaColeta.totalBalanco);
                }

            } else if (dadosPagina.timeOut && dadosPagina.balance) {
                console.log(`${carteira.descricao} - Aguarde: ${dadosPagina.timeOut} segundos`);

                faucetRepository.atualizarDadosFaucet(carteira.id, new Date(new Date().getTime() + (dadosPagina.timeOut * 1000)), dadosPagina.balance);
            }
        }
    }


    private async executarRollsPendentes(carteira: ICarteiraProps, dadosPagina: DadosPaginaProps): Promise<Array<DataCollector>> {
        console.log(`${carteira.descricao} - Rols pendentes: ${dadosPagina.numRols}`);

        const coletas: Array<DataCollector> = [];

        while (dadosPagina.numRols && dadosPagina.numRols != null && dadosPagina.numRols > 0) {

            var results = await this.efetuarRoll(carteira.host, 'whitelist', dadosPagina);

            if (!results.status && results.error) {

                if (results.error === 'captcha') {
                    console.log(`${carteira.descricao} - Resolvendo Captcha`);

                    const uuid: string = await this.obterCaptcha(carteira.host, dadosPagina.siteKey);

                    if (uuid) {
                        results = await this.efetuarRoll(carteira.host, uuid, dadosPagina);
                    }
                }
            }

            if (results.status) {

                dadosPagina.numRols = results.rollsPendentes;

                if (results.dadosColeta) {
                    coletas.push(results.dadosColeta);
                }
            }
        }

        return coletas;

    }

    private async obterDadosPaginaInicial(carteira: ICarteiraProps, configuracoes: IConfiguracaoProps): Promise<DadosPaginaProps> {

        while (true) {

            const dadosPagina: DadosPaginaProps = await this.getHomePage(carteira.host);

            if (dadosPagina.isLogged) {

                return dadosPagina;
            }

            console.log(`${carteira.descricao} - Efetuando login`);

            while (true) {

                await this.efetuarLogin(carteira.host, configuracoes, dadosPagina);

                let paginaAutenticada: DadosPaginaProps = await this.getHomePage(carteira.host);

                if (paginaAutenticada.isLogged) {

                    return paginaAutenticada;
                }
            }
        }

    }

    private async efetuarLogin(host: string, dadosUsuario: IConfiguracaoProps, dadosPagina: DadosPaginaProps): Promise<boolean> {

        await this.cookiesService.removecookiesStorage(host)

        const uuid: string = await this.obterCaptcha(host, dadosPagina.siteKey);

        if (uuid) {

            const formData = stringify({
                email: dadosUsuario.email,
                password: dadosUsuario.senha,
                "h-captcha-response": uuid
            });
            try {

                const headers: any = this.createHeaders(host);

                headers['X-CSRF-TOKEN'] = dadosPagina.crsfToken;
                headers['Accept'] = 'application/json, text/javascript, */*; q=0.01';
                headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

                const ret = await axios({
                    method: 'post',
                    url: `https://${host}/login`,
                    headers: headers,
                    data: formData
                });

                if (ret.data.success && ret.headers["set-cookie"]) {

                    await this.cookiesService.setCookiesStorage(host, ret.headers["set-cookie"]);
                }

                return true;

            } catch (e: any) {
                debugger
                console.log(e);
            }
        }

        return false;
    }

    private async getHomePage(host: string): Promise<DadosPaginaProps> {

        const headers: any = this.createHeaders(host);

        headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';

        const cookies: Array<string> | null = await this.cookiesService.getCookiesStorage(host);

        if (cookies != null) {
            headers.Cookie = cookies.join(';');
        }

        const ret = await axios({
            method: 'get',
            url: `https://${host}`,
            headers: headers
        });


        if (ret.headers["set-cookie"]) {
            await this.cookiesService.setCookiesStorage(host, ret.headers["set-cookie"]);
        }

        if (this.isLogged(ret.data)) {

            let timeout: number = this.getTimeOut(ret.data);
            let numRols: number | null = null;

            if (timeout == 0) {

                numRols = this.getRolls(ret.data);
            }

            return {
                isLogged: true,
                crsfToken: this.getCrsfToken(ret.data),
                siteKey: this.getSiteKey(ret.data),
                balance: this.getBalance(ret.data),
                timeOut: timeout,
                numRols: numRols,
            }
        }

        return {
            isLogged: false,
            crsfToken: this.getCrsfToken(ret.data),
            siteKey: this.getSiteKey(ret.data),
        }
    }

    private async efetuarRoll(host: string, captchaId: string, dadosPagina: DadosPaginaProps): Promise<ResultsCollector> {

        const headers: any = this.createHeaders(host);
        headers['Accept'] = '*/*';
        headers['X-CSRF-TOKEN'] = dadosPagina.crsfToken;
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

        const formData = stringify({
            "h-captcha-response": captchaId
        });

        const cookies: Array<string> | null = await this.cookiesService.getCookiesStorage(host);

        if (cookies != null) {
            headers.Cookie = cookies.join(';');
        }

        try {
            const ret = await axios({
                method: 'post',
                url: `https://${host}/ajax-roll`,
                headers: headers,
                data: formData
            });


            if (ret.headers["set-cookie"]) {

                await this.cookiesService.setCookiesStorage(host, ret.headers["set-cookie"]);
            }

            if (ret.data.status) {
                return {
                    status: ret.data.status,
                    rollsPendentes: ret.data.pending_rolls,
                    dadosColeta: {
                        coinsGanhos: ret.data.coins_won,
                        totalBalanco: ret.data.total_coins,
                        proximoRoll: new Date(new Date().getTime() + (ret.data.remaining_seconds * 1000))
                    }
                }
            } else {
                return {
                    status: ret.data.status,
                    error: ret.data.error
                }
            }
        } catch (e) {
            console.log(e)
        }
        return {
            status: false
        }
    }

    private async obterCaptcha(host: string, siteKey: string): Promise<string> {
        try {
            const { data } = await axios({
                method: 'POST',
                url: 'http://ec2-54-144-137-196.compute-1.amazonaws.com:80/api/v1/captcha/resolver',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                data: { host, siteKey }
            });

            return data;

        } catch (error) {
            debugger
            return '';
        }
    }

    private createHeaders(host: string): any {

        return {
            'host': host,
            'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'User-Agent': getRandomUserAgent(),
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
        }
    }

    private isLogged(page: string) {

        return page.indexOf('<a href="/logout">') > 0
    }

    private getTimeOut(data: string): number {

        const strIndex = 'var remainingSeconds =';

        const indexInicial = data.indexOf(strIndex);

        return parseInt(data.substring((indexInicial + strIndex.length), data.indexOf(';', indexInicial)).trim());
    }

    private getSiteKey(data: string): string {

        const strIndex = "sitekey: '";

        const indexInicial = data.indexOf(strIndex);

        return data.substring((indexInicial + strIndex.length), data.indexOf("',", indexInicial)).trim();
    }

    private getBalance(data: string): number {

        const strIndex = '<li class="navbar-coins bg-1 d-none';

        const indexInicial = data.indexOf(strIndex);

        const subData = data.substring(indexInicial + strIndex.length, data.length);

        return parseFloat(subData.substring(0, subData.indexOf('</a>')).replace(/[^\d.]/g, ""));
    }

    private getRolls(data: string): number {

        const strIndex = '<span class="pending-rolls">';

        const indexInicial = data.indexOf(strIndex);

        const subData = data.substring(indexInicial, data.length);

        return parseInt(subData.substring(0, subData.indexOf('</')).replace(/\D/g, ""));
    }

    private getCrsfToken(data: string): string {

        const strIndex = '<meta name="csrf-token" content="';

        const indexInicial = data.indexOf(strIndex);

        const retorno = data.substring((indexInicial + strIndex.length), data.indexOf('/>', indexInicial) - 1);

        if (retorno.endsWith('"')) {
            return retorno.substring(0, retorno.length - 1);
        }

        return retorno;
    }
}