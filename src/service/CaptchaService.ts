import axios from "axios";

export interface ICaptchaProps {
  host: string;
  siteKey: string;
  captchaUrl: string;
}

export interface IRefProps {
  urlReferencia: string;
  email: string;
  senha: string;
  carteira: string;
}

export interface IReferenciaCarteiraProps {
  carteira: string;
  referencia: string;
}

export default class CaptchaService {
  public async obterCaptcha(dadosCaptcha: ICaptchaProps): Promise<string> {
    const { data } = await axios.request({
      url: `${dadosCaptcha.captchaUrl}/api/v1/captcha/resolver`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: dadosCaptcha,
    });

    return data;
  }

  public async obterReferencias(
    codigoReferencia: string,
    captchaUrl: string
  ): Promise<IReferenciaCarteiraProps[]> {
    const { data } = await axios.request({
      url: `${captchaUrl}/api/v1/referencia/${codigoReferencia}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      data: null,
    });

    return data;
  }

  public async enviarUrlReferencia(
    referencia: IRefProps,
    captchaUrl: string
  ): Promise<string> {
    const { data } = await axios.request({
      url: `${captchaUrl}/api/v1/referencia`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: referencia,
    });

    return data;
  }
}
