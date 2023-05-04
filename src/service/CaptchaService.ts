import axios from "axios";

export interface ICaptchaProps {
    host: string;
    siteKey: string;
    captchaUrl: string;
}

export default class CaptchaService {


    public async obterCaptcha(dadosCaptcha: ICaptchaProps): Promise<string> {
        
        const { data } = await axios.request({
            url: `${dadosCaptcha.captchaUrl}/api/v1/captcha/resolver`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: dadosCaptcha
        })

        return data;
    }
}