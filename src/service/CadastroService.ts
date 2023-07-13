import axios, { AxiosResponse } from "axios";
import { stringify } from "qs-native";
import { IFaucetCarteiraProps } from "../repository/model/carteira/Carteira.meta";
import CookiesService from "./CookiesService";
import { IUsuarioProps } from "../repository/model/usuario/Usuario.meta";

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
      "sec-ch-ua":
        '"Not_A Brand;v=99", "Google Chrome";v="109", "Chromium";v="109"',
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "X-Requested-With": "XMLHttpRequest",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      host: this.carteira.host,
    };
  }

  public async obterPaginaCadastro(): Promise<AxiosResponse<any>> {
    let configGetCadastroPage = {
      method: "get",
      url: this.carteira.refer,
      headers: {
        ...this.headers,
        Cookie: await this.cookiesService.getCookiesStorage(
          this.carteira.codigoFaucet
        ),
      },
    };

    const response = await axios.request(configGetCadastroPage);

    this.cookiesService.setCookiesStorage(
      this.carteira.codigoFaucet,
      response.headers["set-cookie"]
    );

    return response;
  }

  public async efetuarCadastro(
    crsfToken: string,
    tokenCaptcha: string
  ): Promise<AxiosResponse<any>> {
    let config = {
      method: "post",
      url: `https://${this.carteira.host}/register`,
      headers: {
        ...this.headers,
        "X-CSRF-TOKEN": crsfToken,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "application/json, text/javascript, */*; q=0.01",
        Cookie: await this.cookiesService.getCookiesStorage(
          this.carteira.codigoFaucet
        ),
      },
      data: stringify({
        email: this.usuario.email,
        password: this.usuario.senha,
        password_confirmation: this.usuario.senha,
        "h-captcha-response": tokenCaptcha,
      }),
    };

    const response = await axios.request(config);

    this.cookiesService.setCookiesStorage(
      this.carteira.codigoFaucet,
      response.headers["set-cookie"]
    );

    return response;
  }

  public async efetuarLogin(
    crsfToken: string,
    tokenCaptcha: string
  ): Promise<AxiosResponse<any>> {
    let config = {
      method: "post",
      url: `https://${this.carteira.host}/login`,
      headers: {
        ...this.headers,
        "X-CSRF-TOKEN": crsfToken,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "application/json, text/javascript, */*; q=0.01",
        Cookie: await this.cookiesService.getCookiesStorage(
          this.carteira.codigoFaucet
        ),
      },
      data: stringify({
        email: this.usuario.email,
        password: this.usuario.senha,
        "h-captcha-response": tokenCaptcha,
      }),
    };

    const response = await axios.request(config);

    this.cookiesService.setCookiesStorage(
      this.carteira.codigoFaucet,
      response.headers["set-cookie"]
    );

    return response;
  }

  public async atualizarCarteiraTransferencia(
    crsfToken: string,
    carteiraTransferencia: string
  ): Promise<AxiosResponse<any>> {
    let config = {
      method: "post",
      url: `https://${this.carteira.host}/ajax-change-wallet`,
      headers: {
        ...this.headers,
        "X-CSRF-TOKEN": crsfToken,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Referer: `${this.carteira.host}/setting`,
        Cookie: await this.cookiesService.getCookiesStorage(
          this.carteira.codigoFaucet
        ),
      },
      data: stringify({
        wallet_address: carteiraTransferencia,
        password: this.usuario.senha,
      }),
    };

    const response = await axios.request(config);

    this.cookiesService.setCookiesStorage(
      this.carteira.codigoFaucet,
      response.headers["set-cookie"]
    );

    return response;
  }

  public async abrirUrlValidacao(
    crsfToken: string,
    urlValidacao: string
  ): Promise<AxiosResponse<any>> {
    let config = {
      method: "get",
      url: `${urlValidacao}`,
      headers: {
        ...this.headers,
        "X-CSRF-TOKEN": crsfToken,
        Cookie: await this.cookiesService.getCookiesStorage(
          this.carteira.codigoFaucet
        ),
      },
    };

    const response = await axios.request(config);

    this.cookiesService.setCookiesStorage(
      this.carteira.codigoFaucet,
      response.headers["set-cookie"]
    );

    return response;
  }

  public async obterPaginaInicial(): Promise<AxiosResponse<any>> {
    const dadosStorageCookie = await this.cookiesService.getCookiesStorage(
      this.carteira.codigoFaucet
    );

    let config = {
      method: "get",
      url: `https://${this.carteira.host}`,
      headers: {
        ...this.headers,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        Cookie: dadosStorageCookie?.join(";"),
      },
    };

    const response = await axios.request(config);

    this.cookiesService.setCookiesStorage(
      this.carteira.codigoFaucet,
      response.headers["set-cookie"]
    );

    return response;
  }

  public async obterReferencia(): Promise<AxiosResponse<any>> {
    let config = {
      method: "get",
      url: `https://${this.carteira.host}/referral-program`,
      headers: {
        ...this.headers,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        Cookie: await this.cookiesService.getCookiesStorage(
          this.carteira.codigoFaucet
        ),
      },
    };

    const response = await axios.request(config);

    this.cookiesService.setCookiesStorage(
      this.carteira.codigoFaucet,
      response.headers["set-cookie"]
    );

    return response;
  }

  public async obterSettings(): Promise<AxiosResponse<any>> {
    let config = {
      method: "get",
      url: `https://${this.carteira.host}/settings`,
      headers: {
        ...this.headers,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        Cookie: await this.cookiesService.getCookiesStorage(
          this.carteira.codigoFaucet
        ),
      },
    };

    const response = await axios.request(config);

    this.cookiesService.setCookiesStorage(
      this.carteira.codigoFaucet,
      response.headers["set-cookie"]
    );

    return response;
  }
}
