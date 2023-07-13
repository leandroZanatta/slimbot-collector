import {
  IFaucetCarteiraProps,
  carteiraMetaData,
} from "../repository/model/carteira/Carteira.meta";
import CadastroService from "../service/CadastroService";
import { fecharModal, selecionarCarteira } from "../store/slices/CarteiraSlice";
import { buscarCarteirasThunk } from "../store/thunk/CarteiraThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import useUsuarios from "./useUsuarios";
import { useDb } from "./useDb";
import {
  getSiteKey,
  getCrsfToken,
  isLogged,
  isEmailValid,
  getValorSaque,
  getCarteiraTransferencia,
  getUrlReferencia,
} from "../utilitarios/SiteScraping";
import CaptchaService from "../service/CaptchaService";
import ConfiguracaoRepository from "../repository/ConfiguracaoRepository";
import Configuracao from "../repository/model/configuracao/Configuracao";
import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import FaucetRepository from "../repository/FaucetRepository";
import CarteiraRepository from "../repository/CarteiraRepository";
import UsuarioRepository from "../repository/UsuarioRepository";
import Carteira from "../repository/model/carteira/Carteira";

export default function useCarteira() {
  const { db } = useDb();
  const { usuarioSelecionado } = useUsuarios();

  const carteiras = useAppSelector(
    (state: any) => state.CarteiraSlice.carteiras
  );

  const carteira = useAppSelector((state: any) => state.CarteiraSlice.carteira);

  const modalCarteiraAberta = useAppSelector(
    (state: any) => state.CarteiraSlice.modalCarteiraAberta
  );

  const dispatch = useAppDispatch();

  const fecharModalCarteira = () => {
    dispatch(fecharModal());
  };

  const abrirUrlValidacao = async (
    codigoCarteira: number,
    urlValicacao: string
  ) => {
    const config: IConfiguracaoProps | null = await new ConfiguracaoRepository(
      db
    ).findFirst(Configuracao.Builder());

    const carteira = await new CarteiraRepository(db).buscarCarteira(
      codigoCarteira
    );

    const cadastroService = new CadastroService(carteira, usuarioSelecionado);

    var retornoPaginaInicial = await cadastroService.obterPaginaInicial();

    let crsfToken: string = getCrsfToken(retornoPaginaInicial.data);
    const sitekey: string = getSiteKey(retornoPaginaInicial.data);

    while (!isLogged(retornoPaginaInicial.data)) {
      const tokenLogin = await new CaptchaService().obterCaptcha({
        host: carteira.host,
        siteKey: sitekey,
        captchaUrl: config!.captchaHost,
      });

      await cadastroService.efetuarLogin(crsfToken, tokenLogin);

      retornoPaginaInicial = await cadastroService.obterPaginaInicial();

      crsfToken = getCrsfToken(retornoPaginaInicial.data);
    }

    await cadastroService.abrirUrlValidacao(crsfToken, urlValicacao);
  };

  const atualizarCarteiraTransferencia = async (
    codigoCarteira: number,
    carteiraTransferencia: string
  ) => {
    const config: IConfiguracaoProps | null = await new ConfiguracaoRepository(
      db
    ).findFirst(Configuracao.Builder());

    const carteira = await new CarteiraRepository(db).buscarCarteira(
      codigoCarteira
    );

    const cadastroService = new CadastroService(carteira, usuarioSelecionado);

    var retornoPaginaInicial = await cadastroService.obterPaginaInicial();

    let crsfToken: string = getCrsfToken(retornoPaginaInicial.data);
    const sitekey: string = getSiteKey(retornoPaginaInicial.data);

    while (!isLogged(retornoPaginaInicial.data)) {
      crsfToken = getCrsfToken(retornoPaginaInicial.data);

      const tokenLogin = await new CaptchaService().obterCaptcha({
        host: carteira.host,
        siteKey: sitekey,
        captchaUrl: config!.captchaHost,
      });

      await cadastroService.efetuarLogin(crsfToken, tokenLogin);

      retornoPaginaInicial = await cadastroService.obterPaginaInicial();

      crsfToken = getCrsfToken(retornoPaginaInicial.data);
    }

    const resultado = await cadastroService.atualizarCarteiraTransferencia(
      crsfToken,
      carteiraTransferencia
    );

    debugger;
    console.log(resultado);
  };

  const editarCarteira = (carteira: IFaucetCarteiraProps) => {
    dispatch(selecionarCarteira(carteira));
  };

  const atualizarInfomacaoSite = async (
    carteira: IFaucetCarteiraProps,
    addLoading: any
  ) => {
    addLoading(`${carteira.descricao} - Buscando dados do site...`);

    const configuracaoRepository = new ConfiguracaoRepository(db);
    const cadastroService = new CadastroService(carteira, usuarioSelecionado);
    const captchaService = new CaptchaService();

    const config: IConfiguracaoProps | null =
      await configuracaoRepository.findFirst(Configuracao.Builder());

    if (config) {
      if (!carteira.ativo && carteira.situacao == 0) {
        const retornoPaginaCadastro =
          await cadastroService.obterPaginaCadastro();

        const sitekey: string = getSiteKey(retornoPaginaCadastro.data);
        var crsfToken: string = getCrsfToken(retornoPaginaCadastro.data);

        addLoading(`${carteira.descricao} - Resolvendo Captcha...`);

        const tokenCaptcha = await captchaService.obterCaptcha({
          host: carteira.host,
          siteKey: sitekey,
          captchaUrl: config.captchaHost,
        });

        addLoading(`${carteira.descricao} - Efetuando cadastro...`);

        const retornoCadastro = await cadastroService.efetuarCadastro(
          crsfToken,
          tokenCaptcha
        );

        if (retornoCadastro.status === 200) {
          if (
            retornoCadastro.headers["content-type"].indexOf("text/html") >= 0 ||
            retornoCadastro.data.success
          ) {
            await validarAutenticacaoSite(
              cadastroService,
              carteira,
              config,
              addLoading
            );

            return;
          }
        } else {
          if (
            retornoCadastro.data.error[0] ===
            "You cannot create more than one account"
          ) {
            // Problemas de IP já registrou conta
          }
        }
      }

      await validarAutenticacaoSite(
        cadastroService,
        carteira,
        config,
        addLoading
      );
    }
  };

  const validarAutenticacaoSite = async (
    cadastroService: CadastroService,
    carteira: IFaucetCarteiraProps,
    config: IConfiguracaoProps,
    addLoading: any
  ) => {
    addLoading(`${carteira.descricao} - Buscando dados de autenticação...`);

    var retornoPaginaInicial = await cadastroService.obterPaginaInicial();

    var crsfToken: string = getCrsfToken(retornoPaginaInicial.data);
    const sitekey: string = getSiteKey(retornoPaginaInicial.data);

    while (!isLogged(retornoPaginaInicial.data)) {
      addLoading(`${carteira.descricao} - Resolvendo Captcha...`);

      crsfToken = getCrsfToken(retornoPaginaInicial.data);

      const tokenLogin = await new CaptchaService().obterCaptcha({
        host: carteira.host,
        siteKey: sitekey,
        captchaUrl: config.captchaHost,
      });

      addLoading(`${carteira.descricao} - Efetuando login...`);

      await cadastroService.efetuarLogin(crsfToken, tokenLogin);

      retornoPaginaInicial = await cadastroService.obterPaginaInicial();
    }

    const emailValido: boolean = isEmailValid(retornoPaginaInicial.data);

    const valorSaque: number = getValorSaque(retornoPaginaInicial.data);

    var retornoPaginaSettings = await cadastroService.obterSettings();

    var carteiraTransferencia: string = getCarteiraTransferencia(
      retornoPaginaSettings.data
    );

    addLoading(`${carteira.descricao} - Salvando dados...`);

    new FaucetRepository(db).atualizarSituacaoFaucet(
      carteira.codigoFaucet,
      emailValido,
      emailValido ? 3 : 2,
      valorSaque,
      carteiraTransferencia
    );

    try {
      var retornoPaginaReferencia = await cadastroService.obterReferencia();

      const urlReferencia: string = getUrlReferencia(
        retornoPaginaReferencia.data,
        carteira.host
      );

      const refer = await new CaptchaService().enviarUrlReferencia(
        {
          urlReferencia: urlReferencia,
          email: usuarioSelecionado.email,
          senha: usuarioSelecionado.senha,
          carteira: carteira.descricao,
        },
        config.captchaHost
      );

      if (
        usuarioSelecionado.refer == null ||
        usuarioSelecionado.refer != refer
      ) {
        new UsuarioRepository(db).atualizarRefer(refer);
      }

      if (!carteira.referenciado) {
        new CarteiraRepository(db).setarReferenciado(carteira.id);
      }
    } catch (e) {
      console.log(e);
    }

    buscarCarteiras();
  };

  const buscarCarteiras = () => {
    dispatch(
      buscarCarteirasThunk({ db, codigoUsuario: usuarioSelecionado.id })
    );
  };

  return {
    carteiras,
    carteira,
    modalCarteiraAberta,
    fecharModalCarteira,
    editarCarteira,
    buscarCarteiras,
    atualizarInfomacaoSite,
    atualizarCarteiraTransferencia,
    abrirUrlValidacao,
  };
}
