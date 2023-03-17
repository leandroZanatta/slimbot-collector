import axios from "axios";

export interface ICaptchaProps {
    host: string;
    siteKey: string;
}

export default class CaptchaService {

    private captchaURL = '192.168.1.150';

    public async obterCaptcha(dadosCaptcha: ICaptchaProps): Promise<string> {


        const { data } = await axios.request({
            url: `http://${this.captchaURL}/api/v1/captcha/resolver`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: dadosCaptcha
        })

        return data;
    }
}