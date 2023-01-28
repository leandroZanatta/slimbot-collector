import React from 'react';

import axios, { AxiosHeaders } from 'axios';
import { getRandomUserAgent, randomFromRange, randomWidgetId } from '../utilitarios/CaptchaUtils';
import { stringify } from 'qs-native';
import { motionData } from '../utilitarios/MotionData';

export interface CaptchaResolveProps {
    siteKey: string;
    host: string;
    executarComando: any
}

interface HSSiteConfigProps {
    type: string;
    req: string;
}

interface SiteConfigProps {
    c: HSSiteConfigProps
    features: any;
    pass: boolean;
}

interface TaskImage {
    uuid: string
    imagem: string;
    valido: boolean;
}

interface Task {
    key: string,
    type: string,
    titulo: string,
    imagens: Array<TaskImage>
}

interface RetornoCaptcha {
    sucesso: boolean;
    uuid?: string;
}

export default class CaptchaService {

    private axiosHttp: any;
    private version: string = '';
    private isInitialized: boolean = false;

    async initialize() {

        this.axiosHttp = axios.create({ baseURL: 'https://hcaptcha.com/' });
        const { data } = await this.axiosHttp.get('https://hcaptcha.com/1/api.js');
        const starts = data.indexOf('https://newassets.hcaptcha.com/captcha/v1/') + 42;
        this.version = data.substring(starts, data.indexOf('/', starts));

        this.createDefaultHeaders();

        this.isInitialized = true;
    }


    public async doResolve(captchaProps: CaptchaResolveProps): Promise<string | undefined> {

        if (!this.isInitialized) {
            await this.initialize();
        }

        var concluido = false;

        while (!concluido) {

            const widgetId = randomWidgetId();

            const siteConfig: SiteConfigProps = await this.obterSiteConfig(captchaProps);

            const task: Task = await this.getCaptcha(captchaProps, siteConfig, widgetId);

            const resultado: RetornoCaptcha = await this.applySolution(captchaProps, siteConfig, task);

            if (resultado.sucesso) {

                return resultado.uuid;
            }
        }
    }

    private async applySolution(captchaProps: CaptchaResolveProps, siteConfig: SiteConfigProps, task: Task): Promise<RetornoCaptcha> {

        const hsl = await this.hsw(siteConfig, captchaProps.executarComando);

        const answers: any = {};

        for (var i = 0; i < task.imagens.length; i++) {
            let image = task.imagens[i];
            answers[image.uuid] = `${image.valido}`;
        }

        const captchaData = {
            v: this.version,
            job_mode: task.type,
            answers: answers,
            serverdomain: captchaProps.host,
            sitekey: captchaProps.siteKey,
            motionData: JSON.stringify(motionData(new Date().getTime())),
            c: JSON.stringify(siteConfig.c),
            n: hsl,
        }

        const headers: AxiosHeaders = new AxiosHeaders();
        headers.set("Content-Type", "application/json;charset=UTF-8");
        headers.set("Accept", "*/*");
        headers.set("Origin", captchaProps.host);
        headers.set("Referer", captchaProps.host);

        try {

            const { data } = await this.axiosHttp.post(`/checkcaptcha/${captchaProps.siteKey}/${task.key}`, captchaData, { headers });

            return {
                sucesso: data.pass,
                uuid: data.generated_pass_UUID,
            }
        } catch (e) {
            debugger
            return {
                sucesso: false
            }
        }

    }

    private async getCaptcha(captchaProps: CaptchaResolveProps, siteConfig: SiteConfigProps, widgetId: string): Promise<Task> {

        const hsl = await this.hsw(siteConfig, captchaProps.executarComando);

        const captchaData = {
            v: this.version,
            sitekey: captchaProps.siteKey,
            host: captchaProps.host,
            hl: 'pt-Br',
            c: JSON.stringify(siteConfig.c),
            n: hsl,
            motionData: JSON.stringify({
                v: 1,
                widgetList: [widgetId],
                widgetId: widgetId,
                href: captchaProps.host,
                prev: {
                    escaped: false,
                    passed: false,
                    expiredChallenge: false,
                    expiredResponse: false
                }
            })
        }

        const headers: AxiosHeaders = new AxiosHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");
        headers.set("Accept", "application/json");
        headers.set("Origin", captchaProps.host);
        headers.set("Referer", captchaProps.host);

        const { data } = await this.axiosHttp.post('/getcaptcha', stringify(captchaData), { headers });

        return await this.getTask(data);
    }

    private async getTask(data: any): Promise<Task> {

        const imagens: Array<any> = [];

        for (var i = 0; i < data.tasklist.length; i++) {

            imagens.push({
                imagem: await this.getImage(data.tasklist[i].datapoint_uri),
                uuid: data.tasklist[i].task_key,
                valido: false
            });
        }

        const retornoValidos = await axios({
            method: 'POST',
            url: 'http://192.168.1.150:3333/api/v1/captcha',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: {
                titulo: data.requester_question.pt,
                imagens: imagens
            }
        });

        retornoValidos.data.forEach((valido: string) => {
            var imagen = imagens.find(imagem => imagem.uuid === valido);
            if (imagen) {
                imagen.valido = true;
            }
        })

        return {
            key: data.key,
            type: data.request_type,
            titulo: data.requester_question.pt,
            imagens: imagens
        }
    }

    private async getImage(imageSRC: string) {

        const data = await fetch(imageSRC);

        const blob = await data.blob();

        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    }


    private async hsw(siteConfig: SiteConfigProps, executarComando: any): Promise<string> {

        var e = siteConfig.c.req.split(".");

        var url = JSON.parse(atob(e[1])).l + "/" + siteConfig.c.type + ".js";

        const { data } = await axios({
            method: "get",
            url: url,
        });

        return await this.hswFunction(data, siteConfig.c.req, executarComando);
    }

    private async hswFunction(hsw: string, req: string, executarComando: any): Promise<string> {

        const dadosView = await executarComando(`

        try{
            ${hsw}

            hsw('${req}').then(sendSucess).catch(sendError);

        }catch(e){
            alert(e);
        }
        `);

        return dadosView.retornoComando.retorno;
    };

    private async obterSiteConfig(captchaProps: CaptchaResolveProps) {

        const { data } = await this.axiosHttp.post(`checksiteconfig?v=${this.version}&host=${captchaProps.host}&sitekey=${captchaProps.siteKey}&sc=1&swa=1$`);

        return data;
    }

    private getMouseMovements(timestamp: number) {

        let lastMovement = timestamp;

        const motionCount = randomFromRange(1000, 10000);

        const mouseMovements = [];

        for (let i = 0; i < motionCount; i++) {
            lastMovement += randomFromRange(0, 10);

            mouseMovements.push([randomFromRange(0, 500), randomFromRange(0, 500), lastMovement]);
        }

        return mouseMovements;
    }


    private createDefaultHeaders() {

        this.axiosHttp.defaults.headers.common['Host'] = 'hcaptcha.com';
        this.axiosHttp.defaults.headers.common['Connection'] = 'keep-alive';
        this.axiosHttp.defaults.headers.common['Cache-Control'] = 'no-cache';
        this.axiosHttp.defaults.headers.common['User-Agent'] = getRandomUserAgent();
        this.axiosHttp.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        this.axiosHttp.defaults.headers.common['Accept-Encoding'] = 'gzip, deflate, br';
        this.axiosHttp.defaults.headers.common['Accept-Language'] = 'pt-Br,pt;q=0.9';

    }

}